# Guía de Despliegue - FIIMS Fase 1

## Requisitos Previos

- Ubuntu 22.04 LTS
- Docker y Docker Compose instalados
- Nginx configurado
- PostgreSQL en contenedor (red `infra_network`)
- Dominio configurado (ej: fiims.tu-dominio.com)

## Pasos de Despliegue

### 1. Preparar el Entorno

```bash
# Clonar el repositorio
git clone <tu-repo> fiims-fase1
cd fiims-fase1

# Crear archivo .env desde el ejemplo
cp .env.example .env

# Editar .env con tus valores
nano .env
```

### 2. Crear la Red de Infraestructura (si no existe)

```bash
# Crear la red externa para compartir PostgreSQL
docker network create infra_network
```

### 3. Levantar los Contenedores

```bash
# Construir la imagen
docker-compose build

# Levantar los servicios
docker-compose up -d

# Verificar que los contenedores están corriendo
docker-compose ps
```

### 4. Ejecutar Migraciones de Base de Datos

```bash
# Ejecutar migraciones de Drizzle
docker-compose exec fiims-app pnpm db:push

# Ejecutar seed data
docker-compose exec fiims-app pnpm tsx drizzle/seed.ts
```

### 5. Configurar SSL con Let's Encrypt

```bash
# Generar certificado SSL
docker-compose exec certbot certbot certonly --webroot \
  -w /var/www/certbot \
  -d fiims.tu-dominio.com \
  --email tu-email@example.com \
  --agree-tos \
  --non-interactive
```

### 6. Verificar el Despliegue

```bash
# Verificar que la aplicación está respondiendo
curl http://localhost:3001/health

# Ver logs
docker-compose logs -f fiims-app
```

## Mantenimiento

### Backups de Base de Datos

```bash
# Crear backup
docker-compose exec postgres pg_dump -U fiims_user fiims_db > backup.sql

# Restaurar backup
cat backup.sql | docker-compose exec -T postgres psql -U fiims_user fiims_db
```

### Actualizar la Aplicación

```bash
# Detener contenedores
docker-compose down

# Actualizar código
git pull

# Reconstruir y levantar
docker-compose up -d --build
```

### Ver Logs

```bash
# Logs de la aplicación
docker-compose logs -f fiims-app

# Logs de Nginx
docker-compose logs -f nginx

# Logs de PostgreSQL
docker-compose logs -f postgres
```

## Solución de Problemas

### Conexión a Base de Datos Rechazada

```bash
# Verificar que PostgreSQL está corriendo
docker ps | grep postgres

# Verificar credenciales en .env
docker-compose exec postgres psql -U fiims_user -d fiims_db
```

### Certificado SSL Expirado

```bash
# Renovar certificado
docker-compose exec certbot certbot renew --force-renewal
```

### Limpiar Todo

```bash
# Detener y eliminar contenedores
docker-compose down -v

# Eliminar imagen
docker rmi fiims-fase1-fiims-app
```

## Monitoreo

### Health Check

```bash
# Verificar estado de la aplicación
curl -s http://localhost:3001/health

# Verificar base de datos
docker-compose exec postgres pg_isready -U fiims_user
```

### Métricas

Considera usar herramientas como Prometheus y Grafana para monitoreo en producción.
