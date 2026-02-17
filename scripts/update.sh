#!/bin/bash

# Script de actualización para FIIMS Fase 1
# Uso: bash scripts/update.sh

set -e

echo "🔄 Iniciando actualización de FIIMS Fase 1..."

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

# 1. Detener servicios
print_info "Deteniendo servicios..."
docker-compose -f docker-compose.prod.yml down
print_status "Servicios detenidos"

# 2. Actualizar código
print_info "Actualizando código..."
git pull origin main
print_status "Código actualizado"

# 3. Instalar dependencias
print_info "Instalando dependencias..."
pnpm install
print_status "Dependencias instaladas"

# 4. Construir imagen
print_info "Construyendo imagen Docker..."
docker-compose -f docker-compose.prod.yml build
print_status "Imagen construida"

# 5. Levantar servicios
print_info "Levantando servicios..."
docker-compose -f docker-compose.prod.yml up -d
print_status "Servicios levantados"

# 6. Ejecutar migraciones
print_info "Ejecutando migraciones..."
docker-compose -f docker-compose.prod.yml exec -T fiims-app pnpm db:push
print_status "Migraciones completadas"

# 7. Verificar estado
print_info "Verificando estado de servicios..."
sleep 5
docker-compose -f docker-compose.prod.yml ps

print_status "¡Actualización completada!"
