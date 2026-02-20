const express = require('express');
const router = express.Router();
const { 
  registerPatient, 
  getPatientsByDepartment, 
  updatePatientStatus,
  getPatientByToken
} = require('../controllers/patientController');

// Register a new patient
router.post('/', registerPatient);

// Get patients by department
router.get('/department/:department', getPatientsByDepartment);

// Update patient status
router.put('/:id/status', updatePatientStatus);

// Get patient by token number
router.get('/token/:tokenNumber', getPatientByToken);

module.exports = router;