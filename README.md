# 🔒 VAULT ME - Backend API

Backend completo para la plataforma premium Vault Me. Sistema de autenticación, pagos con Stripe, y gestión de contenido protegido.

## 🚀 Características

- ✅ Sistema de autenticación con JWT
- ✅ Registro y login de usuarios  
- ✅ Integración completa con Stripe (pagos únicos y suscripciones)
- ✅ Gestión de contenido protegido
- ✅ Base de datos MongoDB
- ✅ Webhooks de Stripe para activación automática
- ✅ Middleware de protección de rutas
- ✅ Rate limiting y seguridad

## 📋 Instalación Rápida

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar .env
cp .env.example .env
# Edita .env con tus credenciales

# 3. Poblar base de datos
node utils/seeder.js

# 4. Iniciar servidor
npm run dev
```

## 📡 Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Usuario actual (protegida)

### Contenido
- `GET /api/content` - Listar contenido (público)
- `GET /api/content/:id/full` - Contenido completo (protegida + acceso)

### Pagos
- `POST /api/payment/create-checkout-session` - Crear pago (protegida)
- `POST /api/payment/webhook` - Webhook Stripe

Ver README completo para más detalles de configuración de Stripe y deployment.
