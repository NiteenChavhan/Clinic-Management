const express = require('express');
const router = express.Router();
const { 
  getAllDepartments, 
  getDepartment, 
  createDepartment, 
  updateDepartment,
  deleteDepartment
} = require('../controllers/departmentController');

// Get all departments
router.get('/', getAllDepartments);

// Get a specific department
router.get('/:id', getDepartment);

// Create a new department
router.post('/', createDepartment);

// Update a department
router.put('/:id', updateDepartment);

// Delete a department
router.delete('/:id', deleteDepartment);

module.exports = router;