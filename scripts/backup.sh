#!/bin/bash

# Script de backup para FIIMS Fase 1
# Uso: bash scripts/backup.sh

set -e

echo "💾 Iniciando backup de FIIMS Fase 1..."

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

# Variables
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/fiims_backup_$TIMESTAMP.sql"
DB_NAME="fiims_db"
DB_USER="fiims_user"

# Crear directorio de backups si no existe
mkdir -p $BACKUP_DIR

# Crear backup
print_info "Creando backup de base de datos..."
docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump \
    -U $DB_USER \
    -d $DB_NAME \
    --verbose > $BACKUP_FILE

print_status "Backup creado: $BACKUP_FILE"

# Comprimir backup
print_info "Comprimiendo backup..."
gzip $BACKUP_FILE
print_status "Backup comprimido: ${BACKUP_FILE}.gz"

# Mostrar información
FILE_SIZE=$(du -h "${BACKUP_FILE}.gz" | cut -f1)
print_info "Tamaño del backup: $FILE_SIZE"

# Limpiar backups antiguos (mantener últimos 7 días)
print_info "Limpiando backups antiguos..."
find $BACKUP_DIR -name "fiims_backup_*.sql.gz" -mtime +7 -delete
print_status "Backups antiguos eliminados"

print_status "¡Backup completado!"
echo ""
echo "📁 Ubicación del backup: ${BACKUP_FILE}.gz"
