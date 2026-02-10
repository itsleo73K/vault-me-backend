# ⚡ INICIO RÁPIDO - VAULT ME

## 🎯 Configuración en 5 Minutos

### 1️⃣ Instalar Dependencias

```bash
cd vault-me-backend
npm install
```

### 2️⃣ Configurar MongoDB

**Opción A: MongoDB Local**
```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Linux (Ubuntu/Debian)
sudo systemctl start mongod

# Windows
# Descargar e instalar desde mongodb.com
```

**Opción B: MongoDB Atlas (Cloud - Gratis)**
1. Ve a [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Crea una cuenta gratis
3. Crea un cluster (M0 - Free tier)
4. Obtén la connection string
5. Actualiza `MONGODB_URI` en `.env`

### 3️⃣ Configurar Stripe (Modo Test)

1. Ve a [stripe.com](https://stripe.com) y crea una cuenta
2. Activa el "Test mode" (switch arriba a la derecha)
3. Ve a **Developers** > **API keys**
4. Copia las claves de prueba:
   - **Publishable key**: `pk_test_...`
   - **Secret key**: `sk_test_...`
5. Actualiza estas claves en `.env`:

```env
STRIPE_SECRET_KEY=sk_test_tu_clave_aqui
STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_aqui
```

### 4️⃣ Crear Productos en Stripe

**Para compras individuales:**
1. Ve a **Products** en Stripe Dashboard
2. Click "Add product"
3. Nombre: "Vault Me - Contenido Individual"
4. Precio: $14.99 (one-time)
5. Guarda y copia el **Price ID** (`price_...`)

**Para suscripción Premium:**
1. Crea otro producto
2. Nombre: "Vault Me Premium"
3. Precio: $29.99/mes (recurring - monthly)
4. Guarda y copia el **Price ID**

Actualiza en `.env`:
```env
STRIPE_PRICE_ID_SINGLE=price_1234567890abc
STRIPE_PRICE_ID_PREMIUM=price_0987654321xyz
```

### 5️⃣ Poblar Base de Datos

```bash
node seeder.js -i
```

Esto creará 5 sets de contenido de ejemplo.

### 6️⃣ Iniciar el Servidor

```bash
npm run dev
```

Verás:
```
═══════════════════════════════════════════════════════
🚀 VAULT ME BACKEND - SERVIDOR INICIADO
═══════════════════════════════════════════════════════
📡 Entorno: development
🌐 Puerto: 5000
🔗 URL: http://localhost:5000
📊 API: http://localhost:5000/api
═══════════════════════════════════════════════════════
```

### 7️⃣ Probar la Aplicación

Abre tu navegador en:
```
http://localhost:5000
```

## 🧪 Probar con Tarjetas de Prueba de Stripe

Stripe proporciona tarjetas de prueba:

✅ **Pago Exitoso:**
- Número: `4242 4242 4242 4242`
- Fecha: Cualquier fecha futura
- CVC: Cualquier 3 dígitos

❌ **Pago Rechazado:**
- Número: `4000 0000 0000 0002`

🔄 **Requiere Autenticación:**
- Número: `4000 0027 6000 3184`

## 📝 Verificar que Todo Funciona

### Test 1: API Health Check
```bash
curl http://localhost:5000/api/health
```

Deberías ver:
```json
{
  "success": true,
  "message": "API funcionando correctamente",
  "timestamp": "2026-02-09T..."
}
```

### Test 2: Obtener Contenido
```bash
curl http://localhost:5000/api/content
```

Deberías ver un JSON con 5 sets de contenido.

### Test 3: Registro de Usuario
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@vault.me","password":"test123"}'
```

Deberías recibir un token JWT.

## 🔧 Webhooks de Stripe (Desarrollo Local)

Para que los webhooks funcionen en desarrollo:

```bash
# 1. Instalar Stripe CLI
brew install stripe/stripe-cli/stripe

# 2. Login
stripe login

# 3. Escuchar webhooks
stripe listen --forward-to localhost:5000/api/payments/webhook
```

El CLI te dará un `webhook signing secret` temporal:
```
> Ready! Your webhook signing secret is whsec_xxxxx
```

Copia este secret y actualízalo en `.env`:
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

## 🎨 Integrar el Frontend

Los archivos HTML ya están en `/public/`. Para conectarlos con el backend:

1. Agrega el script API en cada HTML:
```html
<script src="/js/api.js"></script>
```

2. Sigue la guía completa en `INTEGRATION_GUIDE.md`

## 📱 Flujo de Usuario Completo

1. **Usuario visita** `http://localhost:5000`
2. **Ve el catálogo** de contenido (sin autenticación)
3. **Click en "Desbloquear"** → Lo lleva a `detalle.html?id=xxx`
4. **Click en "Desbloquear Ahora"** → Lo lleva a `registro.html?id=xxx`
5. **Completa el formulario** y click en "Confirmar y Pagar"
6. **Es redirigido a Stripe Checkout** (página oficial de pago)
7. **Completa el pago** con tarjeta de prueba
8. **Stripe lo redirige** a `dashboard.html`
9. **Ve el contenido desbloqueado** ✅

## 🚨 Solución de Problemas Comunes

### Error: "MongoDB connection failed"
```bash
# Verificar que MongoDB está corriendo
mongosh

# Si no funciona, iniciarlo:
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

### Error: "Port 5000 already in use"
```bash
# Cambiar el puerto en .env
PORT=3001

# O matar el proceso que usa el puerto 5000
lsof -ti:5000 | xargs kill -9  # macOS/Linux
```

### Stripe Checkout no abre
- Verifica que las claves de Stripe están correctas
- Asegúrate de estar en "Test mode"
- Revisa la consola del navegador (F12) para errores

## 🎁 Credenciales de Prueba

**Usuario de prueba creado automáticamente:**
```
Email: test@vaultme.com
Password: test123456
```

(Solo si ejecutaste el seeder)

## 📚 Próximos Pasos

Una vez que todo funciona:

1. ✅ Personaliza el contenido en la base de datos
2. ✅ Sube imágenes/videos reales
3. ✅ Configura Cloudinary para almacenamiento de media
4. ✅ Personaliza los precios y productos
5. ✅ Despliega en producción (Heroku, Railway, Render, etc.)

## 🆘 ¿Necesitas Ayuda?

Si algo no funciona:

1. Revisa los logs del servidor (en la terminal)
2. Revisa la consola del navegador (F12)
3. Verifica que todas las variables en `.env` están correctas
4. Asegúrate de que MongoDB está corriendo
5. Confirma que las claves de Stripe son de Test mode

---

**¡Listo para empezar! 🚀**

Ejecuta `npm run dev` y abre `http://localhost:5000`
