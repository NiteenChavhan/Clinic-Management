const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const connectDB = require('./config/db');
const patientRoutes = require('./routes/patientRoutes');
const queueRoutes = require('./routes/queueRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store IO instance globally so controllers can access it
app.set('io', io);

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/departments', departmentRoutes);

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Listen for department join events
  socket.on('join_department', (department) => {
    socket.join(department);
    console.log(`Socket ${socket.id} joined department: ${department}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('Smart Hospital Queue Management API');
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = server;