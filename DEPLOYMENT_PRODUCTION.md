# Guía de Despliegue en Producción - FIIMS Fase 1

## 📋 Requisitos Previos

- **VPS con Ubuntu 22.04 LTS**
- **Docker** (v20.10+)
- **Docker Compose** (v2.0+)
- **Git** instalado
- **Dominio** configurado (fims.iamet.mx)
- **Acceso SSH** al VPS

## 🔧 Instalación de Dependencias

### 1. Actualizar Sistema

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Instalar Docker

```bash
# Descargar script de instalación
curl -fsSL https://get.docker.com -o get-docker.sh

# Ejecutar instalación
sudo sh get-docker.sh

# Agregar usuario actual al grupo docker
sudo usermod -aG docker $USER

# Aplicar cambios de grupo (sin cerrar sesión)
newgrp docker
```

### 3. Instalar Docker Compose

```bash
# Descargar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Hacer ejecutable
sudo chmod +x /usr/local/bin/docker-compose

# Verificar instalación
docker-compose --version
```

### 4. Instalar Git

```bash
sudo apt install -y git
```

## 📦 Despliegue de FIIMS

### 1. Clonar Repositorio

```bash
# Crear directorio del proyecto
mkdir -p /opt/fiims-fase1
cd /opt/fiims-fase1

# Clonar repositorio (reemplazar con tu URL)
git clone <tu-repo-url> .
```

### 2. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.production .env

# Editar con tus valores (ya están configurados)
nano .env
```

**Variables importantes:**
- `DATABASE_URL` - Conexión a PostgreSQL
- `JWT_SECRET` - Clave secreta para JWT
- `VITE_API_URL` - URL del frontend
- `DB_PASSWORD` - Contraseña de PostgreSQL
- `DOMAIN` - Tu dominio (fims.iamet.mx)

### 3. Crear Estructura de Directorios

```bash
# Crear directorios necesarios
mkdir -p certbot/conf certbot/www nginx/conf.d postgres_data uploads

# Establecer permisos
chmod 755 certbot/www
chmod 755 postgres_data
```

### 4. Configurar DNS

Asegúrate de que tu dominio `fims.iamet.mx` apunte a la IP de tu VPS:

```
fims.iamet.mx A 108.175.9.162
```

Verificar con:
```bash
nslookup fims.iamet.mx
```

### 5. Ejecutar Script de Despliegue

```bash
# Hacer script ejecutable
chmod +x scripts/deploy.sh

# Ejecutar despliegue
bash scripts/deploy.sh
```

Este script realizará:
- ✅ Verificar Docker y Docker Compose
- ✅ Crear estructura de directorios
- ✅ Generar certificado SSL
- ✅ Copiar archivos de configuración
- ✅ Construir imagen Docker
- ✅ Levantar servicios
- ✅ Ejecutar migraciones
- ✅ Cargar datos iniciales

## ✅ Verificación del Despliegue

### 1. Verificar Servicios

```bash
# Ver estado de contenedores
docker-compose -f docker-compose.prod.yml ps

# Debería mostrar:
# - fiims-app (running)
# - postgres (running)
# - pgadmin (running)
# - nginx (running)
# - certbot (running)
```

### 2. Verificar Conectividad

```bash
# Verificar que la aplicación responde
curl https://fims.iamet.mx

# Verificar API
curl https://fims.iamet.mx/health

# Verificar base de datos
docker-compose -f docker-compose.prod.yml exec postgres psql -U fiims_user -d fiims_db -c "SELECT version();"
```

### 3. Verificar Certificado SSL

```bash
# Ver detalles del certificado
openssl s_client -connect fims.iamet.mx:443 -servername fims.iamet.mx

# Verificar fecha de expiración
echo | openssl s_client -servername fims.iamet.mx -connect fims.iamet.mx:443 2>/dev/null | openssl x509 -noout -dates
```

### 4. Ver Logs

```bash
# Logs de la aplicación
docker-compose -f docker-compose.prod.yml logs -f fiims-app

# Logs de Nginx
docker-compose -f docker-compose.prod.yml logs -f nginx

# Logs de PostgreSQL
docker-compose -f docker-compose.prod.yml logs -f postgres

# Todos los logs
docker-compose -f docker-compose.prod.yml logs -f
```

## 🌐 Acceso a la Aplicación

### Aplicación Web
- **URL:** https://fims.iamet.mx
- **Credenciales:** Configuradas en seed data

### pgAdmin (Gestión de BD)
- **URL:** http://localhost:5050
- **Email:** alvaro@baja-net.com
- **Contraseña:** Izl*kUx00>9

### Base de Datos
- **Host:** localhost
- **Puerto:** 5432
- **Usuario:** fiims_user
- **Contraseña:** Izl*kUx00>9
- **Base de Datos:** fiims_db

## 🔄 Mantenimiento

### Actualizar Aplicación

```bash
# Actualizar código y servicios
bash scripts/update.sh
```

### Crear Backup

```bash
# Crear backup de base de datos
bash scripts/backup.sh

# Los backups se guardan en ./backups/
```

### Restaurar Backup

```bash
# Descomprimir backup
gunzip backups/fiims_backup_YYYYMMDD_HHMMSS.sql.gz

# Restaurar
cat backups/fiims_backup_YYYYMMDD_HHMMSS.sql | \
  docker-compose -f docker-compose.prod.yml exec -T postgres \
  psql -U fiims_user -d fiims_db
```

### Renovar Certificado SSL

```bash
# Manual
docker-compose -f docker-compose.prod.yml exec certbot \
  certbot renew --force-renewal

# Automático (cron job)
# El contenedor certbot ya está configurado para renovar automáticamente
```

### Detener Servicios

```bash
docker-compose -f docker-compose.prod.yml down
```

### Reiniciar Servicios

```bash
docker-compose -f docker-compose.prod.yml restart
```

### Limpiar Recursos

```bash
# Eliminar contenedores detenidos
docker container prune -f

# Eliminar imágenes no usadas
docker image prune -f

# Eliminar volúmenes no usados
docker volume prune -f
```

## 📊 Monitoreo

### Ver Uso de Recursos

```bash
# Estadísticas de contenedores
docker stats

# Información de volúmenes
docker volume ls
df -h
```

### Verificar Espacio en Disco

```bash
# Espacio total
df -h

# Tamaño de Docker
docker system df

# Tamaño de base de datos
docker-compose -f docker-compose.prod.yml exec postgres \
  psql -U fiims_user -d fiims_db -c \
  "SELECT pg_size_pretty(pg_database_size('fiims_db'));"
```

## 🔒 Seguridad

### Cambiar Contraseñas

```bash
# Cambiar contraseña de PostgreSQL
docker-compose -f docker-compose.prod.yml exec postgres \
  psql -U fiims_user -d fiims_db -c \
  "ALTER USER fiims_user WITH PASSWORD 'nueva_contraseña';"

# Cambiar contraseña de pgAdmin
# Acceder a pgAdmin y cambiar desde la interfaz
```

### Configurar Firewall

```bash
# Permitir SSH
sudo ufw allow 22/tcp

# Permitir HTTP
sudo ufw allow 80/tcp

# Permitir HTTPS
sudo ufw allow 443/tcp

# Denegar todo lo demás
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Activar firewall
sudo ufw enable
```

### Restringir Acceso a pgAdmin

```bash
# Editar nginx/conf.d/fiims.prod.conf
# Agregar restricción de IP para pgAdmin
location /pgadmin {
    allow 108.175.9.162;  # Tu IP
    deny all;
}
```

## 🐛 Solución de Problemas

### La aplicación no responde

```bash
# Verificar logs
docker-compose -f docker-compose.prod.yml logs fiims-app

# Reiniciar contenedor
docker-compose -f docker-compose.prod.yml restart fiims-app

# Verificar salud
docker-compose -f docker-compose.prod.yml ps
```

### Error de conexión a BD

```bash
# Verificar que PostgreSQL está corriendo
docker-compose -f docker-compose.prod.yml ps postgres

# Verificar logs de PostgreSQL
docker-compose -f docker-compose.prod.yml logs postgres

# Verificar conexión
docker-compose -f docker-compose.prod.yml exec postgres \
  psql -U fiims_user -d fiims_db -c "SELECT 1;"
```

### Certificado SSL expirado

```bash
# Renovar certificado
docker-compose -f docker-compose.prod.yml exec certbot \
  certbot renew --force-renewal

# Reiniciar Nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

### Nginx no redirige a HTTPS

```bash
# Verificar configuración de Nginx
docker-compose -f docker-compose.prod.yml exec nginx \
  nginx -t

# Ver logs de Nginx
docker-compose -f docker-compose.prod.yml logs nginx

# Reiniciar Nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

## 📈 Escalabilidad Futura

### Migrar a Kubernetes

Cuando el proyecto crezca, puedes migrar a Kubernetes:

```bash
# Convertir docker-compose a Kubernetes
kompose convert -f docker-compose.prod.yml -o k8s/

# Desplegar en Kubernetes
kubectl apply -f k8s/
```

### Agregar Load Balancer

```bash
# Usar AWS ELB, Google Cloud Load Balancer, etc.
# Configurar múltiples instancias de fiims-app
# Nginx distribuirá el tráfico
```

## 📞 Soporte

Para problemas o preguntas:
- Revisar logs: `docker-compose logs -f`
- Documentación: Ver archivos .md en el proyecto
- Contactar: alvaro@baja-net.com

---

**Última actualización:** 2024
**Versión:** 1.0.0
