# 🚀 Guía Rápida de Deployment

## Opción 1: Railway (RECOMENDADO - Más Fácil)

Railway ofrece hosting gratuito para proyectos Node.js con MongoDB incluido.

### Pasos:

1. **Crear cuenta en Railway**
   - Ve a https://railway.app
   - Regístrate con GitHub

2. **Nuevo Proyecto**
   - Click en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Conecta tu repositorio de Vault Me

3. **Agregar MongoDB**
   - En tu proyecto, click "+ New"
   - Selecciona "Database" → "MongoDB"
   - Railway generará automáticamente MONGO_URI

4. **Configurar Variables de Entorno**
   - Click en tu servicio → "Variables"
   - Agregar:
     ```
     NODE_ENV=production
     JWT_SECRET=tu_secret_super_seguro_aqui
     STRIPE_SECRET_KEY=sk_live_tu_clave
     STRIPE_PUBLISHABLE_KEY=pk_live_tu_clave
     STRIPE_WEBHOOK_SECRET=whsec_tu_webhook
     FRONTEND_URL=https://tu-dominio.railway.app
     PRODUCT_PRICE=1499
     ```

5. **Deploy**
   - Railway automáticamente hace deploy
   - Obtendrás una URL como: `https://vault-me-production.up.railway.app`

6. **Configurar Webhook de Stripe**
   - Ir a Stripe Dashboard → Webhooks
   - Agregar endpoint: `https://tu-url.railway.app/api/payment/webhook`
   - Copiar webhook secret a Railway

---

## Opción 2: Render

Render también ofrece tier gratuito y es muy fácil.

### Pasos:

1. **Crear cuenta**: https://render.com

2. **New Web Service**
   - Conectar GitHub
   - Seleccionar repositorio

3. **Configuración**
   ```
   Build Command: npm install
   Start Command: npm start
   ```

4. **Variables de Entorno**
   - Agregar todas las variables del .env

5. **MongoDB Atlas**
   - Crear cluster gratuito en https://mongodb.com/cloud/atlas
   - Copiar connection string

---

## Opción 3: Heroku

### Pasos:

```bash
# 1. Instalar Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# 2. Login
heroku login

# 3. Crear app
heroku create vault-me-api

# 4. Agregar MongoDB
heroku addons:create mongolab:sandbox

# 5. Configurar variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=tu_secret
heroku config:set STRIPE_SECRET_KEY=sk_live_xxx
heroku config:set STRIPE_PUBLISHABLE_KEY=pk_live_xxx
heroku config:set STRIPE_WEBHOOK_SECRET=whsec_xxx
heroku config:set FRONTEND_URL=https://vault-me-api.herokuapp.com

# 6. Deploy
git push heroku main

# 7. Poblar DB
heroku run node utils/seeder.js
```

---

## Opción 4: VPS (DigitalOcean, AWS, etc.)

Para mayor control, puedes usar un VPS.

### Setup en Ubuntu:

```bash
# 1. Conectar por SSH
ssh root@tu-ip

# 2. Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Instalar MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod

# 4. Instalar PM2
npm install -g pm2

# 5. Clonar proyecto
git clone https://github.com/tu-usuario/vault-me-backend.git
cd vault-me-backend

# 6. Instalar dependencias
npm install

# 7. Configurar .env
nano .env
# (Pegar tus variables)

# 8. Poblar DB
node utils/seeder.js

# 9. Iniciar con PM2
pm2 start server.js --name vault-me
pm2 save
pm2 startup

# 10. Nginx (opcional - para dominio)
sudo apt install nginx
# Configurar reverse proxy
```

---

## 🔒 Configuración SSL/HTTPS

### Con Railway/Render/Heroku:
✅ SSL automático incluido

### Con VPS + Certbot:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

---

## 📊 MongoDB Cloud (Recomendado)

Para cualquier opción de deployment, usa MongoDB Atlas:

1. Crear cuenta: https://www.mongodb.com/cloud/atlas
2. Crear cluster gratuito (512MB)
3. Crear usuario de base de datos
4. Whitelist IP: `0.0.0.0/0` (permitir todas)
5. Copiar connection string
6. Actualizar `MONGO_URI` en variables de entorno

---

## ✅ Checklist Post-Deployment

- [ ] API responde en `/api/test`
- [ ] MongoDB conectado correctamente
- [ ] Variables de entorno configuradas
- [ ] Stripe webhook funcionando
- [ ] Base de datos poblada con contenido
- [ ] Frontend accesible
- [ ] SSL/HTTPS activo
- [ ] Prueba de registro de usuario
- [ ] Prueba de flujo de pago completo

---

## 🐛 Troubleshooting

**Error: Application failed to start**
- Verificar logs: `heroku logs --tail` o en dashboard de Railway/Render
- Revisar que todas las variables de entorno estén configuradas

**Error: MongoDB connection timeout**
- Verificar whitelist de IPs en MongoDB Atlas
- Revisar formato de MONGO_URI

**Webhook no funciona**
- Verificar que la URL del webhook en Stripe sea correcta
- Verificar STRIPE_WEBHOOK_SECRET
- Revisar logs del servidor

---

## 💰 Costos Estimados

| Servicio | Tier Gratuito | Tier Pago |
|----------|---------------|-----------|
| Railway | 500h/mes | $5/mes por servicio |
| Render | 750h/mes | $7/mes |
| Heroku | Eliminado | $7/mes dyno |
| MongoDB Atlas | 512MB | $9/mes (2GB) |
| **Total** | **GRATIS** | **$12-16/mes** |

**Recomendación**: Empieza con Railway + MongoDB Atlas gratis. Upgrade cuando tengas ingresos.
