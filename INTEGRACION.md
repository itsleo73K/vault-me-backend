# 🔗 Guía de Integración Frontend-Backend

Esta guía te muestra cómo conectar tu frontend de Vault Me con el backend.

## 📦 Paso 1: Incluir el API Client

Agrega esto en el `<head>` de cada HTML:

```html
<script src="/vault-api-client.js"></script>
```

## 🎯 Paso 2: Implementaciones por Página

### 📄 index.html - Catálogo Principal

```html
<script>
  const api = new VaultMeAPI();
  
  // Cargar contenido al iniciar la página
  async function cargarCatalogo() {
    const result = await api.getContent(1, 12);
    
    if (result.success) {
      const grid = document.getElementById('main-grid');
      grid.innerHTML = ''; // Limpiar contenido de ejemplo
      
      result.data.forEach(content => {
        const card = crearTarjetaContenido(content);
        grid.innerHTML += card;
      });
    }
  }
  
  function crearTarjetaContenido(content) {
    return `
      <div class="group relative bg-zinc-900/50 rounded-3xl overflow-hidden border border-white/5 transition-all duration-500 hover:border-rose-500/50">
        <div class="aspect-[3/4] relative overflow-hidden">
          <img src="${content.thumbnail}" 
               class="w-full h-full object-cover blur-lg opacity-30 transition duration-700 group-hover:scale-110">
          
          <div class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div class="w-12 h-12 bg-rose-600/10 rounded-full flex items-center justify-center border border-rose-500/30 mb-4 group-hover:scale-110 transition">
              <i class="fas fa-lock text-rose-500"></i>
            </div>
            <h3 class="text-xs font-black uppercase tracking-tighter text-white mb-1">${content.title}</h3>
            <p class="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">${content.type} • ${content.media?.length || 0} Items</p>
          </div>
        </div>
        <div class="p-4 bg-black/20">
          <a href="detalle.html?id=${content._id}" 
             class="block w-full py-3 bg-white hover:bg-rose-600 text-black hover:text-white text-center text-[10px] font-black rounded-xl transition uppercase tracking-[0.2em]">
            Desbloquear $${content.price}
          </a>
        </div>
      </div>
    `;
  }
  
  // Verificar autenticación al cargar
  async function verificarAutenticacion() {
    if (api.isAuthenticated()) {
      const user = await api.getCurrentUser();
      if (user.success) {
        mostrarUsuarioLogueado(user.user);
      }
    }
  }
  
  function mostrarUsuarioLogueado(user) {
    // Actualizar UI para mostrar que el usuario está logueado
    const loginBtn = document.querySelector('[href="registro.html"]');
    if (loginBtn) {
      loginBtn.textContent = user.isPremium ? '👑 Premium' : 'Mi Cuenta';
      loginBtn.href = 'dashboard.html';
    }
  }
  
  // Ejecutar al cargar la página
  window.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacion();
    cargarCatalogo();
  });
</script>
```

### 📄 registro.html - Formulario de Registro y Pago

```html
<script>
  const api = new VaultMeAPI();
  
  // Capturar el ID del contenido desde la URL si viene de detalle.html
  const urlParams = new URLSearchParams(window.location.search);
  const contentId = urlParams.get('content');
  
  async function procesarRegistroYPago() {
    const btn = document.getElementById('btn-pago');
    btn.innerHTML = '<i class="fas fa-circle-notch animate-spin"></i> PROCESANDO...';
    btn.disabled = true;
    
    // 1. Obtener datos del formulario
    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;
    
    if (!email || !password) {
      alert('Por favor completa todos los campos');
      btn.innerHTML = 'Confirmar y Pagar';
      btn.disabled = false;
      return;
    }
    
    // 2. Registrar o hacer login
    let authResult = await api.login(email, password);
    
    if (!authResult.success) {
      // Si login falla, intentar registro
      authResult = await api.register(email, password);
    }
    
    if (!authResult.success) {
      alert(authResult.message || 'Error de autenticación');
      btn.innerHTML = 'Confirmar y Pagar';
      btn.disabled = false;
      return;
    }
    
    // 3. Crear sesión de pago
    const paymentType = contentId ? 'one-time' : 'subscription';
    await api.createCheckoutSession(paymentType, contentId);
    // Esta función automáticamente redirige a Stripe
  }
  
  // Verificar si viene de un pago exitoso
  window.addEventListener('DOMContentLoaded', async () => {
    const sessionId = urlParams.get('session_id');
    
    if (sessionId) {
      const result = await api.verifyPaymentSession(sessionId);
      
      if (result.success && result.paymentStatus === 'paid') {
        // Pago exitoso, redirigir a dashboard
        window.location.href = 'dashboard.html';
      }
    }
  });
</script>
```

### 📄 detalle.html - Página de Detalle de Contenido

```html
<script>
  const api = new VaultMeAPI();
  
  async function cargarDetalle() {
    const urlParams = new URLSearchParams(window.location.search);
    const contentId = urlParams.get('id');
    
    if (!contentId) {
      window.location.href = 'index.html';
      return;
    }
    
    const result = await api.getContentById(contentId);
    
    if (result.success) {
      const content = result.data;
      
      // Actualizar título
      document.querySelector('h1').innerHTML = content.title;
      
      // Actualizar precio
      document.querySelector('.text-2xl.font-black').innerHTML = 
        `$${content.price} <span class="text-xs text-zinc-500">USD</span>`;
      
      // Actualizar descripción
      const descripcion = document.querySelector('.space-y-4');
      if (descripcion) {
        descripcion.innerHTML = `
          <div class="flex items-center gap-3 text-zinc-300">
            <i class="fas fa-check-circle text-rose-600"></i>
            <span>${content.description}</span>
          </div>
          <div class="flex items-center gap-3 text-zinc-300">
            <i class="fas fa-check-circle text-rose-600"></i>
            <span>${content.media?.length || 0} archivos incluidos</span>
          </div>
          <div class="flex items-center gap-3 text-zinc-300">
            <i class="fas fa-check-circle text-rose-600"></i>
            <span>Acceso de por vida</span>
          </div>
        `;
      }
      
      // Actualizar botón de compra
      const btnCompra = document.querySelector('a[href="registro.html"]');
      if (btnCompra) {
        btnCompra.href = `registro.html?content=${contentId}`;
      }
    }
  }
  
  window.addEventListener('DOMContentLoaded', cargarDetalle);
</script>
```

### 📄 dashboard.html - Panel de Usuario con Contenido Desbloqueado

```html
<script>
  const api = new VaultMeAPI();
  
  async function cargarDashboard() {
    // 1. Verificar autenticación
    if (!api.isAuthenticated()) {
      window.location.href = 'registro.html';
      return;
    }
    
    // 2. Obtener usuario actual
    const userResult = await api.getCurrentUser();
    
    if (!userResult.success) {
      window.location.href = 'registro.html';
      return;
    }
    
    const user = userResult.user;
    
    // 3. Actualizar badge de suscripción
    const badge = document.querySelector('.text-green-500');
    if (badge) {
      if (user.isPremium) {
        badge.innerHTML = '<i class="fas fa-crown mr-1"></i> Premium Activo';
        badge.classList.remove('text-green-500', 'bg-green-500/10', 'border-green-500/20');
        badge.classList.add('text-rose-500', 'bg-rose-500/10', 'border-rose-500/20');
      } else {
        badge.innerHTML = '<i class="fas fa-check-circle mr-1"></i> Compra Verificada';
      }
    }
    
    // 4. Cargar contenido del usuario
    const contentResult = await api.getMyContent();
    
    if (contentResult.success && contentResult.data.length > 0) {
      mostrarContenidoDesbloqueado(contentResult.data[0]);
      actualizarGaleria(contentResult.data[0]);
    }
  }
  
  function mostrarContenidoDesbloqueado(content) {
    // Actualizar título
    document.querySelector('h1').innerHTML = 
      `${content.title}: <span class="text-rose-600">Desbloqueado</span>`;
    
    // Mostrar video/imagen real
    const videoContainer = document.querySelector('.video-container');
    if (videoContainer && content.media && content.media.length > 0) {
      const firstMedia = content.media[0];
      
      if (firstMedia.type === 'video') {
        videoContainer.innerHTML = `
          <video controls poster="${content.thumbnail}" class="w-full h-full object-cover">
            <source src="${firstMedia.url}" type="video/mp4">
            Tu navegador no soporta videos.
          </video>
        `;
      } else {
        videoContainer.innerHTML = `
          <img src="${firstMedia.url}" class="w-full h-full object-cover" alt="${content.title}">
        `;
      }
    }
  }
  
  function actualizarGaleria(content) {
    const galeria = document.querySelector('.grid.grid-cols-2.md\\:grid-cols-4');
    if (!galeria || !content.media) return;
    
    galeria.innerHTML = '';
    
    content.media
      .filter(m => m.type === 'image')
      .slice(0, 8)
      .forEach(media => {
        galeria.innerHTML += `
          <div class="aspect-[3/4] rounded-2xl overflow-hidden border border-white/5 hover:border-rose-500/50 transition duration-300">
            <img src="${media.url}" 
                 class="w-full h-full object-cover hover:scale-110 transition duration-500"
                 alt="Imagen">
          </div>
        `;
      });
  }
  
  // Función de logout
  async function cerrarSesion() {
    await api.logout();
    window.location.href = 'index.html';
  }
  
  window.addEventListener('DOMContentLoaded', cargarDashboard);
</script>
```

## 🎨 Mejoras Adicionales

### Agregar Búsqueda en Tiempo Real

```javascript
// En index.html
async function buscarContenido(termino) {
  const params = new URLSearchParams({ q: termino });
  const response = await fetch(`${api.baseURL}/content/search?${params}`);
  const result = await response.json();
  
  if (result.success) {
    mostrarResultados(result.data);
  }
}

// Agregar input de búsqueda
document.querySelector('.fa-search').parentElement.innerHTML = `
  <input type="text" 
         placeholder="Buscar contenido..." 
         class="bg-zinc-900 px-4 py-2 rounded-lg text-sm"
         oninput="buscarContenido(this.value)">
`;
```

### Proteger Dashboard

```javascript
// Agregar al inicio de dashboard.html
window.addEventListener('DOMContentLoaded', () => {
  const api = new VaultMeAPI();
  
  if (!api.isAuthenticated()) {
    alert('Debes iniciar sesión para acceder');
    window.location.href = 'registro.html';
  }
});
```

### Mostrar Estado de Carga

```javascript
function mostrarCargando() {
  return `
    <div class="flex justify-center items-center py-20">
      <i class="fas fa-circle-notch animate-spin text-4xl text-rose-500"></i>
    </div>
  `;
}

// Usar antes de cargar contenido
document.getElementById('main-grid').innerHTML = mostrarCargando();
```

## ✅ Checklist de Integración

- [ ] Incluir `vault-api-client.js` en todos los HTML
- [ ] Implementar carga dinámica de contenido en `index.html`
- [ ] Conectar formulario de registro en `registro.html`
- [ ] Proteger `dashboard.html` con verificación de auth
- [ ] Cargar contenido real en `dashboard.html`
- [ ] Agregar manejo de errores en todas las funciones
- [ ] Probar flujo completo: registro → pago → acceso al contenido

## 🚀 Próximos Pasos

1. Configurar Stripe con tus credenciales reales
2. Subir archivos de media a un CDN (AWS S3, Cloudinary)
3. Implementar sistema de admin para subir contenido
4. Agregar analytics y seguimiento de conversión
5. Optimizar SEO y performance

¡Tu plataforma Vault Me está lista para funcionar! 🎉
