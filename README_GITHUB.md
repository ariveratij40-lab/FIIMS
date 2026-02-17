# FIIMS - Gestión de Infraestructura Física

[![GitHub](https://img.shields.io/badge/GitHub-ariveratij40--lab%2FFIIMS-blue?logo=github)](https://github.com/ariveratij40-lab/FIIMS)
[![License](https://img.shields.io/badge/License-Proprietary-red)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0--Fase1-green)](CHANGELOG.md)

**FIIMS** es una plataforma SaaS multi-inquilino para la gestión integral de infraestructura física de cableado estructurado. Utiliza tecnología RFID de Zebra para trazabilidad en tiempo real y proporciona herramientas avanzadas para auditoría, etiquetado y operación de redes de datos.

## 🎯 Características Principales

### **Fase 1 - Alta de Nodos en Campo**

- ✅ **Aplicación Android** - Terminal Zebra MC33U con integración RFID
- ✅ **Alta de Nodos** - Registro de elementos de cableado estructurado
- ✅ **Cambios en Campo** - Modificación de datos en tiempo real
- ✅ **Generación de Etiquetas RFID** - Códigos únicos y trazables
- ✅ **Sincronización Inteligente** - Online/Offline con detección automática
- ✅ **Auditoría Completa** - Registro de todos los cambios
- ✅ **Dashboard Web** - Visualización y gestión centralizada

## 🏗️ Arquitectura

### **Stack Tecnológico**

| Componente | Tecnología | Versión |
|-----------|-----------|---------|
| **Backend** | Node.js + Express + tRPC | 20.x |
| **Frontend Web** | React + TypeScript + Tailwind | 18.x |
| **Aplicación Móvil** | Android (Kotlin) + Zebra SDK | 13+ |
| **Base de Datos** | PostgreSQL | 15 |
| **ORM** | Drizzle ORM | Latest |
| **Infraestructura** | Docker + Docker Compose | Latest |
| **Proxy Inverso** | Nginx | Alpine |
| **SSL** | Let's Encrypt + Certbot | Latest |

### **Diagrama de Arquitectura**

```
┌─────────────────────────────────────────────────────────┐
│                    Internet                              │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
   ┌────▼────┐              ┌────▼────┐
   │ Certbot  │              │  Nginx   │
   │ (SSL)    │              │ (Proxy)  │
   └─────────┘              └────┬────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
              ┌─────▼────┐            ┌──────▼──────┐
              │ fiims-app │            │   pgAdmin   │
              │ (Backend) │            │  (Gestión)  │
              └─────┬────┘            └─────────────┘
                    │
              ┌─────▼────────┐
              │  PostgreSQL  │
              │  (BD)        │
              └──────────────┘
```

## 📁 Estructura del Proyecto

```
fiims-fase1/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── pages/            # Páginas principales
│   │   ├── components/       # Componentes reutilizables
│   │   ├── contexts/         # Context API
│   │   ├── hooks/            # Custom hooks
│   │   └── lib/              # Utilidades y configuración
│   └── index.html
├── server/                    # Backend Node.js
│   ├── _core/                # Configuración central
│   ├── routers/              # Routers tRPC
│   ├── db.ts                 # Conexión a BD
│   └── index.ts              # Punto de entrada
├── android/                   # Aplicación Android
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── java/com/fiims/
│   │   │   │   ├── data/     # Modelos y API
│   │   │   │   ├── hardware/ # Integración Zebra
│   │   │   │   └── viewmodel/# ViewModels
│   │   │   └── AndroidManifest.xml
│   │   └── build.gradle.kts
│   └── build.gradle.kts
├── drizzle/                   # ORM y migraciones
│   ├── schema.ts             # Definición de tablas
│   ├── relations.ts          # Relaciones entre tablas
│   └── seed.ts               # Datos iniciales
├── nginx/                     # Configuración Nginx
│   ├── conf.d/
│   │   ├── fiims.conf        # Desarrollo
│   │   └── fiims.prod.conf   # Producción
│   ├── nginx.conf
│   └── ssl-params.conf
├── scripts/                   # Scripts de utilidad
│   ├── deploy.sh             # Despliegue
│   ├── update.sh             # Actualización
│   ├── backup.sh             # Backup
│   └── verify-deployment.sh  # Verificación
├── docker-compose.yml         # Desarrollo
├── docker-compose.prod.yml    # Producción
├── Dockerfile                 # Construcción de imagen
├── init-db.sql               # Inicialización de BD
└── DEPLOYMENT_PRODUCTION.md  # Guía de despliegue
```

## 🚀 Inicio Rápido

### **Requisitos Previos**

- Node.js 20+
- Docker y Docker Compose
- PostgreSQL 15+ (o usar Docker)
- Android Studio (para desarrollo móvil)
- Git

### **Instalación Local**

```bash
# Clonar repositorio
git clone https://github.com/ariveratij40-lab/FIIMS.git
cd FIIMS

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local

# Levantar base de datos
docker-compose up -d postgres pgadmin

# Ejecutar migraciones
pnpm db:push

# Cargar datos iniciales
pnpm tsx drizzle/seed.ts

# Iniciar desarrollo
pnpm dev
```

### **Acceso a Servicios Locales**

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| Aplicación | http://localhost:5173 | Demo |
| API tRPC | http://localhost:3000/trpc | - |
| pgAdmin | http://localhost:5050 | admin@admin.com / admin |
| PostgreSQL | localhost:5432 | postgres / postgres |

## 📦 Despliegue en Producción

### **Requisitos**

- VPS con Ubuntu 22.04 LTS
- Docker y Docker Compose instalados
- Dominio configurado
- Certificado SSL (Let's Encrypt)

### **Despliegue Automatizado**

```bash
# SSH al VPS
ssh root@tu-vps-ip

# Clonar repositorio
cd /opt
git clone https://github.com/ariveratij40-lab/FIIMS.git fiims-fase1
cd fiims-fase1

# Ejecutar despliegue
bash scripts/deploy.sh
```

### **Verificación**

```bash
# Verificar despliegue
bash scripts/verify-deployment.sh

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f
```

## 🔐 Seguridad

### **Implementado**

- ✅ JWT para autenticación
- ✅ RBAC (Role-Based Access Control)
- ✅ SSL/TLS con HSTS
- ✅ Encriptación de contraseñas (bcrypt)
- ✅ Auditoría completa de cambios
- ✅ Validación de entrada (Zod)
- ✅ CORS configurado
- ✅ Rate limiting

### **Recomendaciones**

- Cambiar contraseñas por defecto en producción
- Usar variables de entorno para secretos
- Configurar firewall del VPS
- Realizar backups regulares
- Monitorear logs de seguridad

## 📊 Base de Datos

### **Tablas Principales**

```sql
-- Tenants (Multi-tenancy)
tenants (id, nombre, email, estado, fecha_creacion)

-- Usuarios
usuarios (id, tenant_id, nombre, email, rol, estado)

-- Nodos de Cableado
nodos (id, tenant_id, codigo_unico, categoria, color_cable, 
       ubicacion_area, ubicacion_faceplate, integrador, estado)

-- Cambios (Auditoría)
cambios_nodos (id, nodo_id, tipo_cambio, datos_anteriores, 
               datos_nuevos, fecha_cambio, sincronizado)

-- Etiquetas RFID
etiquetas_rfid (id, nodo_id, codigo_epc, codigo_qr, 
                fecha_generacion, estado)
```

## 🔄 Flujo de Trabajo

### **Alta de Nodo en Campo**

1. Técnico abre app en terminal Zebra MC33U
2. Completa formulario con datos del nodo
3. Selecciona categoría, color, integrador
4. Sistema genera código único (NODO-SITIO-FECHA-SECUENCIAL)
5. Genera etiqueta RFID con código EPC
6. Imprime etiqueta (impresora Zebra Bluetooth)
7. Adhiere etiqueta al nodo físico
8. Sincroniza datos al backend

### **Cambio de Nodo**

1. Técnico escanea etiqueta RFID existente
2. Sistema carga datos del nodo
3. Técnico modifica datos necesarios
4. Sistema registra cambio en auditoría
5. Sincroniza cambios al backend

## 🧪 Testing

```bash
# Tests unitarios
pnpm test

# Tests de integración
pnpm test:integration

# Coverage
pnpm test:coverage

# E2E (Cypress)
pnpm test:e2e
```

## 📚 Documentación

- [DEPLOYMENT_PRODUCTION.md](DEPLOYMENT_PRODUCTION.md) - Guía completa de despliegue
- [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md) - Resumen ejecutivo
- [client/README.md](client/README.md) - Documentación del frontend
- [API Documentation](docs/API.md) - Documentación de API

## 🔄 Versionado

Este proyecto sigue [Semantic Versioning](https://semver.org/):

- **1.0.0-Fase1** - Versión actual (Alta de nodos en campo)
- **1.1.0-Fase2** - Auditoría de infraestructura
- **1.2.0-Fase3** - Configuración de elementos
- **1.3.0-Fase4** - Operación y monitoreo

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📋 Roadmap

- [ ] Fase 2 - Auditoría de infraestructura
- [ ] Fase 3 - Configuración de elementos
- [ ] Fase 4 - Operación y monitoreo
- [ ] Integración con sistemas ERP
- [ ] App iOS
- [ ] Análisis predictivo
- [ ] Integración con otros fabricantes

## 🐛 Reporte de Bugs

Para reportar bugs, por favor abre un [GitHub Issue](https://github.com/ariveratij40-lab/FIIMS/issues) con:

- Descripción clara del problema
- Pasos para reproducir
- Comportamiento esperado
- Capturas de pantalla (si aplica)
- Entorno (OS, navegador, versión)

## 💬 Soporte

- **Email:** alvaro@baja-net.com
- **GitHub Issues:** [Reportar problema](https://github.com/ariveratij40-lab/FIIMS/issues)
- **Documentación:** Ver carpeta `/docs`

## 📄 Licencia

Este proyecto es propietario. Todos los derechos reservados © 2024.

## 👥 Autores

- **Álvaro Rivera** - Desarrollador Principal
- **FIIMS Team** - Equipo de Desarrollo

## 🙏 Agradecimientos

- Zebra Technologies - SDKs y hardware
- React Team - Framework frontend
- Node.js Community - Runtime backend
- PostgreSQL - Base de datos

## 📞 Contacto

Para más información, contacta a:
- **Email:** alvaro@baja-net.com
- **GitHub:** [@ariveratij40-lab](https://github.com/ariveratij40-lab)

---

**Última actualización:** 17 de Febrero, 2024
**Estado:** ✅ En desarrollo - Fase 1 activa
