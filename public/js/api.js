// ============================================
// VAULT ME - Frontend API Integration
// ============================================

const API_URL = 'http://localhost:5000/api';

// Helper para hacer peticiones autenticadas
const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('vaultme_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
    credentials: 'include'
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error en la petición');
  }

  return data;
};

// ============================================
// AUTENTICACIÓN
// ============================================

const auth = {
  // Registro
  register: async (email, password) => {
    const data = await authFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (data.token) {
      localStorage.setItem('vaultme_token', data.token);
      localStorage.setItem('vaultme_user', JSON.stringify(data.user));
    }
    
    return data;
  },

  // Login
  login: async (email, password) => {
    const data = await authFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (data.token) {
      localStorage.setItem('vaultme_token', data.token);
      localStorage.setItem('vaultme_user', JSON.stringify(data.user));
    }
    
    return data;
  },

  // Logout
  logout: async () => {
    try {
      await authFetch('/auth/logout', { method: 'GET' });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      localStorage.removeItem('vaultme_token');
      localStorage.removeItem('vaultme_user');
      window.location.href = '/index.html';
    }
  },

  // Obtener usuario actual
  getMe: async () => {
    return await authFetch('/auth/me');
  },

  // Verificar si está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('vaultme_token');
  },

  // Obtener usuario del localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('vaultme_user');
    return user ? JSON.parse(user) : null;
  }
};

// ============================================
// CONTENIDO
// ============================================

const content = {
  // Obtener todo el contenido
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await authFetch(`/content${queryString ? '?' + queryString : ''}`);
  },

  // Obtener contenido específico (preview)
  getById: async (id) => {
    return await authFetch(`/content/${id}`);
  },

  // Obtener contenido completo (requiere acceso)
  getFull: async (id) => {
    return await authFetch(`/content/${id}/full`);
  },

  // Buscar contenido
  search: async (query) => {
    return await authFetch(`/content/search?q=${encodeURIComponent(query)}`);
  }
};

// ============================================
// PAGOS
// ============================================

const payments = {
  // Crear sesión de checkout para compra única
  createCheckout: async (contentId) => {
    const data = await authFetch('/payments/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify({ contentId, paymentMethod: 'card' })
    });
    
    // Redirigir a Stripe Checkout
    if (data.url) {
      window.location.href = data.url;
    }
    
    return data;
  },

  // Crear suscripción premium
  createSubscription: async (priceId) => {
    const data = await authFetch('/payments/create-subscription', {
      method: 'POST',
      body: JSON.stringify({ priceId })
    });
    
    // Redirigir a Stripe Checkout
    if (data.url) {
      window.location.href = data.url;
    }
    
    return data;
  },

  // Obtener transacciones
  getTransactions: async () => {
    return await authFetch('/payments/transactions');
  },

  // Cancelar suscripción
  cancelSubscription: async () => {
    return await authFetch('/payments/cancel-subscription', {
      method: 'POST'
    });
  }
};

// ============================================
// UTILIDADES
// ============================================

const utils = {
  // Mostrar notificaciones
  showNotification: (message, type = 'info') => {
    // Puedes integrar una librería como Toastify aquí
    const colors = {
      success: '#22c55e',
      error: '#ef4444',
      info: '#3b82f6',
      warning: '#f59e0b'
    };

    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${colors[type]};
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      font-weight: bold;
      font-size: 14px;
      z-index: 10000;
      animation: slideIn 0.3s ease;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  },

  // Formatear precio
  formatPrice: (price, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  },

  // Formatear fecha
  formatDate: (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
};

// ============================================
// PROTECCIÓN DE RUTAS
// ============================================

const protectPage = () => {
  if (!auth.isAuthenticated()) {
    window.location.href = '/registro.html';
  }
};

const checkMembership = async () => {
  try {
    const userData = await auth.getMe();
    if (userData.data.membershipStatus !== 'active') {
      window.location.href = '/registro.html?upgrade=true';
    }
  } catch (error) {
    console.error('Error verificando membresía:', error);
    window.location.href = '/registro.html';
  }
};

// ============================================
// EXPORTAR API
// ============================================

const VaultMeAPI = {
  auth,
  content,
  payments,
  utils,
  protectPage,
  checkMembership
};

// Hacer disponible globalmente
if (typeof window !== 'undefined') {
  window.VaultMeAPI = VaultMeAPI;
}

// También exportar para módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VaultMeAPI;
}
