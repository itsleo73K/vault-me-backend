# 🔗 Guía de Integración Frontend-Backend

## Paso 1: Agregar el script API a todos los archivos HTML

En cada archivo HTML (index.html, registro.html, detalle.html, dashboard.html), agrega antes del cierre de `</body>`:

```html
<!-- API de Vault Me -->
<script src="/js/api.js"></script>
```

## Paso 2: Actualizar registro.html

Reemplaza la función `procesarPago()` con:

```javascript
async function procesarPago() {
    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;
    const btn = document.getElementById('btn-pago');

    if (!email || !password) {
        VaultMeAPI.utils.showNotification('Completa todos los campos', 'error');
        return;
    }

    btn.innerHTML = '<i class="fas fa-circle-notch animate-spin"></i> PROCESANDO...';
    btn.disabled = true;

    try {
        // Registrar o login
        try {
            await VaultMeAPI.auth.register(email, password);
        } catch (error) {
            if (error.message.includes('registrado')) {
                await VaultMeAPI.auth.login(email, password);
            } else {
                throw error;
            }
        }

        // Obtener contentId de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const contentId = urlParams.get('id');

        if (contentId) {
            // Compra de contenido específico
            await VaultMeAPI.payments.createCheckout(contentId);
        } else {
            // Suscripción Premium
            await VaultMeAPI.payments.createSubscription();
        }

    } catch (error) {
        VaultMeAPI.utils.showNotification(error.message, 'error');
        btn.innerHTML = 'CONFIRMAR Y PAGAR';
        btn.disabled = false;
    }
}
```

## Paso 3: Actualizar index.html (Catálogo)

Agrega al final del archivo, antes de `</body>`:

```javascript
<script>
// Cargar contenido desde la API
async function loadContent() {
    try {
        const result = await VaultMeAPI.content.getAll({ limit: 20 });
        const grid = document.getElementById('main-grid');
        grid.innerHTML = ''; // Limpiar contenido existente

        result.data.forEach(item => {
            const card = `
                <div class="group relative bg-zinc-900/50 rounded-3xl overflow-hidden border border-white/5 transition-all duration-500 hover:border-rose-500/50">
                    <div class="aspect-[3/4] relative overflow-hidden">
                        <img src="${item.preview?.url || item.thumbnail?.url}" 
                             class="w-full h-full object-cover blur-lg opacity-30 transition duration-700 group-hover:scale-110">
                        <div class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                            <div class="w-12 h-12 bg-rose-600/10 rounded-full flex items-center justify-center border border-rose-500/30 mb-4 group-hover:scale-110 transition">
                                <i class="fas fa-lock text-rose-500"></i>
                            </div>
                            <h3 class="text-xs font-black uppercase tracking-tighter text-white mb-1">${item.title}</h3>
                            <p class="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">${item.stats?.views || 0} Views • ${item.type}</p>
                        </div>
                    </div>
                    <div class="p-4 bg-black/20">
                        <a href="detalle.html?id=${item._id}" 
                           class="block w-full py-3 bg-white hover:bg-rose-600 text-black hover:text-white text-center text-[10px] font-black rounded-xl transition uppercase tracking-[0.2em]">
                            Desbloquear $${item.price}
                        </a>
                    </div>
                </div>
            `;
            grid.innerHTML += card;
        });
    } catch (error) {
        console.error('Error cargando contenido:', error);
    }
}

// Cargar al iniciar la página
document.addEventListener('DOMContentLoaded', loadContent);
</script>
```

## Paso 4: Actualizar detalle.html

Agrega al final del archivo:

```javascript
<script>
// Obtener ID del contenido de la URL
const urlParams = new URLSearchParams(window.location.search);
const contentId = urlParams.get('id');

async function loadContentDetail() {
    if (!contentId) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const result = await VaultMeAPI.content.getById(contentId);
        const content = result.data;

        // Actualizar UI con datos reales
        document.querySelector('h1').textContent = content.title;
        document.querySelector('p.text-zinc-400').textContent = content.description;
        document.querySelector('.text-2xl.font-black').textContent = 
            VaultMeAPI.utils.formatPrice(content.price, content.currency);
        
        // Actualizar imagen
        const img = document.querySelector('img');
        if (content.preview?.url) {
            img.src = content.preview.url;
        }

        // Actualizar botón de compra
        const btnComprar = document.querySelector('a[href*="registro"]');
        btnComprar.href = `registro.html?id=${contentId}`;

    } catch (error) {
        console.error('Error:', error);
        VaultMeAPI.utils.showNotification('Error cargando contenido', 'error');
    }
}

document.addEventListener('DOMContentLoaded', loadContentDetail);
</script>
```

## Paso 5: Actualizar dashboard.html (Proteger)

Agrega al inicio del `<script>`:

```javascript
<script>
// Proteger la página - requiere autenticación
if (!VaultMeAPI.auth.isAuthenticated()) {
    window.location.href = 'registro.html';
}

// Cargar contenido desbloqueado del usuario
async function loadUserContent() {
    try {
        const userData = await VaultMeAPI.auth.getMe();
        console.log('Usuario actual:', userData);

        // Verificar si tiene acceso
        if (userData.data.membershipStatus !== 'active' && 
            userData.data.purchasedContent.length === 0) {
            window.location.href = 'registro.html?upgrade=true';
            return;
        }

        // Cargar contenido aquí...
        
    } catch (error) {
        console.error('Error:', error);
        window.location.href = 'registro.html';
    }
}

// Función de logout
function logout() {
    VaultMeAPI.auth.logout();
}

document.addEventListener('DOMContentLoaded', loadUserContent);
</script>
```

## Paso 6: Actualizar enlaces en los botones

En registro.html y detalle.html, actualiza los enlaces para pasar el contentId:

```html
<!-- En detalle.html -->
<a href="registro.html?id=CONTENT_ID" class="...">
    Desbloquear Ahora
</a>

<!-- En index.html (cada card) -->
<a href="detalle.html?id=CONTENT_ID" class="...">
    Ver Detalles
</a>
```

## Paso 7: Estilos CSS para notificaciones

Agrega en el `<head>` de todos los archivos HTML:

```html
<style>
@keyframes slideIn {
    from {
        transform: translateX(400px);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOut {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(400px);
        opacity: 0;
    }
}
</style>
```

## Paso 8: Configurar Stripe en el frontend

Crea un archivo `public/js/stripe-config.js`:

```javascript
const STRIPE_PUBLISHABLE_KEY = 'pk_test_tu_clave_publica';

// Inicializar Stripe (si quieres usar Stripe.js directamente)
const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
```

## Ejemplo Completo: index.html Integrado

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <!-- ... tu código existente ... -->
</head>
<body>
    <!-- ... tu HTML existente ... -->

    <!-- API de Vault Me -->
    <script src="/js/api.js"></script>
    <script>
        // Verificar si está autenticado
        const user = VaultMeAPI.auth.getCurrentUser();
        if (user) {
            console.log('Usuario logueado:', user.email);
            // Actualizar UI para usuario autenticado
        }

        // Cargar contenido
        async function loadContent() {
            try {
                const result = await VaultMeAPI.content.getAll();
                const grid = document.getElementById('main-grid');
                grid.innerHTML = '';

                result.data.forEach(item => {
                    grid.innerHTML += createContentCard(item);
                });
            } catch (error) {
                console.error('Error:', error);
            }
        }

        function createContentCard(item) {
            return `
                <div class="content-card">
                    <img src="${item.preview?.url}" class="blurred">
                    <h3>${item.title}</h3>
                    <p>$${item.price}</p>
                    <a href="detalle.html?id=${item._id}">Ver más</a>
                </div>
            `;
        }

        document.addEventListener('DOMContentLoaded', loadContent);
    </script>
</body>
</html>
```

## Debugging

Para ver los datos que retorna la API en la consola:

```javascript
// En cualquier página
console.log('Usuario:', VaultMeAPI.auth.getCurrentUser());

// Cargar contenido y verlo en consola
VaultMeAPI.content.getAll().then(data => {
    console.log('Contenido:', data);
});
```

## Próximos Pasos

1. Instalar dependencias: `npm install`
2. Configurar `.env` con tus claves reales
3. Iniciar MongoDB
4. Poblar DB: `node seeder.js -i`
5. Iniciar servidor: `npm run dev`
6. Abrir `http://localhost:5000` en el navegador

¡Listo! Tu plataforma Vault Me estará completamente funcional.
