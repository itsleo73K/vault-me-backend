const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Proteger rutas - verificar si el usuario está autenticado
exports.protect = async (req, res, next) => {
  let token;
  
  // Verificar si el token viene en el header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // O si viene en las cookies
  else if (req.cookies.token) {
    token = req.cookies.token;
  }
  
  // Verificar que el token existe
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado - No se proporcionó token de acceso'
    });
  }
  
  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Obtener usuario del token (sin password)
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    next();
  } catch (error) {
    console.error('Error en verificación de token:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
};

// Verificar si el usuario tiene acceso premium
exports.requirePremium = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Debes estar autenticado'
    });
  }
  
  if (!req.user.hasPremiumAccess()) {
    return res.status(403).json({
      success: false,
      message: 'Necesitas una suscripción premium para acceder a este contenido',
      requiresUpgrade: true
    });
  }
  
  next();
};

// Verificar acceso a contenido específico
exports.requireContentAccess = async (req, res, next) => {
  const contentId = req.params.id || req.params.contentId;
  
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Debes estar autenticado'
    });
  }
  
  // Verificar si tiene acceso (premium o comprado)
  if (!req.user.hasAccessToContent(contentId)) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este contenido',
      requiresPurchase: true
    });
  }
  
  next();
};

// Generar JWT Token
exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Enviar token en cookie
exports.sendTokenResponse = (user, statusCode, res) => {
  const token = exports.generateToken(user._id);
  
  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS en producción
    sameSite: 'strict'
  };
  
  res.status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        isPremium: user.isPremium,
        subscriptionStatus: user.subscriptionStatus
      }
    });
};
