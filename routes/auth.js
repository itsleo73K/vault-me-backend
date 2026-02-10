const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  verifyPremium
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Rutas públicas
router.post('/register', register);
router.post('/login', login);

// Rutas protegidas
router.get('/logout', protect, logout);
router.get('/me', protect, getMe);
router.get('/verify-premium', protect, verifyPremium);

module.exports = router;
