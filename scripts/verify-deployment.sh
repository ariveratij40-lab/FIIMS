#!/bin/bash

# Script de verificación de despliegue para FIIMS Fase 1
# Uso: bash scripts/verify-deployment.sh

set -e

echo "🔍 Verificando despliegue de FIIMS Fase 1..."
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASSED=0
FAILED=0

check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1"
        ((FAILED++))
    fi
}

print_section() {
    echo ""
    echo -e "${YELLOW}═══ $1 ═══${NC}"
}

# Verificación 1: Docker
print_section "Verificación de Docker"
docker --version > /dev/null 2>&1
check_status "Docker instalado"

docker ps > /dev/null 2>&1
check_status "Docker daemon corriendo"

# Verificación 2: Servicios
print_section "Verificación de Servicios"

# Verificar si los contenedores existen
docker-compose -f docker-compose.prod.yml ps | grep -q "fiims-app"
check_status "Contenedor fiims-app existe"

docker-compose -f docker-compose.prod.yml ps | grep -q "postgres"
check_status "Contenedor postgres existe"

docker-compose -f docker-compose.prod.yml ps | grep -q "nginx"
check_status "Contenedor nginx existe"

# Verificación 3: Conectividad
print_section "Verificación de Conectividad"

# Verificar aplicación
curl -f http://localhost:3000/health > /dev/null 2>&1
check_status "Aplicación responde en puerto 3000"

# Verificar Nginx
curl -f http://localhost:80 > /dev/null 2>&1
check_status "Nginx responde en puerto 80"

# Verificar HTTPS
curl -k -f https://fims.iamet.mx > /dev/null 2>&1
check_status "HTTPS responde en fims.iamet.mx"

# Verificación 4: Base de Datos
print_section "Verificación de Base de Datos"

# Verificar conexión a PostgreSQL
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U fiims_user -d fiims_db -c "SELECT 1;" > /dev/null 2>&1
check_status "PostgreSQL accesible"

# Verificar tablas
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U fiims_user -d fiims_db -c "\dt fiims.*" > /dev/null 2>&1
check_status "Tablas de base de datos existen"

# Verificación 5: SSL
print_section "Verificación de SSL"

# Verificar certificado
if [ -f "certbot/conf/live/fims.iamet.mx/fullchain.pem" ]; then
    echo -e "${GREEN}✓${NC} Certificado SSL existe"
    ((PASSED++))
    
    # Obtener fecha de expiración
    EXPIRY=$(openssl x509 -enddate -noout -in certbot/conf/live/fims.iamet.mx/fullchain.pem | cut -d= -f2)
    echo "  Expira: $EXPIRY"
else
    echo -e "${RED}✗${NC} Certificado SSL no existe"
    ((FAILED++))
fi

# Verificación 6: Volúmenes
print_section "Verificación de Volúmenes"

# Verificar volumen de PostgreSQL
docker volume ls | grep -q "postgres_data"
check_status "Volumen postgres_data existe"

# Verificar espacio disponible
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -lt 80 ]; then
    echo -e "${GREEN}✓${NC} Espacio en disco disponible ($DISK_USAGE%)"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Espacio en disco bajo ($DISK_USAGE%)"
    ((FAILED++))
fi

# Verificación 7: Logs
print_section "Verificación de Logs"

# Verificar que no hay errores críticos en logs recientes
if docker-compose -f docker-compose.prod.yml logs --tail=100 fiims-app | grep -i "error\|fatal" > /dev/null; then
    echo -e "${YELLOW}⚠${NC} Se encontraron errores en logs recientes"
else
    echo -e "${GREEN}✓${NC} No hay errores críticos en logs"
    ((PASSED++))
fi

# Verificación 8: Configuración
print_section "Verificación de Configuración"

# Verificar archivo .env
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} Archivo .env existe"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Archivo .env no existe"
    ((FAILED++))
fi

# Verificar configuración de Nginx
if [ -f "nginx/conf.d/fiims.conf" ]; then
    echo -e "${GREEN}✓${NC} Configuración de Nginx existe"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Configuración de Nginx no existe"
    ((FAILED++))
fi

# Resumen
print_section "Resumen de Verificación"
echo ""
echo -e "Verificaciones pasadas: ${GREEN}$PASSED${NC}"
echo -e "Verificaciones fallidas: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ ¡Despliegue verificado exitosamente!${NC}"
    echo ""
    echo "📊 Información de acceso:"
    echo "  • Aplicación: https://fims.iamet.mx"
    echo "  • pgAdmin: http://localhost:5050"
    echo "  • Base de Datos: localhost:5432"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Se encontraron problemas en el despliegue${NC}"
    echo ""
    echo "Pasos para solucionar:"
    echo "  1. Revisar logs: docker-compose logs -f"
    echo "  2. Verificar servicios: docker-compose ps"
    echo "  3. Reiniciar servicios: docker-compose restart"
    echo ""
    exit 1
fi
