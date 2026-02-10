# 💳 CONFIGURAR STRIPE - GUÍA SÚPER FÁCIL

## 🎯 ¿Qué es Stripe?

Stripe es el servicio que te permite **cobrar con tarjeta de crédito/débito** en tu plataforma. Es lo que usarán tus clientes para pagar.

**¿Es gratis?** Sí, crear la cuenta es gratis. Stripe cobra una comisión pequeña solo cuando recibes pagos (2.9% + $0.30 por transacción).

---

## ⚠️ IMPORTANTE: Antes de empezar

**Asegúrate de que tu proyecto funciona localmente primero**

Deberías haber completado la guía anterior y poder ver:
- ✅ `http://localhost:5000/index.html` funcionando
- ✅ El servidor corriendo sin errores

Si no es así, regresa a `GUIA-WINDOWS-PRINCIPIANTES.md` primero.

---

## 📝 PASO 1: Crear cuenta en Stripe

1. **Abre tu navegador** y ve a: https://stripe.com
2. Haz clic en **Sign up** (Registrarse) - arriba a la derecha
3. **Crea tu cuenta** con:
   - Tu email
   - Tu nombre completo
   - Un password seguro
4. Haz clic en **Create account**

**Stripe te pedirá información:**
- Nombre del negocio → Escribe: `Vault Me` (o el nombre que quieras)
- País → Selecciona tu país
- Tipo de negocio → Selecciona "Individual" o "Company"

5. **Por ahora**, no necesitas completar todo el perfil
6. Haz clic en **Skip for now** o **Continuar luego**

---

## 🔑 PASO 2: Obtener tus claves de prueba (TEST)

**¿Qué son las claves de prueba?**
Son claves que te permiten probar pagos SIN usar dinero real. Perfecto para desarrollo.

**Cómo obtenerlas:**

1. Una vez dentro de tu cuenta Stripe, verás el **Dashboard**
2. En la esquina superior derecha, verás un **switch** que dice:
   - 🔴 **Live** (Modo real - con dinero de verdad)
   - 🟢 **Test** (Modo prueba - dinero falso)

3. **Asegúrate de que esté en modo TEST** (debe decir "Test mode" o "Modo de prueba")

4. En el menú izquierdo, haz clic en **Developers** (Desarrolladores)

5. Haz clic en **API keys** (Claves API)

6. Verás dos claves importantes:

   **Publishable key** (Clave pública)
   - Empieza con `pk_test_`
   - Haz clic en **Reveal test key** (Revelar clave)
   - Copia todo el texto (algo como `pk_test_51Abc123...`)
   
   **Secret key** (Clave secreta)
   - Empieza con `sk_test_`
   - Haz clic en **Reveal test key**
   - Copia todo el texto (algo como `sk_test_51Abc123...`)

7. **GUARDA ESTAS CLAVES** en un archivo de texto temporal

⚠️ **IMPORTANTE**: Nunca compartas la Secret key con nadie. Es como un password.

---

## 📄 PASO 3: Poner las claves en tu proyecto

1. **Abre Visual Studio Code** con tu proyecto
2. En el panel izquierdo, busca el archivo **`.env`**
3. Haz clic para abrirlo
4. Busca estas líneas:

```env
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_de_stripe
STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_publica_de_stripe
```

5. **Reemplaza** el texto después del `=` con tus claves reales:

```env
STRIPE_SECRET_KEY=sk_test_51Abc123def456...
STRIPE_PUBLISHABLE_KEY=pk_test_51Xyz789ghi012...
```

6. **Guarda el archivo**: `Ctrl + S`

---

## 🔔 PASO 4: Configurar Webhooks (para que los pagos activen el acceso)

**¿Qué es un webhook?**
Es una forma en que Stripe le "avisa" a tu servidor cuando alguien paga. Así tu sistema puede desbloquear el contenido automáticamente.

### Opción A: Para desarrollo local (tu computadora)

**Necesitas ngrok** (es un programa que hace que tu computadora sea accesible desde internet temporalmente)

1. **Descargar ngrok:**
   - Ve a: https://ngrok.com/download
   - Descarga la versión para Windows
   - Descomprime el archivo ZIP
   - Verás un archivo `ngrok.exe`

2. **Ejecutar ngrok:**
   - Haz doble clic en `ngrok.exe`
   - Se abrirá una ventana negra
   - Escribe este comando:
   ```
   ngrok http 5000
   ```
   - Presiona Enter

3. **Copiar la URL:**
   - Verás algo como:
   ```
   Forwarding: https://abc123.ngrok.io -> http://localhost:5000
   ```
   - **Copia** la URL que empieza con `https://` (ej: `https://abc123.ngrok.io`)

4. **Crear webhook en Stripe:**
   - Vuelve a tu Dashboard de Stripe
   - Ve a **Developers → Webhooks**
   - Haz clic en **Add endpoint** (Agregar endpoint)
   - En **Endpoint URL**, pega:
   ```
   https://abc123.ngrok.io/api/payment/webhook
   ```
   ⚠️ Asegúrate de agregar `/api/payment/webhook` al final
   
5. **Seleccionar eventos:**
   - En "Select events to listen to"
   - Busca y selecciona:
     - ✅ `checkout.session.completed`
     - ✅ `customer.subscription.created`
     - ✅ `customer.subscription.updated`
     - ✅ `customer.subscription.deleted`
     - ✅ `invoice.payment_succeeded`
     - ✅ `invoice.payment_failed`
   
6. Haz clic en **Add endpoint**

7. **Copiar Webhook Secret:**
   - Verás tu nuevo webhook en la lista
   - Haz clic en él
   - En la sección **Signing secret**, haz clic en **Reveal**
   - Copia el texto (empieza con `whsec_`)

8. **Agregar a .env:**
   - Abre tu archivo `.env` en VS Code
   - Busca:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret
   ```
   - Reemplaza con tu secret real:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_abc123def456...
   ```
   - Guarda: `Ctrl + S`

### Opción B: Si ya tienes el proyecto en internet (Railway, Render, etc.)

1. En vez de usar ngrok, usa tu URL de producción:
   ```
   https://tu-proyecto.railway.app/api/payment/webhook
   ```

2. Sigue los pasos 4-8 de la Opción A

---

## 🔄 PASO 5: Reiniciar el servidor

**Para que los cambios surtan efecto:**

1. En Visual Studio Code, ve a la **terminal** (parte inferior)
2. **Detén el servidor** si está corriendo: presiona `Ctrl + C`
3. **Inicia de nuevo**:
   ```
   npm run dev
   ```

Deberías ver:
```
🔒 VAULT ME - Backend Server
Servidor corriendo en puerto 5000
✅ MongoDB conectado
```

---

## ✅ PASO 6: Probar el flujo de pago completo

**¡Momento de la verdad! Vamos a hacer una compra de prueba:**

1. **Abre tu navegador** en: `http://localhost:5000/index.html`

2. **Navega:**
   - Haz clic en cualquier contenido
   - Haz clic en **"Desbloquear $14.99"**

3. **Registrarte:**
   - Ingresa un email de prueba (ej: `prueba@test.com`)
   - Ingresa una contraseña (ej: `password123`)

4. **Hacer clic en "Confirmar y Pagar"**

5. **Serás redirigido a Stripe Checkout** (la página de pago de Stripe)

6. **Usar tarjeta de prueba:**
   - **Número de tarjeta**: `4242 4242 4242 4242`
   - **Fecha**: Cualquier fecha futura (ej: `12/25`)
   - **CVC**: Cualquier 3 números (ej: `123`)
   - **Nombre**: Tu nombre
   - **Email**: El mismo que usaste en registro

7. **Haz clic en "Pay"** (Pagar)

8. **Deberías ser redirigido a tu dashboard** con el contenido desbloqueado

🎉 **¡FUNCIONA!** Si ves el contenido desbloqueado, significa que todo está configurado correctamente.

---

## 🧪 Tarjetas de Prueba de Stripe

**Para diferentes escenarios de prueba:**

| Escenario | Número de Tarjeta |
|-----------|------------------|
| ✅ Pago exitoso | `4242 4242 4242 4242` |
| ❌ Pago rechazado | `4000 0000 0000 0002` |
| 🔐 Requiere autenticación 3D | `4000 0027 6000 3184` |
| 💳 Visa | `4242 4242 4242 4242` |
| 💳 Mastercard | `5555 5555 5555 4444` |
| 💳 American Express | `3782 822463 10005` |

Más tarjetas en: https://stripe.com/docs/testing

---

## 🔍 PASO 7: Verificar en el Dashboard de Stripe

1. **Ve a tu Dashboard de Stripe**
2. Haz clic en **Payments** (Pagos)
3. Deberías ver tu pago de prueba listado
4. Haz clic en él para ver los detalles

**También puedes ver:**
- **Customers** → Verás el cliente creado
- **Subscriptions** → Si hiciste una suscripción

---

## 🚀 Cuando estés listo para PRODUCCIÓN (dinero real)

**NO hagas esto hasta que estés 100% seguro de que todo funciona en modo TEST**

1. En Stripe, completa la **verificación de cuenta**:
   - Información del negocio
   - Información bancaria (donde recibirás el dinero)
   - Documento de identidad

2. **Cambia al modo LIVE:**
   - En el Dashboard de Stripe, cambia el switch de TEST a LIVE
   - Obten tus nuevas claves (empiezan con `pk_live_` y `sk_live_`)

3. **Actualiza tu .env con las claves LIVE**

4. **IMPORTANTE**: Cambia también:
   ```env
   NODE_ENV=production
   ```

⚠️ **NUNCA** uses claves LIVE en desarrollo. Solo en producción.

---

## ❓ Problemas Comunes

### "Payment failed" al hacer la prueba
**Solución:**
- Verifica que estés usando la tarjeta `4242 4242 4242 4242`
- Verifica que estés en modo TEST en Stripe
- Verifica que las claves en `.env` sean de TEST (empiecen con `_test_`)

### El webhook no funciona
**Solución:**
- Verifica que ngrok esté corriendo
- Verifica que la URL del webhook en Stripe termine en `/api/payment/webhook`
- Verifica que `STRIPE_WEBHOOK_SECRET` en `.env` sea correcto

### "This card was declined"
**Solución:**
- Estás usando una tarjeta de prueba que simula rechazo
- Usa `4242 4242 4242 4242` en su lugar

### Después de pagar, no me redirige al dashboard
**Solución:**
- Verifica que `FRONTEND_URL` en `.env` sea `http://localhost:5000`
- Verifica que el servidor esté corriendo
- Revisa la consola del navegador (F12) para ver errores

---

## 📊 Comisiones de Stripe

**Modo TEST**: Gratis, no hay cargos

**Modo LIVE (producción):**
- 2.9% + $0.30 USD por transacción exitosa
- Sin cuotas mensuales
- Sin costos ocultos

**Ejemplo:**
- Vendes a $14.99
- Stripe cobra: ($14.99 × 0.029) + $0.30 = $0.74
- Tú recibes: $14.99 - $0.74 = **$14.25**

---

## ✅ Checklist de Stripe

- [ ] Cuenta de Stripe creada
- [ ] Modo TEST activado
- [ ] Secret key copiada y en `.env`
- [ ] Publishable key copiada y en `.env`
- [ ] Webhook endpoint creado (con ngrok o URL de producción)
- [ ] Webhook secret copiado y en `.env`
- [ ] Eventos del webhook seleccionados
- [ ] Servidor reiniciado después de cambios
- [ ] Pago de prueba completado exitosamente
- [ ] Contenido desbloqueado después del pago

Si todos tienen ✅ = ¡Stripe está configurado! 🎉

---

## 🎯 Siguiente Paso

Una vez que Stripe funciona localmente, el siguiente paso es:
**Subir tu proyecto a internet** (deployment)

Lee el archivo: `DEPLOYMENT-FACIL.md`

---

**¿Tienes dudas?** Revisa la documentación oficial de Stripe:
https://stripe.com/docs

¡Éxito con tu plataforma! 💰
