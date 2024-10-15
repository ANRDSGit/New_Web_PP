const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientName: String,
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }, // Link to Patient model
  email: { type: String, required: true }, // Email as reference
  date: { type: Date, required: true },
  time: { type: String, required: true }, // Time as intervals from 4pm-9pm
  appointmentType: { type: String, enum: ['physical', 'remote'], required: true },
  createdAt: { type: Date, default: Date.now },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
