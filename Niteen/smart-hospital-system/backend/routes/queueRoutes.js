const express = require('express');
const router = express.Router();
const { 
  getQueue, 
  getNextPatient, 
  markPatientCompleted,
  getCurrentServing,
  calculateEstimatedWaitTime
} = require('../controllers/queueController');

// Get queue for a department
router.get('/department/:department', getQueue);

// Get next patient for a department
router.get('/department/:department/next', getNextPatient);

// Mark patient as completed
router.put('/patient/:id/complete', markPatientCompleted);

// Get current serving patient for a department
router.get('/department/:department/current', getCurrentServing);

// Calculate estimated wait time
router.get('/department/:department/wait-time', calculateEstimatedWaitTime);

module.exports = router;