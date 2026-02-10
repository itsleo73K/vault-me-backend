const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// @desc    Actualizar perfil de usuario
// @route   PUT /api/user/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (email) user.email = email;
    
    await user.save();
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        isPremium: user.isPremium
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar perfil'
    });
  }
});

// @desc    Obtener historial de compras
// @route   GET /api/user/purchases
// @access  Private
router.get('/purchases', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('purchasedContent.contentId');
    
    res.status(200).json({
      success: true,
      purchases: user.purchasedContent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener historial'
    });
  }
});

module.exports = router;
