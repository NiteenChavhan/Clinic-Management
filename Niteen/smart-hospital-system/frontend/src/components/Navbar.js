import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { isAuthenticated, getUser, logout } from '../services/auth';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const isLoggedIn = isAuthenticated();
  const user = getUser();

  const handleLogout = () => {
    logout();
    window.location.href = '/'; // Redirect to home after logout
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">Smart Hospital Queue</Link>
        <ul className="nav-menu">
          {isLoggedIn ? (
            <>
              {user?.role === 'receptionist' || user?.role === 'admin' ? (
                <li className="nav-item">
                  <Link to="/register" className="nav-link">Register Patient</Link>
                </li>
              ) : null}
              
              {user?.role === 'doctor' || user?.role === 'admin' ? (
                <li className="nav-item">
                  <Link to="/doctor" className="nav-link">Doctor Dashboard</Link>
                </li>
              ) : null}
              
              {user?.role === 'admin' ? (
                <li className="nav-item">
                  <Link to="/admin" className="nav-link">Admin Panel</Link>
                </li>
              ) : null}
              
              <li className="nav-item">
                <Link to="/display" className="nav-link">Display Board</Link>
              </li>
              
              <li className="nav-item">
                <span className="nav-link welcome-text">Welcome, {user?.name}</span>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/register-user" className="nav-link">Register</Link>
              </li>
              
              {/* Show public pages only when not logged in */}
              <li className="nav-item">
                <Link to="/register" className="nav-link">Register Patient</Link>
              </li>
              <li className="nav-item">
                <Link to="/display" className="nav-link">Display Board</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;