const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El contenido debe tener un título'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'El contenido debe tener una descripción']
  },
  type: {
    type: String,
    enum: ['video', 'photo-set', 'mixed'],
    required: true
  },
  price: {
    type: Number,
    required: [true, 'El contenido debe tener un precio'],
    min: 0
  },
  isPremiumOnly: {
    type: Boolean,
    default: false
  },
  thumbnail: {
    type: String,
    required: true
  },
  previewImage: {
    type: String,
    default: null
  },
  media: [{
    type: {
      type: String,
      enum: ['video', 'image'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    filename: String,
    size: Number, // en bytes
    duration: Number, // para videos, en segundos
    quality: {
      type: String,
      enum: ['SD', 'HD', '4K', '8K'],
      default: 'HD'
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  views: {
    type: Number,
    default: 0
  },
  purchases: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índices para mejorar búsquedas
contentSchema.index({ title: 'text', description: 'text', tags: 'text' });
contentSchema.index({ publishedAt: -1 });
contentSchema.index({ isFeatured: -1, publishedAt: -1 });

// Método para incrementar vistas
contentSchema.methods.incrementViews = async function() {
  this.views += 1;
  await this.save();
};

// Método para incrementar compras
contentSchema.methods.incrementPurchases = async function() {
  this.purchases += 1;
  await this.save();
};

module.exports = mongoose.model('Content', contentSchema);
