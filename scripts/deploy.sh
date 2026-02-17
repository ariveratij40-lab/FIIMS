#!/bin/bash

# Script de despliegue para FIIMS Fase 1
# Uso: bash scripts/deploy.sh

set -e

echo "🚀 Iniciando despliegue de FIIMS Fase 1..."

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables
DOMAIN="fims.iamet.mx"
EMAIL="alvaro@baja-net.com"
DB_PASSWORD="Izl*kUx00>9"
PROJECT_DIR="/opt/fiims-fase1"

# Función para imprimir mensajes
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

# 1. Verificar si Docker está instalado
print_info "Verificando Docker..."
if ! command -v docker &> /dev/null; then
    print_error "Docker no está instalado"
    exit 1
fi
print_status "Docker está instalado"

# 2. Verificar si Docker Compose está instalado
print_info "Verificando Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose no está instalado"
    exit 1
fi
print_status "Docker Compose está instalado"

# 3. Crear directorios necesarios
print_info "Creando estructura de directorios..."
mkdir -p $PROJECT_DIR/{certbot/conf,certbot/www,nginx/conf.d,postgres_data,uploads}
print_status "Directorios creados"

# 4. Crear archivo .env si no existe
print_info "Configurando variables de entorno..."
if [ ! -f "$PROJECT_DIR/.env.production" ]; then
    cp .env.production $PROJECT_DIR/.env.production
    print_status "Archivo .env.production creado"
else
    print_info ".env.production ya existe"
fi

# 5. Crear certificado SSL inicial (si no existe)
print_info "Configurando SSL..."
if [ ! -d "$PROJECT_DIR/certbot/conf/live/$DOMAIN" ]; then
    print_info "Generando certificado SSL para $DOMAIN..."
    docker run --rm -v "$PROJECT_DIR/certbot/conf:/etc/letsencrypt" \
        -v "$PROJECT_DIR/certbot/www:/var/www/certbot" \
        certbot/certbot certonly --webroot \
        -w /var/www/certbot \
        -d $DOMAIN \
        --email $EMAIL \
        --agree-tos \
        --non-interactive \
        --force-renewal
    print_status "Certificado SSL generado"
else
    print_info "Certificado SSL ya existe"
fi

# 6. Copiar archivos de configuración
print_info "Copiando archivos de configuración..."
cp nginx/conf.d/fiims.prod.conf $PROJECT_DIR/nginx/conf.d/fiims.conf
cp nginx/nginx.conf $PROJECT_DIR/nginx/nginx.conf
cp nginx/ssl-params.conf $PROJECT_DIR/nginx/ssl-params.conf
print_status "Archivos de configuración copiados"

# 7. Construir imagen Docker
print_info "Construyendo imagen Docker..."
docker-compose -f docker-compose.prod.yml build
print_status "Imagen Docker construida"

# 8. Levantar servicios
print_info "Levantando servicios..."
docker-compose -f docker-compose.prod.yml up -d
print_status "Servicios levantados"

# 9. Esperar a que la aplicación esté lista
print_info "Esperando a que la aplicación esté lista..."
sleep 10
for i in {1..30}; do
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        print_status "Aplicación está lista"
        break
    fi
    if [ $i -eq 30 ]; then
        print_error "La aplicación no respondió después de 30 intentos"
        exit 1
    fi
    echo -n "."
    sleep 1
done

# 10. Ejecutar migraciones de base de datos
print_info "Ejecutando migraciones de base de datos..."
docker-compose -f docker-compose.prod.yml exec -T fiims-app pnpm db:push
print_status "Migraciones completadas"

# 11. Ejecutar seed data
print_info "Cargando datos iniciales..."
docker-compose -f docker-compose.prod.yml exec -T fiims-app pnpm tsx drizzle/seed.ts
print_status "Datos iniciales cargados"

# 12. Verificar servicios
print_info "Verificando servicios..."
echo ""
echo "Servicios levantados:"
docker-compose -f docker-compose.prod.yml ps
echo ""

# 13. Mostrar información de acceso
print_status "¡Despliegue completado exitosamente!"
echo ""
echo "📊 Información de acceso:"
echo "  • Aplicación: https://$DOMAIN"
echo "  • pgAdmin: http://localhost:5050"
echo "  • Email pgAdmin: $EMAIL"
echo "  • Base de Datos: postgres:5432"
echo ""
echo "📝 Próximos pasos:"
echo "  1. Accede a https://$DOMAIN en tu navegador"
echo "  2. Inicia sesión con tus credenciales"
echo "  3. Comienza a crear nodos"
echo ""
echo "🔧 Comandos útiles:"
echo "  • Ver logs: docker-compose -f docker-compose.prod.yml logs -f fiims-app"
echo "  • Detener servicios: docker-compose -f docker-compose.prod.yml down"
echo "  • Reiniciar servicios: docker-compose -f docker-compose.prod.yml restart"
echo ""
