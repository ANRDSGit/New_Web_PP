const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date, required: true }, // Store date of birth
  gender: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  number: { type: String, required: true }, // Added phone number field
  email: { type: String, required: true, unique: true }, // Email should be unique
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false }
});

// Virtual field to calculate age from date of birth
patientSchema.virtual('age').get(function () {
  const today = new Date();
  const birthDate = new Date(this.dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Password hash before saving

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;
