const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const Content = require('../models/Content');

// @desc    Crear sesión de pago con Stripe Checkout
// @route   POST /api/payment/create-checkout-session
// @access  Private
exports.createCheckoutSession = async (req, res) => {
  try {
    const { contentId, type } = req.body; // type: 'subscription' o 'one-time'
    
    const user = await User.findById(req.user.id);
    
    // Crear o recuperar customer de Stripe
    let customerId = user.stripeCustomerId;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user._id.toString()
        }
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }
    
    let sessionConfig = {
      customer: customerId,
      payment_method_types: ['card'],
      mode: type === 'subscription' ? 'subscription' : 'payment',
      success_url: `${process.env.FRONTEND_URL}/dashboard.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/registro.html?cancelled=true`,
      metadata: {
        userId: user._id.toString(),
        type: type
      }
    };
    
    if (type === 'subscription') {
      // Pago de suscripción mensual
      sessionConfig.line_items = [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Vault Me Premium',
            description: 'Acceso completo a todo el contenido premium',
            images: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400']
          },
          unit_amount: parseInt(process.env.PRODUCT_PRICE) || 1499, // $14.99
          recurring: {
            interval: 'month'
          }
        },
        quantity: 1
      }];
    } else {
      // Pago único por contenido específico
      const content = await Content.findById(contentId);
      
      if (!content) {
        return res.status(404).json({
          success: false,
          message: 'Contenido no encontrado'
        });
      }
      
      sessionConfig.line_items = [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: content.title,
            description: content.description,
            images: [content.thumbnail]
          },
          unit_amount: content.price * 100 // Convertir a centavos
        },
        quantity: 1
      }];
      
      sessionConfig.metadata.contentId = contentId;
    }
    
    const session = await stripe.checkout.sessions.create(sessionConfig);
    
    res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url
    });
    
  } catch (error) {
    console.error('Error creando sesión de pago:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear sesión de pago',
      error: error.message
    });
  }
};

// @desc    Webhook de Stripe - Escuchar eventos de pago
// @route   POST /api/payment/webhook
// @access  Public (pero verificado con firma de Stripe)
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Error en webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Manejar diferentes eventos de Stripe
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutComplete(event.data.object);
      break;
      
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object);
      break;
      
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object);
      break;
      
    case 'customer.subscription.deleted':
      await handleSubscriptionCancelled(event.data.object);
      break;
      
    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object);
      break;
      
    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;
      
    default:
      console.log(`Evento no manejado: ${event.type}`);
  }
  
  res.json({ received: true });
};

// Función auxiliar: Completar checkout
async function handleCheckoutComplete(session) {
  const userId = session.metadata.userId;
  const type = session.metadata.type;
  
  const user = await User.findById(userId);
  
  if (type === 'subscription') {
    user.isPremium = true;
    user.subscriptionStatus = 'active';
    user.subscriptionStartDate = new Date();
    user.stripeSubscriptionId = session.subscription;
  } else if (type === 'one-time') {
    const contentId = session.metadata.contentId;
    user.purchasedContent.push({
      contentId: contentId,
      purchaseDate: new Date(),
      amount: session.amount_total / 100,
      stripePaymentId: session.payment_intent
    });
    
    // Incrementar contador de compras del contenido
    const content = await Content.findById(contentId);
    if (content) {
      await content.incrementPurchases();
    }
  }
  
  await user.save();
  
  console.log(`✅ Pago completado para usuario: ${user.email}`);
}

// Función auxiliar: Suscripción creada
async function handleSubscriptionCreated(subscription) {
  const customerId = subscription.customer;
  const user = await User.findOne({ stripeCustomerId: customerId });
  
  if (user) {
    user.isPremium = true;
    user.subscriptionStatus = 'active';
    user.stripeSubscriptionId = subscription.id;
    
    // Calcular fecha de finalización
    user.subscriptionEndDate = new Date(subscription.current_period_end * 1000);
    
    await user.save();
    console.log(`✅ Suscripción activada para: ${user.email}`);
  }
}

// Función auxiliar: Suscripción actualizada
async function handleSubscriptionUpdated(subscription) {
  const user = await User.findOne({ stripeSubscriptionId: subscription.id });
  
  if (user) {
    user.subscriptionStatus = subscription.status;
    user.subscriptionEndDate = new Date(subscription.current_period_end * 1000);
    await user.save();
  }
}

// Función auxiliar: Suscripción cancelada
async function handleSubscriptionCancelled(subscription) {
  const user = await User.findOne({ stripeSubscriptionId: subscription.id });
  
  if (user) {
    user.isPremium = false;
    user.subscriptionStatus = 'cancelled';
    await user.save();
    console.log(`❌ Suscripción cancelada para: ${user.email}`);
  }
}

// Función auxiliar: Pago exitoso
async function handlePaymentSucceeded(invoice) {
  console.log('✅ Pago procesado exitosamente');
}

// Función auxiliar: Pago fallido
async function handlePaymentFailed(invoice) {
  console.log('❌ Pago fallido');
}

// @desc    Verificar estado de sesión de pago
// @route   GET /api/payment/verify-session/:sessionId
// @access  Private
exports.verifySession = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    
    res.status(200).json({
      success: true,
      paymentStatus: session.payment_status,
      customerEmail: session.customer_email
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al verificar sesión'
    });
  }
};

// @desc    Cancelar suscripción
// @route   POST /api/payment/cancel-subscription
// @access  Private
exports.cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user.stripeSubscriptionId) {
      return res.status(400).json({
        success: false,
        message: 'No tienes una suscripción activa'
      });
    }
    
    await stripe.subscriptions.update(user.stripeSubscriptionId, {
      cancel_at_period_end: true
    });
    
    res.status(200).json({
      success: true,
      message: 'Suscripción cancelada. Tendrás acceso hasta el final del período actual.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al cancelar suscripción'
    });
  }
};
