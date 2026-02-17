# Resumen de Despliegue - FIIMS Fase 1

## 🎯 Información General

| Aspecto | Valor |
|---------|-------|
| **Proyecto** | FIIMS - Gestión de Infraestructura Física |
| **Versión** | 1.0.0 - Fase 1 |
| **Dominio** | fims.iamet.mx |
| **IP del VPS** | 108.175.9.162 |
| **Email SSL** | alvaro@baja-net.com |
| **Stack** | Node.js + React + PostgreSQL + Docker |

---

## 📦 Servicios Desplegados

### 1. **Aplicación (fiims-app)**
- **Tipo:** Node.js + Express + tRPC
- **Puerto:** 3000
- **Función:** Backend API y Frontend web

### 2. **Base de Datos (postgres)**
- **Tipo:** PostgreSQL 15 Alpine
- **Puerto:** 5432
- **Usuario:** fiims_user
- **Contraseña:** Izl*kUx00>9
- **Base de Datos:** fiims_db
- **Volumen:** postgres_data

### 3. **Gestión de BD (pgadmin)**
- **Tipo:** pgAdmin 4
- **Puerto:** 5050
- **Email:** alvaro@baja-net.com
- **Contraseña:** Izl*kUx00>9

### 4. **Proxy Inverso (nginx)**
- **Tipo:** Nginx Alpine
- **Puertos:** 80, 443
- **Función:** Proxy inverso y SSL

### 5. **Certificados SSL (certbot)**
- **Tipo:** Certbot
- **Función:** Gestión automática de certificados Let's Encrypt
- **Renovación:** Automática cada 12 horas

---

## 🔐 Credenciales

### Acceso a Aplicación
```
Email: alvaro@baja-net.com
Contraseña: (Configurada en seed data)
```

### Base de Datos
```
Host: localhost
Puerto: 5432
Usuario: fiims_user
Contraseña: Izl*kUx00>9
Base de Datos: fiims_db
```

### pgAdmin
```
URL: http://localhost:5050
Email: alvaro@baja-net.com
Contraseña: Izl*kUx00>9
```

---

## 🌐 URLs de Acceso

| Servicio | URL | Notas |
|----------|-----|-------|
| **Aplicación** | https://fims.iamet.mx | Acceso público |
| **API** | https://fims.iamet.mx/trpc | Endpoints tRPC |
| **pgAdmin** | http://localhost:5050 | Solo local |
| **PostgreSQL** | localhost:5432 | Solo local |

---

## 📁 Estructura de Directorios en VPS

```
/opt/fiims-fase1/
├── client/                 # Frontend React
├── server/                 # Backend Node.js
├── drizzle/               # ORM y migraciones
├── android/               # App Android
├── nginx/                 # Configuración Nginx
│   ├── conf.d/
│   │   └── fiims.conf
│   ├── nginx.conf
│   └── ssl-params.conf
├── certbot/               # Certificados SSL
│   ├── conf/
│   └── www/
├── scripts/               # Scripts de utilidad
│   ├── deploy.sh
│   ├── update.sh
│   ├── backup.sh
│   └── verify-deployment.sh
├── postgres_data/         # Datos de PostgreSQL (volumen)
├── uploads/              # Archivos subidos
├── docker-compose.prod.yml
├── Dockerfile
├── .env.production
├── init-db.sql
└── DEPLOYMENT_PRODUCTION.md
```

---

## 🚀 Comandos Útiles

### Gestión de Servicios

```bash
# Ver estado de servicios
docker-compose -f docker-compose.prod.yml ps

# Ver logs en tiempo real
docker-compose -f docker-compose.prod.yml logs -f

# Reiniciar servicios
docker-compose -f docker-compose.prod.yml restart

# Detener servicios
docker-compose -f docker-compose.prod.yml down

# Levantar servicios
docker-compose -f docker-compose.prod.yml up -d
```

### Mantenimiento

```bash
# Crear backup
bash scripts/backup.sh

# Actualizar aplicación
bash scripts/update.sh

# Verificar despliegue
bash scripts/verify-deployment.sh
```

### Base de Datos

```bash
# Acceder a PostgreSQL
docker-compose -f docker-compose.prod.yml exec postgres psql -U fiims_user -d fiims_db

# Ejecutar migraciones
docker-compose -f docker-compose.prod.yml exec fiims-app pnpm db:push

# Cargar seed data
docker-compose -f docker-compose.prod.yml exec fiims-app pnpm tsx drizzle/seed.ts
```

---

## 📊 Monitoreo

### Health Checks

```bash
# Verificar aplicación
curl https://fims.iamet.mx/health

# Verificar base de datos
docker-compose -f docker-compose.prod.yml exec postgres pg_isready -U fiims_user

# Verificar Nginx
docker-compose -f docker-compose.prod.yml exec nginx nginx -t
```

### Estadísticas

```bash
# Uso de recursos
docker stats

# Espacio en disco
df -h

# Tamaño de base de datos
docker-compose -f docker-compose.prod.yml exec postgres \
  psql -U fiims_user -d fiims_db -c \
  "SELECT pg_size_pretty(pg_database_size('fiims_db'));"
```

---

## 🔄 Proceso de Actualización

1. **Detener servicios**
   ```bash
   docker-compose -f docker-compose.prod.yml down
   ```

2. **Actualizar código**
   ```bash
   git pull origin main
   ```

3. **Instalar dependencias**
   ```bash
   pnpm install
   ```

4. **Construir imagen**
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

5. **Levantar servicios**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

6. **Ejecutar migraciones**
   ```bash
   docker-compose -f docker-compose.prod.yml exec fiims-app pnpm db:push
   ```

---

## 💾 Estrategia de Backup

### Automático
- Ejecutar diariamente: `0 2 * * * bash /opt/fiims-fase1/scripts/backup.sh`
- Retención: 7 días

### Manual
```bash
bash scripts/backup.sh
```

### Ubicación
```
/opt/fiims-fase1/backups/fiims_backup_YYYYMMDD_HHMMSS.sql.gz
```

---

## 🔒 Seguridad

### SSL/TLS
- ✅ Certificado Let's Encrypt
- ✅ Renovación automática
- ✅ HSTS habilitado
- ✅ TLS 1.2 y 1.3

### Firewall
```bash
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

### Contraseñas
- ✅ PostgreSQL: Izl*kUx00>9
- ✅ pgAdmin: Izl*kUx00>9
- ✅ JWT Secret: Configurado en .env

---

## 📈 Escalabilidad

### Próximos Pasos
1. **Agregar más réplicas** de la aplicación
2. **Usar load balancer** (AWS ELB, etc.)
3. **Migrar a Kubernetes** para alta disponibilidad
4. **Implementar CDN** para assets estáticos

### Límites Actuales
- 1 instancia de aplicación
- 1 instancia de PostgreSQL
- Almacenamiento limitado al VPS

---

## 🐛 Troubleshooting

### Problema: Aplicación no responde

**Solución:**
```bash
# Ver logs
docker-compose -f docker-compose.prod.yml logs fiims-app

# Reiniciar
docker-compose -f docker-compose.prod.yml restart fiims-app
```

### Problema: Error de conexión a BD

**Solución:**
```bash
# Verificar PostgreSQL
docker-compose -f docker-compose.prod.yml ps postgres

# Ver logs
docker-compose -f docker-compose.prod.yml logs postgres

# Reiniciar
docker-compose -f docker-compose.prod.yml restart postgres
```

### Problema: Certificado SSL expirado

**Solución:**
```bash
# Renovar certificado
docker-compose -f docker-compose.prod.yml exec certbot \
  certbot renew --force-renewal

# Reiniciar Nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

---

## 📞 Contacto y Soporte

- **Email:** alvaro@baja-net.com
- **Dominio:** fims.iamet.mx
- **IP VPS:** 108.175.9.162

---

## 📝 Historial de Cambios

| Fecha | Versión | Cambios |
|-------|---------|---------|
| 2024-02-17 | 1.0.0 | Despliegue inicial |

---

**Última actualización:** 17 de Febrero, 2024
**Estado:** ✅ Activo y funcionando
