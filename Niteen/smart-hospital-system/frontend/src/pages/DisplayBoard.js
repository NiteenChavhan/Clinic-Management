import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DisplayBoard.css';

const DisplayBoard = () => {
  const [department, setDepartment] = useState('General Medicine');
  const [currentPatient, setCurrentPatient] = useState(null);
  const [nextPatient, setNextPatient] = useState(null);
  const [queue, setQueue] = useState([]);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState(0);
  const [departments, setDepartments] = useState([]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchData = async () => {
    try {
      // Fetch current serving patient
      const currentResponse = await axios.get(`http://localhost:5001/api/queue/department/${department}/current`);
      setCurrentPatient(currentResponse.data);

      // Fetch next patient in queue
      const nextResponse = await axios.get(`http://localhost:5001/api/queue/department/${department}?status=waiting`);
      if (nextResponse.data && nextResponse.data.length > 0) {
        // Sort by priority and arrival time to get the actual next patient
        const sortedPatients = nextResponse.data.sort((a, b) => {
          // Emergency patients first
          if (a.priority === 'emergency' && b.priority !== 'emergency') return -1;
          if (a.priority !== 'emergency' && b.priority === 'emergency') return 1;
          // Then by arrival time
          return new Date(a.createdAt) - new Date(b.createdAt);
        });
        setNextPatient(sortedPatients[0]);
      } else {
        setNextPatient(null);
      }

      // Fetch full queue
      setQueue(nextResponse.data);

      // Fetch estimated wait time
      const waitTimeResponse = await axios.get(`http://localhost:5001/api/queue/department/${department}/wait-time`);
      setEstimatedWaitTime(waitTimeResponse.data.estimatedWaitTime);
    } catch (error) {
      console.error('Error fetching display data:', error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (department) {
      fetchData();
      // Refresh data every 10 seconds
      const interval = setInterval(fetchData, 10000);
      return () => clearInterval(interval);
    }
  }, [department]);

  return (
    <div className="display-board-container">
      <div className="display-header">
        <h1>Hospital Queue Display Board</h1>
        <div className="department-selector">
          <label htmlFor="dept-select">Select Department:</label>
          <select
            id="dept-select"
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

      <div className="display-content">
        {/* Current Patient */}
        <div className="current-patient-display">
          <div className="display-section-title">NOW SERVING</div>
          {currentPatient ? (
            <div className="patient-display-card current">
              <div className="token-display">{currentPatient.tokenNumber}</div>
              <div className="patient-details">
                <div className="patient-name">{currentPatient.name}</div>
                <div className="patient-priority">{currentPatient.priority.toUpperCase()}</div>
              </div>
            </div>
          ) : (
            <div className="no-patient-display">
              <div className="no-patient-text">NO PATIENT BEING SERVED</div>
            </div>
          )}
        </div>

        {/* Next Patient */}
        <div className="next-patient-display">
          <div className="display-section-title">NEXT</div>
          {nextPatient ? (
            <div className="patient-display-card next">
              <div className="token-display">{nextPatient.tokenNumber}</div>
              <div className="patient-details">
                <div className="patient-name">{nextPatient.name}</div>
                <div className="patient-priority">{nextPatient.priority.toUpperCase()}</div>
              </div>
            </div>
          ) : (
            <div className="no-patient-display">
              <div className="no-patient-text">NO PATIENTS IN QUEUE</div>
            </div>
          )}
        </div>

        {/* Queue Info */}
        <div className="queue-info-display">
          <div className="display-section-title">QUEUE INFORMATION</div>
          <div className="queue-stats">
            <div className="stat-item">
              <div className="stat-label">Waiting Patients</div>
              <div className="stat-value">{queue.length}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Estimated Wait Time</div>
              <div className="stat-value">{estimatedWaitTime} mins</div>
            </div>
          </div>
        </div>

        {/* Full Queue */}
        <div className="full-queue-display">
          <div className="display-section-title">WAITING QUEUE</div>
          {queue.length > 0 ? (
            <div className="queue-list-display">
              {queue.slice(0, 10).map((patient, index) => (
                <div 
                  key={patient._id} 
                  className={`queue-item ${patient.priority === 'emergency' ? 'emergency' : ''}`}
                >
                  <span className="queue-rank">{index + 1}.</span>
                  <span className="queue-token">{patient.tokenNumber}</span>
                  <span className="queue-priority">{patient.priority}</span>
                </div>
              ))}
              {queue.length > 10 && (
                <div className="more-patients">+{queue.length - 10} more patients...</div>
              )}
            </div>
          ) : (
            <div className="no-patients-queue">No patients in queue</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayBoard;