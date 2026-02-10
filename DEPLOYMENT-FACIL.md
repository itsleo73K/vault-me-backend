# 🌐 SUBIR TU PROYECTO A INTERNET - GUÍA FÁCIL

## 🎯 ¿Por qué necesito esto?

Ahora mismo tu proyecto funciona en `localhost:5000` - solo TÚ puedes verlo en tu computadora.

Para que otras personas puedan acceder y PAGAR, necesitas subirlo a internet.

---

## 🏆 Mejor Opción: RAILWAY (Recomendado)

**¿Por qué Railway?**
- ✅ Más fácil para principiantes
- ✅ 500 horas gratis al mes (suficiente para empezar)
- ✅ Incluye base de datos MongoDB gratis
- ✅ SSL/HTTPS automático
- ✅ No necesitas tarjeta de crédito para empezar

**Costo después de fase gratis:** $5/mes (solo cuando tengas tráfico)

---

## 📝 PASO 1: Crear cuenta en Railway

1. Ve a: https://railway.app
2. Haz clic en **"Login"** arriba a la derecha
3. Selecciona **"Login with GitHub"**
4. Si no tienes cuenta de GitHub:
   - Ve a https://github.com
   - Haz clic en **Sign up**
   - Crea tu cuenta (es gratis)
   - Vuelve a Railway y login con GitHub

---

## 📁 PASO 2: Subir tu código a GitHub

**¿Qué es GitHub?**
Es como Google Drive, pero para código. Railway necesita que tu código esté ahí.

### Opción A: Usar GitHub Desktop (MÁS FÁCIL)

1. **Descargar GitHub Desktop:**
   - Ve a: https://desktop.github.com/
   - Descarga e instala

2. **Abrir GitHub Desktop:**
   - Inicia sesión con tu cuenta de GitHub
   - Haz clic en **File → Add Local Repository**
   - Navega a tu carpeta `vault-me-backend`
   - Haz clic en **Add Repository**

3. **Crear repositorio:**
   - Si te dice "This directory does not appear to be a Git repository"
   - Haz clic en **Create a repository**
   - Nombre: `vault-me-backend`
   - Haz clic en **Create Repository**

4. **Hacer el primer commit:**
   - En la parte inferior izquierda verás "Summary"
   - Escribe: `Primer commit - proyecto Vault Me`
   - Haz clic en **Commit to main**

5. **Subir a GitHub:**
   - Haz clic en **Publish repository** (arriba)
   - **IMPORTANTE**: Desmarca "Keep this code private" si quieres que sea público
   - O déjalo marcado si quieres que sea privado (recomendado)
   - Haz clic en **Publish Repository**

¡Listo! Tu código está en GitHub.

### Opción B: Usar Git desde terminal (más técnico)

```bash
# En la terminal de VS Code:

# 1. Inicializar Git
git init

# 2. Agregar todos los archivos
git add .

# 3. Hacer commit
git commit -m "Primer commit"

# 4. Crear repositorio en GitHub (hacerlo desde la web)
# Luego conectar:
git remote add origin https://github.com/TU_USUARIO/vault-me-backend.git
git push -u origin main
```

---

## 🚀 PASO 3: Crear proyecto en Railway

1. **En Railway**, haz clic en **"New Project"**

2. Selecciona **"Deploy from GitHub repo"**

3. **Conectar GitHub:**
   - Si es tu primera vez, te pedirá autorización
   - Haz clic en **"Configure GitHub App"**
   - Selecciona tu cuenta
   - Selecciona el repositorio `vault-me-backend`
   - Haz clic en **"Install & Authorize"**

4. **Seleccionar repositorio:**
   - Verás una lista de tus repositorios
   - Haz clic en `vault-me-backend`

5. **Railway detectará automáticamente** que es un proyecto Node.js
   - Haz clic en **"Deploy Now"**

⏱️ **Espera 2-5 minutos** mientras Railway hace el deploy

---

## 🗄️ PASO 4: Agregar base de datos MongoDB

1. **En tu proyecto de Railway**, haz clic en **"+ New"**

2. Selecciona **"Database"**

3. Selecciona **"Add MongoDB"**

4. Railway creará automáticamente una base de datos MongoDB

5. **Copiar la connection string:**
   - Haz clic en el servicio "MongoDB"
   - Ve a la pestaña **"Variables"**
   - Busca **"MONGO_URL"** o **"MONGO_URI"**
   - Haz clic en el ícono de copiar 📋

---

## ⚙️ PASO 5: Configurar variables de entorno

**Estas son las mismas que tienes en tu archivo .env local**

1. **En Railway**, haz clic en tu servicio principal (vault-me-backend)

2. Ve a la pestaña **"Variables"**

3. Haz clic en **"+ New Variable"**

4. **Agrega TODAS estas variables una por una:**

```
NODE_ENV=production
```

```
MONGO_URI=mongodb+srv://...
```
(Pega el MONGO_URI que copiaste en el paso anterior)

```
JWT_SECRET=MiClaveSecreta2024VaultMeProyecto123456789
```
(El mismo que tienes en tu .env local)

```
STRIPE_SECRET_KEY=sk_test_...
```
(Tu clave de Stripe - cópiala de tu .env local)

```
STRIPE_PUBLISHABLE_KEY=pk_test_...
```
(Tu clave pública de Stripe)

```
STRIPE_WEBHOOK_SECRET=whsec_...
```
(Por ahora déjala vacía, la configuraremos después)

```
FRONTEND_URL=https://tu-proyecto.up.railway.app
```
⚠️ **IMPORTANTE**: Cambiaremos esto en el siguiente paso

```
PRODUCT_PRICE=1499
```

5. Después de agregar cada variable, Railway **automáticamente hará re-deploy**

---

## 🌐 PASO 6: Obtener tu URL pública

1. En Railway, haz clic en tu servicio principal

2. Ve a la pestaña **"Settings"**

3. En la sección **"Networking"**:
   - Verás **"Public Networking"**
   - Haz clic en **"Generate Domain"**

4. Railway te dará una URL como:
   ```
   https://vault-me-production.up.railway.app
   ```

5. **¡COPIA ESTA URL!** Esta es la dirección de tu proyecto en internet

6. **Actualizar FRONTEND_URL:**
   - Ve a **Variables** de nuevo
   - Busca `FRONTEND_URL`
   - Edítala y pega tu URL de Railway
   - Guarda

---

## 🌱 PASO 7: Poblar la base de datos en Railway

**Tu base de datos en Railway está vacía. Necesitamos agregar contenido.**

### Opción A: Desde Railway CLI (Más fácil)

1. **Instalar Railway CLI:**
   - Abre PowerShell como administrador
   - Ejecuta:
   ```
   npm install -g @railway/cli
   ```

2. **Login:**
   ```
   railway login
   ```

3. **Conectar a tu proyecto:**
   ```
   railway link
   ```
   Selecciona tu proyecto

4. **Ejecutar el seeder:**
   ```
   railway run node utils/seeder.js
   ```

### Opción B: Desde el dashboard de MongoDB (Manual)

1. Si usas MongoDB Atlas, puedes importar datos manualmente
2. O simplemente crear contenido desde tu aplicación después

---

## 🔔 PASO 8: Configurar webhook de Stripe para producción

**Ahora que tu proyecto está en internet, actualiza el webhook:**

1. **Ve a Stripe Dashboard**

2. **Developers → Webhooks**

3. **Edita tu webhook existente** o crea uno nuevo

4. **Endpoint URL:**
   ```
   https://tu-proyecto.up.railway.app/api/payment/webhook
   ```
   (Usa tu URL de Railway)

5. **Copiar el Signing Secret:**
   - Haz clic en **"Reveal"** en el signing secret
   - Copia el código (empieza con `whsec_`)

6. **Actualizar en Railway:**
   - Ve a tu proyecto en Railway
   - Variables → Edita `STRIPE_WEBHOOK_SECRET`
   - Pega el nuevo secret
   - Guarda

---

## ✅ PASO 9: Probar tu sitio en internet

1. **Abre tu navegador**

2. **Ve a tu URL:**
   ```
   https://tu-proyecto.up.railway.app/index.html
   ```

3. **Deberías ver tu sitio Vault Me funcionando!** 🎉

4. **Probar el flujo completo:**
   - Navega por el catálogo
   - Haz clic en "Desbloquear"
   - Registra un usuario
   - Haz una compra de prueba (con tarjeta 4242...)
   - Verifica que te redirija al dashboard

**Si todo funciona** = ¡Tu proyecto está LIVE en internet! 🚀

---

## 🎨 PASO 10: Personalizar tu dominio (OPCIONAL)

**Por ahora tienes:** `tu-proyecto.up.railway.app`
**Puedes tener:** `www.vaultme.com` (o el que quieras)

1. **Comprar un dominio:**
   - Namecheap: https://www.namecheap.com (~$10/año)
   - GoDaddy: https://www.godaddy.com
   - Google Domains: https://domains.google

2. **En Railway:**
   - Settings → Custom Domain
   - Ingresa tu dominio
   - Railway te dará instrucciones DNS

3. **En tu proveedor de dominio:**
   - Agregar registro CNAME o A
   - Apuntar a Railway

⏱️ **Toma 24-48 horas** en propagarse

---

## 💰 Costos Estimados

### Plan GRATUITO (para empezar):
- Railway: 500 horas/mes gratis ($0)
- MongoDB: Incluido ($0)
- Stripe: Sin costo fijo ($0)
- **Total: GRATIS**

### Cuando crezcas:
- Railway: $5/mes por servicio
- MongoDB Atlas: Gratis hasta 512MB
- Dominio: ~$10-15/año
- **Total: ~$5-7/mes**

**Stripe:** Solo cobra comisión por venta (2.9% + $0.30)

---

## 🔄 Actualizar tu proyecto después de cambios

**Cuando hagas cambios en tu código local:**

### Con GitHub Desktop:
1. Abre GitHub Desktop
2. Verás tus cambios en la lista
3. Escribe un mensaje de commit (ej: "Actualicé colores")
4. Haz clic en **Commit to main**
5. Haz clic en **Push origin**

Railway detectará el cambio y **automáticamente hará re-deploy** (2-3 minutos)

### Con Git en terminal:
```bash
git add .
git commit -m "Descripción del cambio"
git push
```

---

## 📊 Monitorear tu aplicación

**En Railway puedes ver:**

1. **Logs:** Ver errores en tiempo real
   - Ve a tu servicio → Deployments → Click en el deployment activo
   - Verás todos los logs

2. **Métricas:** CPU, RAM, requests
   - Pestaña "Metrics"

3. **Variables:** Cambiar configuración
   - Pestaña "Variables"

---

## ❓ Problemas Comunes

### "Application failed to start"
**Solución:**
1. Ve a Logs en Railway
2. Lee el error
3. Generalmente es:
   - Falta una variable de entorno
   - Error en el código
   - Puerto incorrecto

### "Cannot connect to MongoDB"
**Solución:**
- Verifica que `MONGO_URI` en Railway sea correcta
- Verifica que sea la misma que te dio Railway (no la de tu .env local)

### "Webhook verification failed"
**Solución:**
- Verifica que la URL del webhook en Stripe sea correcta
- Verifica que `STRIPE_WEBHOOK_SECRET` esté actualizado

### "502 Bad Gateway"
**Solución:**
- El servidor está reiniciando
- Espera 1-2 minutos
- Refresca la página

---

## ✅ Checklist de Deployment

- [ ] Cuenta de Railway creada
- [ ] Código subido a GitHub
- [ ] Proyecto creado en Railway
- [ ] MongoDB agregada en Railway
- [ ] Todas las variables de entorno configuradas
- [ ] Dominio público generado
- [ ] Base de datos poblada con contenido
- [ ] Webhook de Stripe actualizado
- [ ] Sitio accesible desde internet
- [ ] Flujo de pago funcionando

Si todos tienen ✅ = ¡Estás en producción! 🎉

---

## 🎯 Siguiente Paso

Ahora que estás en internet:

1. **Promociona tu sitio** en redes sociales
2. **Sube contenido real** (reemplaza las imágenes de ejemplo)
3. **Cambia a modo LIVE de Stripe** cuando estés listo para recibir pagos reales
4. **Monitorea tus ventas** en el dashboard de Stripe

---

## 📞 Recursos de Ayuda

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Stripe Support: https://support.stripe.com

---

**¡Felicidades! Tu plataforma Vault Me está VIVA en internet y lista para generar ingresos! 💰🚀**
