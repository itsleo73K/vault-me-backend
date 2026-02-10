const Content = require('../models/Content');

// @desc    Obtener todo el contenido (catálogo público)
// @route   GET /api/content
// @access  Public
exports.getAllContent = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      type, 
      featured, 
      sort = '-publishedAt' 
    } = req.query;
    
    const query = { isPublished: true };
    
    // Filtrar por tipo si se especifica
    if (type) query.type = type;
    
    // Filtrar por destacados
    if (featured === 'true') query.isFeatured = true;
    
    const contents = await Content.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-media'); // No enviar URLs de media en listado público
    
    const count = await Content.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: contents.length,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: contents
    });
  } catch (error) {
    console.error('Error obteniendo contenido:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener contenido'
    });
  }
};

// @desc    Obtener un contenido específico (vista previa)
// @route   GET /api/content/:id
// @access  Public
exports.getContentById = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id)
      .select('-media'); // No enviar URLs reales en preview
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenido no encontrado'
      });
    }
    
    // Incrementar vistas
    await content.incrementViews();
    
    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener contenido'
    });
  }
};

// @desc    Obtener contenido completo (con URLs de media)
// @route   GET /api/content/:id/full
// @access  Private (requiere acceso al contenido)
exports.getFullContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenido no encontrado'
      });
    }
    
    // Verificar acceso del usuario
    const hasAccess = req.user.hasAccessToContent(content._id);
    
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'No tienes acceso a este contenido',
        requiresPurchase: true
      });
    }
    
    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener contenido completo'
    });
  }
};

// @desc    Buscar contenido
// @route   GET /api/content/search
// @access  Public
exports.searchContent = async (req, res) => {
  try {
    const { q, page = 1, limit = 12 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Proporciona un término de búsqueda'
      });
    }
    
    const contents = await Content.find({
      $text: { $search: q },
      isPublished: true
    })
      .select('-media')
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    res.status(200).json({
      success: true,
      count: contents.length,
      data: contents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en la búsqueda'
    });
  }
};

// @desc    Crear nuevo contenido (ADMIN)
// @route   POST /api/content
// @access  Private/Admin
exports.createContent = async (req, res) => {
  try {
    const content = await Content.create(req.body);
    
    res.status(201).json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Error creando contenido:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear contenido',
      error: error.message
    });
  }
};

// @desc    Actualizar contenido (ADMIN)
// @route   PUT /api/content/:id
// @access  Private/Admin
exports.updateContent = async (req, res) => {
  try {
    const content = await Content.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenido no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar contenido'
    });
  }
};

// @desc    Eliminar contenido (ADMIN)
// @route   DELETE /api/content/:id
// @access  Private/Admin
exports.deleteContent = async (req, res) => {
  try {
    const content = await Content.findByIdAndDelete(req.params.id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenido no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Contenido eliminado'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar contenido'
    });
  }
};

// @desc    Obtener contenido del usuario (comprado o premium)
// @route   GET /api/content/my-content
// @access  Private
exports.getMyContent = async (req, res) => {
  try {
    let userContent = [];
    
    // Si es premium, obtener todo el contenido
    if (req.user.hasPremiumAccess()) {
      userContent = await Content.find({ isPublished: true });
    } else {
      // Si no es premium, solo contenido comprado
      const purchasedIds = req.user.purchasedContent.map(p => p.contentId);
      userContent = await Content.find({ _id: { $in: purchasedIds } });
    }
    
    res.status(200).json({
      success: true,
      count: userContent.length,
      isPremium: req.user.hasPremiumAccess(),
      data: userContent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener tu contenido'
    });
  }
};
