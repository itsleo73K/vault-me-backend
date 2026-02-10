const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Por favor ingresa un email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor ingresa un email válido'
    ]
  },
  password: {
    type: String,
    required: [true, 'Por favor ingresa una contraseña'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false // No devolver password en queries por defecto
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  subscriptionStatus: {
    type: String,
    enum: ['free', 'active', 'cancelled', 'expired'],
    default: 'free'
  },
  subscriptionStartDate: {
    type: Date,
    default: null
  },
  subscriptionEndDate: {
    type: Date,
    default: null
  },
  stripeCustomerId: {
    type: String,
    default: null
  },
  stripeSubscriptionId: {
    type: String,
    default: null
  },
  purchasedContent: [{
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Content'
    },
    purchaseDate: {
      type: Date,
      default: Date.now
    },
    amount: Number,
    stripePaymentId: String
  }],
  lastLogin: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Encriptar password antes de guardar
userSchema.pre('save', async function(next) {
  // Solo hashear si el password fue modificado
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Método para verificar si tiene acceso premium
userSchema.methods.hasPremiumAccess = function() {
  if (!this.isPremium) return false;
  
  if (this.subscriptionStatus === 'active') {
    // Verificar si la suscripción no ha expirado
    if (this.subscriptionEndDate && this.subscriptionEndDate > Date.now()) {
      return true;
    }
  }
  
  return false;
};

// Método para verificar acceso a contenido específico
userSchema.methods.hasAccessToContent = function(contentId) {
  // Si es premium, tiene acceso a todo
  if (this.hasPremiumAccess()) {
    return true;
  }
  
  // Verificar si compró este contenido específico
  const purchased = this.purchasedContent.find(
    item => item.contentId.toString() === contentId.toString()
  );
  
  return !!purchased;
};

module.exports = mongoose.model('User', userSchema);
