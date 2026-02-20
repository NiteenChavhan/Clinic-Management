const Patient = require('../models/Patient');
const Department = require('../models/Department');

// Register a new patient
const registerPatient = async (req, res) => {
  try {
    const { name, age, department, priority = 'normal' } = req.body;

    // Find or create department
    let dept = await Department.findOne({ name: department });
    if (!dept) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Increment the department's current token
    dept.currentToken += 1;
    await dept.save();

    // Generate token number (e.g., C-23)
    const tokenNumber = `${dept.prefix}-${dept.currentToken}`;

    // Create patient
    const patient = new Patient({
      name,
      age,
      department,
      tokenNumber,
      priority,
      status: 'waiting'
    });

    await patient.save();

    // Emit socket event for real-time updates
    req.app.get('io').to(patient.department).emit('patientAdded', patient);

    res.status(201).json({
      success: true,
      patient: {
        _id: patient._id,
        name: patient.name,
        age: patient.age,
        department: patient.department,
        tokenNumber: patient.tokenNumber,
        priority: patient.priority,
        status: patient.status,
        createdAt: patient.createdAt
      }
    });
  } catch (error) {
    console.error('Error registering patient:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get patients by department
const getPatientsByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    const { status = 'waiting' } = req.query;

    const patients = await Patient.find({ 
      department, 
      status 
    }).sort({ createdAt: 1 });

    res.json(patients);
  } catch (error) {
    console.error('Error getting patients:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update patient status
const updatePatientStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const patient = await Patient.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Emit socket event for real-time updates
    req.app.get('io').to(patient.department).emit('patientStatusUpdated', patient);

    res.json(patient);
  } catch (error) {
    console.error('Error updating patient status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get patient by token number
const getPatientByToken = async (req, res) => {
  try {
    const { tokenNumber } = req.params;

    const patient = await Patient.findOne({ tokenNumber });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(patient);
  } catch (error) {
    console.error('Error getting patient by token:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerPatient,
  getPatientsByDepartment,
  updatePatientStatus,
  getPatientByToken
};