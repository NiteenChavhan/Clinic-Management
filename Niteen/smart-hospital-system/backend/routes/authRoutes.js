const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getCurrentUser, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

// Protected routes
router.route('/me').get(protect, getCurrentUser);
router.route('/profile').put(protect, updateUserProfile);

module.exports = router;