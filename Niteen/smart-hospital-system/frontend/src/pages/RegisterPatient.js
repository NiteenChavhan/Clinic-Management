import React, { useState } from 'react';
import axios from 'axios';
import './RegisterPatient.css';

const RegisterPatient = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    department: 'General Medicine',
    priority: 'normal'
  });
  const [tokenNumber, setTokenNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const departments = [
    'General Medicine',
    'Cardiology',
    'Orthopedics',
    'Neurology',
    'Pediatrics',
    'Ophthalmology',
    'ENT',
    'Dermatology'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5001/api/patients', {
        name: formData.name,
        age: parseInt(formData.age),
        department: formData.department,
        priority: formData.priority
      });

      setTokenNumber(response.data.patient.tokenNumber);
      setFormData({
        name: '',
        age: '',
        department: 'General Medicine',
        priority: 'normal'
      });
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while registering patient');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-patient-container">
      <div className="card">
        <h2>Patient Registration</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        {tokenNumber ? (
          <div className="success-message">
            <h3>Registration Successful!</h3>
            <p>Your Token Number: <strong>{tokenNumber}</strong></p>
            <p>Please wait for your turn.</p>
            <button 
              className="btn btn-primary"
              onClick={() => setTokenNumber('')}
            >
              Register Another Patient
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="registration-form">
            <div className="form-group">
              <label htmlFor="name">Full Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="age">Age:</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min="1"
                max="120"
              />
            </div>

            <div className="form-group">
              <label htmlFor="department">Department:</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority:</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="normal">Normal</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register Patient'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterPatient;