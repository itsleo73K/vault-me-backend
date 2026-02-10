// 📦 VAULT ME - API Client
// Copia este archivo en tu carpeta de frontend

class VaultMeAPI {
  constructor(baseURL = 'http://localhost:5000/api') {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('vault_token');
  }

  // Configurar headers con autenticación
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Guardar token
  setToken(token) {
    this.token = token;
    localStorage.setItem('vault_token', token);
  }

  // Eliminar token
  clearToken() {
    this.token = null;
    localStorage.removeItem('vault_token');
  }

  // ============ AUTENTICACIÓN ============

  async register(email, password) {
    try {
      const response = await fetch(`${this.baseURL}/auth/register`, {
        method: 'POST',
        headers: this.getHeaders(false),
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        this.setToken(data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Error en registro:', error);
      return { success: false, message: 'Error de conexión' };
    }
  }

  async login(email, password) {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: this.getHeaders(false),
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        this.setToken(data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, message: 'Error de conexión' };
    }
  }

  async logout() {
    try {
      await fetch(`${this.baseURL}/auth/logout`, {
        headers: this.getHeaders()
      });
      
      this.clearToken();
      return { success: true };
    } catch (error) {
      console.error('Error en logout:', error);
      this.clearToken(); // Limpiar de todas formas
      return { success: false };
    }
  }

  async getCurrentUser() {
    try {
      const response = await fetch(`${this.baseURL}/auth/me`, {
        headers: this.getHeaders()
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      return { success: false };
    }
  }

  async verifyPremium() {
    try {
      const response = await fetch(`${this.baseURL}/auth/verify-premium`, {
        headers: this.getHeaders()
      });
      
      return await response.json();
    } catch (error) {
      return { success: false, isPremium: false };
    }
  }

  // ============ CONTENIDO ============

  async getContent(page = 1, limit = 12, filters = {}) {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...filters
      });
      
      const response = await fetch(`${this.baseURL}/content?${params}`);
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo contenido:', error);
      return { success: false, data: [] };
    }
  }

  async getContentById(id) {
    try {
      const response = await fetch(`${this.baseURL}/content/${id}`);
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo contenido:', error);
      return { success: false };
    }
  }

  async getFullContent(id) {
    try {
      const response = await fetch(`${this.baseURL}/content/${id}/full`, {
        headers: this.getHeaders()
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo contenido completo:', error);
      return { success: false };
    }
  }

  async getMyContent() {
    try {
      const response = await fetch(`${this.baseURL}/content/user/my-content`, {
        headers: this.getHeaders()
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo mi contenido:', error);
      return { success: false, data: [] };
    }
  }

  // ============ PAGOS ============

  async createCheckoutSession(type = 'subscription', contentId = null) {
    try {
      const body = { type };
      if (contentId) body.contentId = contentId;
      
      const response = await fetch(`${this.baseURL}/payment/create-checkout-session`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      
      // Si tiene URL de Stripe, redirigir
      if (data.success && data.url) {
        window.location.href = data.url;
      }
      
      return data;
    } catch (error) {
      console.error('Error creando sesión de pago:', error);
      return { success: false };
    }
  }

  async verifyPaymentSession(sessionId) {
    try {
      const response = await fetch(`${this.baseURL}/payment/verify-session/${sessionId}`, {
        headers: this.getHeaders()
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error verificando pago:', error);
      return { success: false };
    }
  }

  async cancelSubscription() {
    try {
      const response = await fetch(`${this.baseURL}/payment/cancel-subscription`, {
        method: 'POST',
        headers: this.getHeaders()
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error cancelando suscripción:', error);
      return { success: false };
    }
  }

  // ============ USUARIO ============

  async getPurchases() {
    try {
      const response = await fetch(`${this.baseURL}/user/purchases`, {
        headers: this.getHeaders()
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo compras:', error);
      return { success: false, purchases: [] };
    }
  }

  // ============ UTILIDADES ============

  isAuthenticated() {
    return !!this.token;
  }

  // Verificar si tengo acceso a un contenido
  async checkContentAccess(contentId) {
    try {
      const user = await this.getCurrentUser();
      
      if (!user.success) return false;
      
      // Si es premium, tiene acceso a todo
      if (user.user.isPremium) return true;
      
      // Verificar si compró este contenido
      const purchases = await this.getPurchases();
      if (!purchases.success) return false;
      
      return purchases.purchases.some(
        p => p.contentId._id === contentId
      );
    } catch (error) {
      return false;
    }
  }
}

// Uso en tu frontend:
// const api = new VaultMeAPI();
// await api.login('test@example.com', 'password123');
// const content = await api.getContent();
