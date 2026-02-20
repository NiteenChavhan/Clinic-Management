import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const AdminPanel = () => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({ name: '', prefix: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setError('Failed to fetch departments');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        // Update existing department
        await axios.put(`http://localhost:5001/api/departments/${editingId}`, formData);
        setSuccess('Department updated successfully');
      } else {
        // Create new department
        await axios.post('http://localhost:5001/api/departments', formData);
        setSuccess('Department created successfully');
      }

      setFormData({ name: '', prefix: '' });
      setEditingId(null);
      fetchDepartments();
    } catch (error) {
      console.error('Error saving department:', error);
      setError(error.response?.data?.message || 'An error occurred while saving department');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (dept) => {
    setFormData({ name: dept.name, prefix: dept.prefix });
    setEditingId(dept._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await axios.delete(`http://localhost:5001/api/departments/${id}`);
        setSuccess('Department deleted successfully');
        fetchDepartments();
      } catch (error) {
        console.error('Error deleting department:', error);
        setError('Failed to delete department');
      }
    }
  };

  const handleCancelEdit = () => {
    setFormData({ name: '', prefix: '' });
    setEditingId(null);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="admin-panel-container">
      <div className="card">
        <h2>Admin Panel</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <div className="admin-content">
          <div className="department-management">
            <h3>Manage Departments</h3>
            
            <form onSubmit={handleSubmit} className="department-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="dept-name">Department Name:</label>
                  <input
                    type="text"
                    id="dept-name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Cardiology"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="dept-prefix">Prefix:</label>
                  <input
                    type="text"
                    id="dept-prefix"
                    name="prefix"
                    value={formData.prefix}
                    onChange={(e) => setFormData({...formData, prefix: e.target.value})}
                    placeholder="e.g., C"
                    maxLength="3"
                    required
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : editingId ? 'Update Department' : 'Add Department'}
                </button>
                
                {editingId && (
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
            
            <div className="departments-list">
              <h4>All Departments ({departments.length})</h4>
              {departments.length > 0 ? (
                <table className="departments-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Prefix</th>
                      <th>Current Token</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((dept) => (
                      <tr key={dept._id}>
                        <td>{dept.name}</td>
                        <td>{dept.prefix}</td>
                        <td>{dept.currentToken}</td>
                        <td>
                          <span className={`status ${dept.isActive ? 'active' : 'inactive'}`}>
                            {dept.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn btn-sm btn-primary"
                            onClick={() => handleEdit(dept)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(dept._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No departments found</p>
              )}
            </div>
          </div>
          
          <div className="statistics">
            <h3>System Statistics</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <h4>Total Departments</h4>
                <p className="stat-number">{departments.length}</p>
              </div>
              <div className="stat-card">
                <h4>Total Active</h4>
                <p className="stat-number">
                  {departments.filter(d => d.isActive).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;