const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Patient = require('../models/Patients');
const Appointment = require('../models/Appointments'); // Ensure the path is correct
const nodemailer = require('nodemailer'); // Import nodemailer

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || 'strongsecretkey'; // Use environment variables for secrets

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service
  auth: {
    user: process.env.GMAIL_USER, // Set in .env file
    pass: process.env.GMAIL_PASS, // Set in .env file
  },
});

// Helper function to send email notifications
const sendLoginEmail = (email, name) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Login Notification',
    text: `Hi ${name}, you have successfully logged in. If this wasn't you, please secure your account immediately.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending login email:', error);
    } else {
      console.log('Login email sent:', info.response);
    }
  });
};

// ** Patient Signup Route ** //
router.post('/signup', async (req, res) => {
  const { name, dob, gender, bloodGroup, number, email, password } = req.body;

  try {
    let patient = await Patient.findOne({ email });
    if (patient) return res.status(400).send('Patient already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    patient = new Patient({
      name, dob, gender, bloodGroup, number, email,
      password: hashedPassword, isVerified: false
    });
    await patient.save();

    // Generate email verification token
    const verificationToken = jwt.sign({ id: patient._id, email: patient.email }, SECRET_KEY, { expiresIn: '1h' });
    const verificationUrl = `${process.env.BASE_URL}/api/auth/verify-email?token=${verificationToken}`;
    
    // Email content
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Email Verification',
      text: `Please verify your email by clicking the following link: ${verificationUrl}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending verification email: ', err);
        return res.status(500).send('Error sending verification email');
      }
      console.log('Verification email sent:', info.response);
      res.status(201).send('Account created successfully. Please verify your email.');
    });

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ** Email Verification Route ** //
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    let patient = await Patient.findById(decoded.id);
    if (!patient) return res.status(400).send('Invalid token');

    patient.isVerified = true;
    await patient.save();

    res.send('Email verified successfully. You can now log in.');
  } catch (error) {
    res.status(400).send('Invalid or expired token');
  }
});

// ** Login Route ** //
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let patient = await Patient.findOne({ email });
    if (!patient) return res.status(400).send('Invalid email or password');
    if (!patient.isVerified) return res.status(400).send('Please verify your email first');

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) return res.status(400).send('Invalid email or password');

    const token = jwt.sign({ id: patient._id, name: patient.name }, SECRET_KEY, { expiresIn: '1h' });
    sendLoginEmail(patient.email, patient.name);

    res.status(200).json({
      token,
      user: { id: patient._id, name: patient.name, email: patient.email },
      message: 'Login successful'
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ** Middleware for Token Authentication ** //
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized access' });

  jwt.verify(token, SECRET_KEY, (err, patient) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.patient = patient;
    next();
  });
};

// ** Patient Profile Route ** //
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const patient = await Patient.findById(req.patient.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ** Password Reset Route ** //
router.put('/reset-password', authenticateToken, async (req, res) => {
  const { newPassword } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await Patient.findByIdAndUpdate(req.patient.id, { password: hashedPassword });
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: 'Error resetting password' });
  }
});

// ** Delete Account Request Route ** //
router.post('/request-delete-account', authenticateToken, async (req, res) => {
  try {
    const patient = await Patient.findById(req.patient.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const deleteToken = jwt.sign({ id: patient._id }, SECRET_KEY, { expiresIn: '1h' });
    const deleteUrl = `${process.env.BASE_URL}/api/auth/confirm-delete-account?token=${deleteToken}`;

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: patient.email,
      subject: 'Confirm Account Deletion',
      text: `Hi ${patient.name}, \n\nPlease confirm the deletion of your account by clicking the link: ${deleteUrl}.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: 'Failed to send confirmation email' });
      }
      res.status(200).json({ message: 'Delete confirmation email sent' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ** Confirm Account Deletion Route ** //
router.get('/confirm-delete-account', async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    let patient = await Patient.findById(decoded.id);
    if (!patient) return res.status(404).send('Patient not found');

    await Patient.findByIdAndDelete(decoded.id);
    res.send('Account deleted successfully.');
  } catch (error) {
    res.status(400).send('Invalid or expired token');
  }
});

// ** Create Appointment Route with Slot Check ** //
const generateTimeSlots = () => {
  const slots = [];
  for (let i = 16; i <= 20; i++) {
      slots.push(`${i}:00`, `${i}:30`);
  }
  return slots;
};

// ** Get Available Time Slots for a Given Date ** //
router.get('/appointments/available-times/:date', authenticateToken, async (req, res) => {
  const { date } = req.params;

  if (!date) {
      return res.status(400).json({ message: 'Please provide a valid date.' });
  }

  try {
      // Fetch appointments for the selected date
      const bookedAppointments = await Appointment.find({
          date: new Date(date)
      });

      // Generate all time slots (e.g., 4:00 PM, 4:30 PM, etc.)
      const allSlots = generateTimeSlots();

      // Group appointments by time slots and count how many appointments exist for each slot
      const bookedSlots = {};
      bookedAppointments.forEach(appointment => {
          if (!bookedSlots[appointment.time]) {
              bookedSlots[appointment.time] = 1;
          } else {
              bookedSlots[appointment.time]++;
          }
      });

      // Filter out time slots that already have 4 or more appointments booked
      const availableSlots = allSlots.filter(slot => {
          return !bookedSlots[slot] || bookedSlots[slot] < 4;
      });

      if (availableSlots.length === 0) {
          return res.status(200).json({ message: 'No slots available on this date.' });
      }

      res.status(200).json(availableSlots);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching available slots.' });
  }
});

// ** Create Appointment Route ** //
router.post('/appointments', authenticateToken, async (req, res) => {
  const { date, time, appointmentType } = req.body;

  if (!['physical', 'remote'].includes(appointmentType) || !date || !time) {
      return res.status(400).json({ message: 'Invalid appointment data' });
  }

  try {
      // Check if the time slot for the given date is available
      const existingAppointments = await Appointment.find({
          date: new Date(date), time
      });

      if (existingAppointments.length >= 4) {
          return res.status(400).json({ message: 'No more slots available at this time.' });
      }

      // Create and save the new appointment
      const appointment = new Appointment({
          patientId: req.patient.id,
          patientName: req.patient.name,
          email: req.patient.email,
          date, time, appointmentType,
      });

      await appointment.save();
      res.status(201).json(appointment);
  } catch (error) {
      res.status(500).json({ error: 'Error creating appointment' });
  }
});

// ** Get Calendar Appointments ** //
router.get('/appointments/user', authenticateToken, async (req, res) => {
  try {
      const appointments = await Appointment.find({ patientId: req.patient.id });

      const formattedAppointments = appointments.map((appointment) => ({
          date: appointment.date.toISOString().split('T')[0],
          time: appointment.time,
          appointmentType: appointment.appointmentType,
      }));

      res.status(200).json(formattedAppointments);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching calendar appointments.' });
  }
});

module.exports = router;
