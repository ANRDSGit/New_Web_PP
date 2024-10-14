const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Patient = require('../models/Patients');
const Appointment = require('../models/Appointments'); // Ensure the path is correct
const nodemailer = require('nodemailer'); // Import nodemailer

const router = express.Router();
const SECRET_KEY = "secret"; // Use a strong, consistent secret key

const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service
  auth: {
    user: 'uthwarinpn@gmail.com', // Your email address
    pass: 'rmsb ymow yuck wpzx', // Your email password
  },
});


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

// Patient Signup Route
// Patient Signup Route
router.post('/signup', async (req, res) => {
  const { name, dob, gender, bloodGroup, number, email, password } = req.body;

  try {
    // Check if patient already exists
    let patient = await Patient.findOne({ email });
    if (patient) return res.status(400).send('Patient already exists');

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    patient = new Patient({ name, dob, gender, bloodGroup, number, email, password: hashedPassword, isVerified: false });
    await patient.save();

    // Generate email verification token (valid for 1 hour)
    const verificationToken = jwt.sign({ id: patient._id, email: patient.email }, SECRET_KEY, { expiresIn: '1h' });

    // Email content with verification link
    const verificationUrl = `http://localhost:7000/api/auth/verify-email?token=${verificationToken}`;
    const mailOptions = {
      from: 'uthwarinpn@gmail.com',
      to: email,
      subject: 'Email Verification',
      text: `Please verify your email by clicking the following link: ${verificationUrl}`,
    };

    // Send the verification email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending verification email: ', err);
        return res.status(500).send('Error sending verification email');
      }

      console.log('Verification email sent: ' + info.response);
      // Only send response after email is sent successfully
      res.status(201).send('Account created successfully. Please verify your email.');
      
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});



// Email Verification Route
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  try {
    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY);
    
    // Find the patient and mark them as verified
    let patient = await Patient.findById(decoded.id);
    if (!patient) return res.status(400).send('Invalid token');

    patient.isVerified = true;
    await patient.save();

    res.send('Email verified successfully. You can now log in.');
  } catch (error) {
    res.status(400).send('Invalid or expired token');
  }
});




// Login Route
// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if patient exists
    let patient = await Patient.findOne({ email });
    if (!patient) return res.status(400).send('Invalid Email or password');

    // Check if email is verified
    if (!patient.isVerified) return res.status(400).send('Please verify your email before logging in.');

    // Check password
    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) return res.status(400).send('Invalid Email or password');

    // Generate JWT token
    const token = jwt.sign({ id: patient._id, name: patient.name }, SECRET_KEY, { expiresIn: '1h' });

    // Send login email notification
    sendLoginEmail(patient.email, patient.name);

    // Return token and login success message
    res.status(200).json({ 
      token, 
      user: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
      }, 
      message: 'Login successful' 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized access' });

  jwt.verify(token, SECRET_KEY, (err, patient) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.patient = patient;
    next();
  });
};

// Get Patient Profile Data
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const patient = await Patient.findById(req.patient.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Reset Password
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


router.post('/request-delete-account', authenticateToken, async (req, res) => {
  try {
    const patient = await Patient.findById(req.patient.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    // Generate delete token (valid for 1 hour)
    const deleteToken = jwt.sign({ id: patient._id }, SECRET_KEY, { expiresIn: '1h' });

    // Create delete confirmation link
    const deleteUrl = `http://localhost:7000/api/auth/confirm-delete-account?token=${deleteToken}`;

    // Email content
    const mailOptions = {
      from: 'uthwarinpn@gmail.com',
      to: patient.email,
      subject: 'Confirm Account Deletion',
      text: `Hi ${patient.name}, \n\nYou requested to delete your account. Please confirm the deletion by clicking the following link: ${deleteUrl}. \n\nIf you did not request this, please ignore this email.`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending delete confirmation email:', error);
        return res.status(500).json({ error: 'Failed to send confirmation email' });
      }

      console.log('Delete confirmation email sent:', info.response);
      res.status(200).json({ message: 'Delete confirmation email sent. Please check your email to confirm.' });
    });
  } catch (error) {
    console.error('Error sending delete confirmation email:', error);
    res.status(500).json({ error: 'Server error' });
  }
});



// Delete Patient Account
router.get('/confirm-delete-account', async (req, res) => {
  const { token } = req.query;

  try {
    // Verify delete token
    const decoded = jwt.verify(token, SECRET_KEY);
    
    // Find the patient and delete account
    let patient = await Patient.findById(decoded.id);
    if (!patient) return res.status(404).send('Patient not found');

    await Patient.findByIdAndDelete(decoded.id);

    res.send('Account deleted successfully.');
  } catch (error) {
    console.error('Delete confirmation error:', error);
    res.status(400).send('Invalid or expired token');
  }
});

// Create Appointment
router.post('/appointments', authenticateToken, async (req, res) => {
  const { date, time, appointmentType } = req.body;

  // Validate appointmentType and required fields
  if (!['physical', 'remote'].includes(appointmentType)) {
    return res.status(400).json({ message: 'Invalid appointment type' });
  }
  if (!date || !time) {
    return res.status(400).json({ message: 'Date and time are required' });
  }

  try {
    const appointment = new Appointment({
      patientId: req.patient.id, // Automatically associate with logged-in user
      patientName: req.patient.name, // Get patientName from token
      date,
      time,
      appointmentType,
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Error creating appointment' });
  }
});

// Get All Appointments for Logged-in User
router.get('/appointments/user', authenticateToken, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientName: req.patient.name });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching appointments' });
  }
});

// Search Appointments by Patient Name
router.get('/appointments/search/:patientName', authenticateToken, async (req, res) => {
  const appointments = await Appointment.find({
    patientName: new RegExp(req.params.patientName, 'i'),
  });
  res.send(appointments);
});

// Update Appointment
router.put('/appointments/:id', authenticateToken, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Error updating appointment' });
  }
});

// Delete an appointment
router.delete('/appointments/:id', authenticateToken, async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting appointment' });
  }
});
module.exports = router;
