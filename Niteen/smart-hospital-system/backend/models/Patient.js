const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  tokenNumber: {
    type: String,
    required: true,
    unique: true
  },
  priority: {
    type: String,
    enum: ['normal', 'emergency'],
    default: 'normal'
  },
  status: {
    type: String,
    enum: ['waiting', 'serving', 'completed', 'cancelled'],
    default: 'waiting'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  estimatedWaitTime: {
    type: Number, // in minutes
    default: 0
  }
});

module.exports = mongoose.model('Patient', patientSchema);