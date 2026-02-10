const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Content = require('../models/Content');

dotenv.config();

const sampleContent = [
  {
    title: 'Set Privado #01',
    description: 'Colección exclusiva de 15 fotos en calidad 4K con iluminación profesional',
    type: 'photo-set',
    price: 14.99,
    isPremiumOnly: false,
    thumbnail: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=500',
    previewImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800',
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=1200',
        quality: '4K'
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1200',
        quality: '4K'
      }
    ],
    tags: ['premium', 'exclusive', '4k'],
    isFeatured: true,
    isPublished: true
  },
  {
    title: 'Set Privado #02',
    description: 'Video exclusivo detrás de cámaras con contenido nunca antes visto',
    type: 'video',
    price: 19.99,
    isPremiumOnly: false,
    thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=500',
    previewImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
    media: [
      {
        type: 'video',
        url: 'https://example.com/video-private-1.mp4',
        quality: 'HD',
        duration: 420 // 7 minutos
      }
    ],
    tags: ['video', 'behind-the-scenes', 'hd'],
    isFeatured: true,
    isPublished: true
  },
  {
    title: 'Set Privado #03',
    description: 'Combinación de 8 fotos HD y 1 video corto exclusivo',
    type: 'mixed',
    price: 16.99,
    isPremiumOnly: false,
    thumbnail: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=500',
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=1200',
        quality: 'HD'
      },
      {
        type: 'video',
        url: 'https://example.com/video-private-2.mp4',
        quality: 'HD',
        duration: 180
      }
    ],
    tags: ['mixed', 'exclusive'],
    isPublished: true
  },
  {
    title: 'Set Privado #04',
    description: 'Set premium con 12 imágenes en calidad ultra HD',
    type: 'photo-set',
    price: 14.99,
    isPremiumOnly: false,
    thumbnail: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=500',
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=1200',
        quality: '4K'
      }
    ],
    tags: ['photos', 'ultra-hd'],
    isPublished: true
  },
  {
    title: 'Colección VIP Completa',
    description: 'Acceso a toda la biblioteca de contenido exclusivo premium',
    type: 'mixed',
    price: 49.99,
    isPremiumOnly: true,
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=500',
    media: [],
    tags: ['vip', 'complete', 'premium-only'],
    isFeatured: true,
    isPublished: true
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('📊 Conectado a MongoDB...');
    
    // Limpiar contenido existente
    await Content.deleteMany();
    console.log('🗑️  Contenido anterior eliminado');
    
    // Insertar contenido de ejemplo
    const created = await Content.insertMany(sampleContent);
    console.log(`✅ ${created.length} items de contenido creados`);
    
    console.log('\n📦 Base de datos poblada exitosamente!');
    console.log('Puedes ahora probar la API con contenido real.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

// Ejecutar seeder si este archivo se ejecuta directamente
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
