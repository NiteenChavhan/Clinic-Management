import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const [department, setDepartment] = useState('General Medicine');
  const [currentPatient, setCurrentPatient] = useState(null);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchCurrentPatient = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/queue/department/${department}/current`);
      setCurrentPatient(response.data);
    } catch (error) {
      console.error('Error fetching current patient:', error);
    }
  };

  const fetchQueue = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/queue/department/${department}?status=waiting`);
      setQueue(response.data);
    } catch (error) {
      console.error('Error fetching queue:', error);
    }
  };

  const callNextPatient = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5001/api/queue/department/${department}/next`);
      if (response.data) {
        setCurrentPatient(response.data);
        fetchQueue(); // Refresh the queue
      } else {
        setCurrentPatient(null);
        alert('No patients in queue!');
      }
    } catch (error) {
      console.error('Error calling next patient:', error);
    } finally {
      setLoading(false);
    }
  };

  const markPatientAsCompleted = async () => {
    if (!currentPatient) return;
    
    try {
      await axios.put(`http://localhost:5001/api/queue/patient/${currentPatient._id}/complete`);
      setCurrentPatient(null);
      fetchQueue(); // Refresh the queue
    } catch (error) {
      console.error('Error marking patient as completed:', error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (department) {
      fetchCurrentPatient();
      fetchQueue();
    }
  }, [department]);

  return (
    <div className="doctor-dashboard-container">
      <div className="card">
        <h2>Doctor Dashboard</h2>
        
        <div className="dashboard-controls">
          <div className="form-group">
            <label htmlFor="department-select">Select Department:</label>
            <select
              id="department-select"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              {departments.map((dept) => (
                <option key={dept._id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Patient Section */}
        <div className="current-patient-section">
          <h3>Current Patient</h3>
          {currentPatient ? (
            <div className="patient-card current">
              <div className="patient-info">
                <h4>Token: {currentPatient.tokenNumber}</h4>
                <p><strong>Name:</strong> {currentPatient.name}</p>
                <p><strong>Age:</strong> {currentPatient.age}</p>
                <p><strong>Priority:</strong> 
                  <span className={`priority ${currentPatient.priority}`}>
                    {currentPatient.priority}
                  </span>
                </p>
              </div>
              <div className="patient-actions">
                <button 
                  className="btn btn-success"
                  onClick={markPatientAsCompleted}
                >
                  Mark as Completed
                </button>
              </div>
            </div>
          ) : (
            <div className="no-patient">
              <p>No patient is currently being served</p>
            </div>
          )}
        </div>

        {/* Queue Section */}
        <div className="queue-section">
          <div className="queue-header">
            <h3>Waiting Queue ({queue.length})</h3>
            <button 
              className="btn btn-primary"
              onClick={callNextPatient}
              disabled={loading || queue.length === 0}
            >
              {loading ? 'Calling...' : 'Call Next Patient'}
            </button>
          </div>
          
          {queue.length > 0 ? (
            <div className="queue-list">
              {queue.map((patient) => (
                <div key={patient._id} className="patient-card queue">
                  <div className="patient-info">
                    <h4>Token: {patient.tokenNumber}</h4>
                    <p><strong>Name:</strong> {patient.name}</p>
                    <p><strong>Age:</strong> {patient.age}</p>
                    <p><strong>Priority:</strong> 
                      <span className={`priority ${patient.priority}`}>
                        {patient.priority}
                      </span>
                    </p>
                    <p><strong>Arrived:</strong> {new Date(patient.createdAt).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-queue">
              <p>No patients in the queue</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;