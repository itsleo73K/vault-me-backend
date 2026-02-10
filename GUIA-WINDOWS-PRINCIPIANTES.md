# 🚀 GUÍA PARA PRINCIPIANTES - WINDOWS + VISUAL STUDIO CODE

## 👋 ¡Hola! Esta guía es para ti

Si nunca has trabajado con backend, no te preocupes. Voy a explicarte TODO paso a paso, como si fuera tu primera vez.

---

## ✅ PASO 1: Verificar que Node.js está instalado

1. Presiona las teclas `Windows + R` en tu teclado
2. Escribe `cmd` y presiona Enter
3. Se abrirá una ventana negra (la "terminal" o "consola")
4. Escribe esto y presiona Enter:

```
node --version
```

**¿Qué deberías ver?**
Algo como: `v20.11.0` o `v18.19.0` (el número puede variar)

✅ Si ves un número = ¡Perfecto! Node.js está instalado
❌ Si dice "no se reconoce" = Necesitas instalar Node.js de https://nodejs.org

---

## 📁 PASO 2: Descargar y descomprimir el proyecto

1. **Descarga** el archivo `vault-me-backend.tar.gz` que te compartí
2. Descarga **7-Zip** si no lo tienes: https://www.7-zip.org/download.html
3. **Haz clic derecho** en el archivo descargado
4. Selecciona **7-Zip → Extraer aquí**
5. Se creará una carpeta llamada `vault-me-backend`
6. **Mueve esta carpeta** a un lugar fácil de encontrar, por ejemplo:
   - `C:\Users\TuNombre\Proyectos\vault-me-backend`
   - O en tu Escritorio: `C:\Users\TuNombre\Desktop\vault-me-backend`

---

## 💻 PASO 3: Abrir el proyecto en Visual Studio Code

1. **Abre Visual Studio Code** (el icono azul)
2. En la parte superior, haz clic en **File → Open Folder** (Archivo → Abrir carpeta)
3. Navega hasta donde guardaste `vault-me-backend`
4. **Selecciona la carpeta** `vault-me-backend` y haz clic en **Seleccionar carpeta**

**¡Perfecto!** Ahora deberías ver todos los archivos del proyecto en el panel izquierdo.

---

## 🖥️ PASO 4: Abrir la Terminal en Visual Studio Code

**La terminal es donde escribirás comandos. Es más fácil de lo que parece:**

1. En Visual Studio Code, ve al menú superior
2. Haz clic en **Terminal → New Terminal** (Terminal → Nueva Terminal)
3. Se abrirá un panel en la parte inferior
4. Debería decir algo como: `PS C:\Users\TuNombre\...\vault-me-backend>`

**¡Ya tienes la terminal abierta!** Ahora escribiremos comandos aquí.

---

## 📦 PASO 5: Instalar las dependencias del proyecto

**¿Qué son las dependencias?**
Son herramientas que el proyecto necesita para funcionar (como Express, MongoDB, Stripe, etc.)

**¿Cómo las instalo?**

1. En la terminal que acabas de abrir (en la parte inferior de VS Code)
2. Escribe exactamente esto:

```
npm install
```

3. Presiona **Enter**
4. **Espera** (puede tomar 1-3 minutos)
5. Verás muchas líneas de texto pasando - ¡es normal!

**¿Cómo sé que funcionó?**
- Al final deberías ver algo como: `added 250 packages` o similar
- En el panel izquierdo aparecerá una nueva carpeta llamada `node_modules`

✅ Si ves esto = ¡Perfecto! Las dependencias están instaladas

---

## 🗄️ PASO 6: Instalar MongoDB (Base de Datos)

**Tenemos 2 opciones - te recomiendo la Opción 2 (más fácil):**

### OPCIÓN 1: MongoDB Local (en tu computadora)
❌ Más complicado para principiantes
❌ Requiere instalación adicional

### OPCIÓN 2: MongoDB Atlas (en la nube - GRATIS) ✅ RECOMENDADO

**Sigue estos pasos:**

1. Ve a: https://www.mongodb.com/cloud/atlas/register
2. Haz clic en **Sign up** (Registrarse)
3. Crea una cuenta con tu email (o usa Google)
4. Cuando pregunten qué quieres hacer, selecciona **"Learn MongoDB"**
5. Haz clic en **Create a FREE cluster**
6. Selecciona:
   - ☁️ **Cloud Provider**: AWS
   - 📍 **Region**: Cualquiera cercana (ej: N. Virginia)
   - ✅ **Cluster Tier**: M0 Sandbox (FREE)
7. Haz clic en **Create Cluster** (toma 3-5 minutos)

**Crear un usuario de base de datos:**

1. En el menú izquierdo, haz clic en **Database Access**
2. Haz clic en **Add New Database User**
3. Ingresa:
   - **Username**: `vaultme`
   - **Password**: `vault123` (o cualquier password que quieras)
   - ⚠️ **IMPORTANTE**: Anota este password
4. Haz clic en **Add User**

**Permitir acceso desde cualquier IP:**

1. En el menú izquierdo, haz clic en **Network Access**
2. Haz clic en **Add IP Address**
3. Haz clic en **Allow Access from Anywhere**
4. Haz clic en **Confirm**

**Obtener tu connection string:**

1. Vuelve a **Database** en el menú izquierdo
2. Haz clic en **Connect** (botón verde)
3. Selecciona **Connect your application**
4. Copia el texto que aparece (algo como):
   ```
   mongodb+srv://vaultme:<password>@cluster0.xxxxx.mongodb.net/
   ```
5. **Reemplaza** `<password>` con el password que creaste (ej: `vault123`)
6. **Al final agrega**: `?retryWrites=true&w=majority`

**Ejemplo de cómo debería quedar:**
```
mongodb+srv://vaultme:vault123@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

📋 **COPIA ESTO** - lo necesitarás en el siguiente paso

---

## ⚙️ PASO 7: Configurar las variables de entorno (.env)

**¿Qué es el archivo .env?**
Es donde guardas información secreta como passwords, claves de Stripe, etc.

**Pasos:**

1. En Visual Studio Code, en el panel izquierdo, busca el archivo `.env.example`
2. **Haz clic derecho** en él
3. Selecciona **Copy** (Copiar)
4. **Haz clic derecho** en un espacio vacío del panel izquierdo
5. Selecciona **Paste** (Pegar)
6. Renombra el archivo copiado a `.env` (sin el `.example`)

**Ahora edita el archivo `.env`:**

1. Haz clic en el archivo `.env` para abrirlo
2. Verás muchas líneas, vamos a cambiar solo las importantes:

**LÍNEA 1 - Modo de desarrollo:**
```env
NODE_ENV=development
```
✅ Déjalo así

**LÍNEA 2 - Puerto:**
```env
PORT=5000
```
✅ Déjalo así (o cambia a 3000 si prefieres)

**LÍNEA 4 - MongoDB URI (MUY IMPORTANTE):**
```env
MONGO_URI=mongodb://localhost:27017/vaultme
```

❌ **BORRA** esta línea completa

✅ **PEGA** tu connection string de MongoDB Atlas que copiaste en el paso anterior:
```env
MONGO_URI=mongodb+srv://vaultme:vault123@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**LÍNEA 7 - JWT Secret:**
```env
JWT_SECRET=tu_clave_super_secreta_aqui_cambiala_por_algo_aleatorio_largo
```

✅ Cámbialo por algo como:
```env
JWT_SECRET=MiClaveSecreta2024VaultMeProyecto123456789
```
(Puede ser cualquier texto largo y difícil de adivinar)

**LÍNEA 11-13 - Stripe (opcional por ahora):**
```env
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_de_stripe
STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_publica_de_stripe
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret
```

⚠️ **Por ahora déjalos así**. Configuraremos Stripe después cuando todo funcione.

**LÍNEA 16 - URL del frontend:**
```env
FRONTEND_URL=http://localhost:3000
```

✅ Cámbialo a:
```env
FRONTEND_URL=http://localhost:5000
```

**LÍNEA 19 - Precio:**
```env
PRODUCT_PRICE=1499
```
✅ Déjalo así (significa $14.99 - el precio está en centavos)

3. **Guarda el archivo**: `Ctrl + S`

---

## 🌱 PASO 8: Poblar la base de datos con contenido de ejemplo

**¿Para qué es esto?**
Para que tengas contenido de prueba y puedas ver cómo funciona todo.

1. En la terminal de VS Code (la parte inferior), escribe:

```
node utils/seeder.js
```

2. Presiona **Enter**
3. Espera unos segundos

**¿Qué deberías ver?**
```
✅ MongoDB conectado: ...
🗑️  Contenido anterior eliminado
✅ 5 items de contenido creados
📦 Base de datos poblada exitosamente!
```

✅ Si ves esto = ¡Perfecto! Tu base de datos tiene contenido de prueba

---

## 🚀 PASO 9: ¡INICIAR EL SERVIDOR!

**¡Momento de la verdad!**

1. En la terminal de VS Code, escribe:

```
npm run dev
```

2. Presiona **Enter**

**¿Qué deberías ver?**
```
    ╔═══════════════════════════════════════╗
    ║   🔒 VAULT ME - Backend Server       ║
    ║   Servidor corriendo en puerto 5000  ║
    ║   Ambiente: development              ║
    ╚═══════════════════════════════════════╝

✅ MongoDB conectado: ...
```

🎉 **¡FUNCIONA!** Tu servidor está corriendo

⚠️ **NO CIERRES** esta ventana mientras quieras usar el proyecto

---

## 🌐 PASO 10: Probar que todo funciona

**Abre tu navegador (Chrome, Firefox, Edge) y prueba esto:**

### Prueba 1: API funcionando
1. En la barra de direcciones escribe: `http://localhost:5000/api/test`
2. Deberías ver algo como:
```json
{
  "message": "🔥 Vault Me API funcionando correctamente",
  "version": "1.0.0"
}
```

### Prueba 2: Ver el contenido
1. Escribe: `http://localhost:5000/api/content`
2. Deberías ver un montón de texto (JSON) con 5 items de contenido

### Prueba 3: Ver el frontend (tu página web)
1. Escribe: `http://localhost:5000/index.html`
2. ¡Deberías ver tu página Vault Me funcionando! 🎉

---

## ❓ Problemas Comunes y Soluciones

### "npm no se reconoce como comando"
**Solución:**
1. Cierra VS Code completamente
2. Reinicia tu computadora
3. Abre VS Code de nuevo

### "Cannot find module"
**Solución:**
```
npm install
```

### "Port 5000 is already in use"
**Solución:**
1. Abre el archivo `.env`
2. Cambia `PORT=5000` a `PORT=3000`
3. Guarda con `Ctrl + S`
4. Para el servidor (Ctrl + C en la terminal)
5. Inicia de nuevo: `npm run dev`

### "MongoDB connection failed"
**Solución:**
1. Verifica que copiaste bien el connection string en `.env`
2. Verifica que reemplazaste `<password>` con tu password real
3. Verifica que agregaste `?retryWrites=true&w=majority` al final

### El servidor se detuvo solo
**Solución:**
Si ves `Waiting for changes before restart...` es normal, significa que está esperando
Para detenerlo de verdad: `Ctrl + C` en la terminal

---

## 🎯 ¿Qué sigue ahora?

Una vez que todo funciona localmente:

### CORTO PLAZO:
1. ✅ Familiarízate con el proyecto (navega por las páginas)
2. ✅ Configura Stripe para pagos reales (ver siguiente guía)
3. ✅ Personaliza los colores y textos del frontend

### MEDIANO PLAZO:
1. 🚀 Sube el proyecto a internet (Railway o Render)
2. 📸 Reemplaza las imágenes de ejemplo con tu contenido real
3. 💰 ¡Empieza a vender!

---

## 📝 Comandos que usarás frecuentemente

**Desde la terminal de VS Code:**

```bash
# Instalar dependencias (solo una vez)
npm install

# Iniciar el servidor (modo desarrollo con auto-reload)
npm run dev

# Detener el servidor
Ctrl + C

# Poblar la base de datos de nuevo
node utils/seeder.js

# Ver versión de Node.js
node --version
```

---

## 💡 Atajos útiles en Visual Studio Code

- `Ctrl + S` = Guardar archivo
- `Ctrl + P` = Buscar archivo
- `Ctrl + F` = Buscar en el archivo actual
- `Ctrl + ` (acento grave)` = Abrir/cerrar terminal
- `Ctrl + B` = Mostrar/ocultar panel izquierdo
- `Ctrl + Shift + P` = Paleta de comandos

---

## ✅ Checklist Final

Antes de configurar Stripe, verifica que todo esto funciona:

- [ ] Node.js instalado (comando `node --version` funciona)
- [ ] Proyecto descargado y descomprimido
- [ ] Abierto en Visual Studio Code
- [ ] Dependencias instaladas (`npm install` completado)
- [ ] MongoDB Atlas configurado
- [ ] Archivo `.env` creado y editado
- [ ] Base de datos poblada (`node utils/seeder.js`)
- [ ] Servidor iniciado (`npm run dev`)
- [ ] `http://localhost:5000/api/test` funciona
- [ ] `http://localhost:5000/index.html` muestra tu sitio

Si marcaste todos ✅ = ¡Estás listo para el siguiente paso!

---

## 🎓 Siguiente Guía: Configurar Stripe

Una vez que todo lo anterior funcione, lee el archivo:
**`CONFIGURAR-STRIPE-FACIL.md`**

---

**¿Algún paso no funcionó? No te preocupes, es normal.**
Busca el error exacto en Google o revisa la sección de "Problemas Comunes" arriba.

¡Tú puedes! 💪
