const express = require('express');
const router = express.Router();
const {
  getAllContent,
  getContentById,
  getFullContent,
  searchContent,
  createContent,
  updateContent,
  deleteContent,
  getMyContent
} = require('../controllers/contentController');
const { protect, requireContentAccess } = require('../middleware/auth');

// Rutas públicas
router.get('/', getAllContent);
router.get('/search', searchContent);
router.get('/:id', getContentById);

// Rutas protegidas
router.get('/:id/full', protect, requireContentAccess, getFullContent);
router.get('/user/my-content', protect, getMyContent);

// Rutas de administración (agregar middleware de admin después)
router.post('/', createContent);
router.put('/:id', updateContent);
router.delete('/:id', deleteContent);

module.exports = router;
