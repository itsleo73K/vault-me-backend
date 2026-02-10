#!/bin/bash

echo "🔒 VAULT ME - Inicio Rápido"
echo "============================"
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    echo "Por favor instala Node.js desde: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version) detectado"
echo ""

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error instalando dependencias"
    exit 1
fi

echo "✅ Dependencias instaladas"
echo ""

# Verificar si existe .env
if [ ! -f .env ]; then
    echo "⚙️  Creando archivo .env desde .env.example..."
    cp .env.example .env
    echo "⚠️  IMPORTANTE: Edita el archivo .env con tus credenciales antes de continuar"
    echo ""
    read -p "Presiona ENTER cuando hayas configurado el archivo .env..."
fi

# Verificar MongoDB
echo "🔍 Verificando MongoDB..."
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB no detectado localmente"
    echo "Opciones:"
    echo "  1. Instalar MongoDB localmente"
    echo "  2. Usar MongoDB Atlas (recomendado para principiantes)"
    echo "     → https://www.mongodb.com/cloud/atlas"
    echo ""
fi

# Preguntar si desea poblar la base de datos
read -p "¿Deseas poblar la base de datos con contenido de ejemplo? (s/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo "📊 Poblando base de datos..."
    node utils/seeder.js
    
    if [ $? -eq 0 ]; then
        echo "✅ Base de datos poblada exitosamente"
    else
        echo "❌ Error poblando base de datos"
        echo "Verifica tu conexión a MongoDB en el archivo .env"
    fi
fi

echo ""
echo "🚀 ¡Todo listo! Iniciando servidor..."
echo ""
echo "El servidor estará disponible en: http://localhost:5000"
echo "Frontend disponible en: http://localhost:5000/index.html"
echo ""
echo "Para detener el servidor: Ctrl+C"
echo ""

# Iniciar servidor en modo desarrollo
npm run dev
