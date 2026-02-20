const Patient = require('../models/Patient');
const Department = require('../models/Department');

// Get current queue for a department
const getQueue = async (req, res) => {
  try {
    const { department } = req.params;
    const { status = 'waiting' } = req.query;

    // Query patients with specific department and status
    const patients = await Patient.find({ 
      department, 
      status 
    }).sort({ 
      // Priority: emergency first, then by creation time
      priority: -1,  // 'emergency' comes before 'normal' when sorted descending
      createdAt: 1 
    });

    res.json(patients);
  } catch (error) {
    console.error('Error getting queue:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get next patient for a department
const getNextPatient = async (req, res) => {
  try {
    const { department } = req.params;

    // Find the next patient prioritizing emergencies first
    const nextPatient = await Patient.findOne({
      department,
      status: 'waiting'
    })
    .sort({ 
      priority: -1,  // 'emergency' comes before 'normal'
      createdAt: 1   // Then sort by oldest first
    });

    if (!nextPatient) {
      return res.json(null); // No patients waiting
    }

    // Update patient status to 'serving'
    nextPatient.status = 'serving';
    await nextPatient.save();

    // Emit socket event for real-time updates
    req.app.get('io').to(nextPatient.department).emit('patientCalled', nextPatient);

    res.json(nextPatient);
  } catch (error) {
    console.error('Error getting next patient:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark patient as completed
const markPatientCompleted = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findByIdAndUpdate(
      id,
      { status: 'completed' },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Emit socket event for real-time updates
    req.app.get('io').to(patient.department).emit('patientCompleted', patient);

    res.json(patient);
  } catch (error) {
    console.error('Error marking patient as completed:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current serving patient for a department
const getCurrentServing = async (req, res) => {
  try {
    const { department } = req.params;

    const patient = await Patient.findOne({
      department,
      status: 'serving'
    });

    res.json(patient);
  } catch (error) {
    console.error('Error getting current serving patient:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Calculate estimated wait time
const calculateEstimatedWaitTime = async (req, res) => {
  try {
    const { department } = req.params;

    // Get all waiting patients for the department
    const waitingPatients = await Patient.find({
      department,
      status: 'waiting'
    }).sort({ 
      priority: -1, 
      createdAt: 1 
    });

    // Assuming average consultation time is 10 minutes
    const avgConsultationTime = 10; // minutes
    const estimatedWaitTime = waitingPatients.length * avgConsultationTime;

    res.json({ estimatedWaitTime });
  } catch (error) {
    console.error('Error calculating estimated wait time:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getQueue,
  getNextPatient,
  markPatientCompleted,
  getCurrentServing,
  calculateEstimatedWaitTime
};