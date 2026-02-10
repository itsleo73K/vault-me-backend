const express = require('express');
const router = express.Router();
const {
  createCheckoutSession,
  stripeWebhook,
  verifySession,
  cancelSubscription
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

// Webhook de Stripe (debe estar antes del middleware de JSON parsing)
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// Rutas protegidas
router.post('/create-checkout-session', protect, createCheckoutSession);
router.get('/verify-session/:sessionId', protect, verifySession);
router.post('/cancel-subscription', protect, cancelSubscription);

module.exports = router;
