import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './services/socket';
import Navbar from './components/Navbar';
import RegisterPatient from './pages/RegisterPatient';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminPanel from './pages/AdminPanel';
import DisplayBoard from './pages/DisplayBoard';
import Login from './pages/Login';
import RegisterUser from './pages/RegisterUser';
import './App.css';

function App() {
  return (
    <SocketProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<RegisterPatient />} />
            <Route path="/register" element={<RegisterPatient />} />
            <Route path="/doctor" element={<DoctorDashboard />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/display" element={<DisplayBoard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register-user" element={<RegisterUser />} />
          </Routes>
        </div>
      </Router>
    </SocketProvider>
  );
}

export default App;