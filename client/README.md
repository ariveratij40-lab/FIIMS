# FIIMS Frontend - React + TypeScript

Frontend web para la gestión de infraestructura física (FIIMS) Fase 1.

## 🚀 Características

- **Autenticación JWT** - Sistema de login seguro
- **Gestión de Nodos** - CRUD completo para nodos de cableado
- **Historial de Cambios** - Auditoría completa de modificaciones
- **Sincronización** - Detección automática de conectividad
- **Notificaciones** - Sistema de toast con Sonner
- **Type-Safe** - Comunicación con backend mediante tRPC
- **Responsive** - Diseño mobile-first con Tailwind CSS

## 📦 Dependencias Principales

- **React 18** - Framework UI
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Estilos
- **tRPC** - RPC type-safe
- **React Query** - State management
- **React Hook Form** - Gestión de formularios
- **Zod** - Validación de esquemas
- **Radix UI** - Componentes accesibles
- **Wouter** - Router ligero
- **Sonner** - Notificaciones toast
- **Lucide React** - Iconos

## 🛠️ Instalación

```bash
# Instalar dependencias
pnpm install

# Ejecutar en desarrollo
pnpm dev

# Compilar para producción
pnpm build

# Vista previa de producción
pnpm preview
```

## 📁 Estructura del Proyecto

```
client/
├── src/
│   ├── pages/              # Páginas principales
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── NodosPage.tsx
│   │   ├── CreateNodoPage.tsx
│   │   ├── EditNodoPage.tsx
│   │   ├── CambiosPage.tsx
│   │   └── SettingsPage.tsx
│   ├── components/         # Componentes reutilizables
│   │   ├── ui/            # Componentes base (Button, Input, Card, etc.)
│   │   ├── Layout/        # Layout principal (Header, Sidebar)
│   │   ├── Form/          # Componentes de formulario
│   │   └── NodoForm/      # Formulario de nodos
│   ├── contexts/          # Context API
│   │   ├── AuthContext.tsx
│   │   ├── SyncContext.tsx
│   │   └── NotificationContext.tsx
│   ├── hooks/             # Custom hooks
│   │   ├── useNodos.ts
│   │   └── useCambios.ts
│   ├── lib/               # Utilidades
│   │   ├── _core/
│   │   ├── trpc-client.ts
│   │   ├── utils.ts
│   │   └── schemas.ts
│   ├── App.tsx            # Componente raíz
│   ├── main.tsx           # Punto de entrada
│   └── index.css          # Estilos globales
├── index.html             # HTML principal
└── vite.config.ts         # Configuración de Vite
```

## 🔐 Autenticación

El sistema utiliza JWT (JSON Web Tokens) para autenticación:

1. Usuario inicia sesión con email y contraseña
2. Backend retorna un JWT
3. Token se almacena en localStorage
4. Se envía en el header `Authorization: Bearer {token}` en cada request

## 📝 Páginas Principales

### Login
- Autenticación de usuarios
- Persistencia de sesión

### Dashboard
- Estadísticas en tiempo real
- Estado de sincronización
- Acciones rápidas

### Nodos
- Listado de nodos
- Búsqueda y filtrado
- Crear, editar, eliminar

### Crear/Editar Nodo
- Formulario con validación
- Selección de categoría, color, integrador
- Ubicación del nodo
- Vista previa

### Historial de Cambios
- Auditoría completa
- Visualización de cambios antes/después
- Estado de sincronización

### Configuración
- Información del usuario
- Estado del sistema
- Configuración de API
- Preferencias de notificaciones

## 🎨 Componentes de UI

Todos los componentes están basados en Radix UI y Tailwind CSS:

- **Button** - Botones con variantes
- **Input** - Campos de entrada
- **Label** - Etiquetas
- **Card** - Tarjetas
- **Dialog** - Diálogos modales
- **Select** - Selectores
- **Badge** - Etiquetas
- **Textarea** - Áreas de texto

## 🔄 Sincronización

El sistema detecta automáticamente cambios de conectividad:

- **Online** - Sincronización automática
- **Offline** - Almacenamiento local
- **Cambios Pendientes** - Cola de cambios sin sincronizar

## 📊 Validación de Formularios

Utiliza React Hook Form + Zod para validación robusta:

```typescript
const CreateNodoSchema = z.object({
  categoria: CategoriaSchema,
  color_cable: z.string().min(1),
  integrador: z.string().min(1),
  ubicacion_area: z.string().min(1),
  ubicacion_faceplate: z.string().min(1),
  foto_url: z.string().url().optional(),
});
```

## 🚀 Despliegue

### Desarrollo
```bash
pnpm dev
```

### Producción
```bash
pnpm build
pnpm preview
```

### Docker
```bash
docker build -t fiims-frontend .
docker run -p 3000:3000 fiims-frontend
```

## 📚 Variables de Entorno

Crear archivo `.env.local`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_TITLE=FIIMS - Gestión de Infraestructura Física
```

## 🐛 Troubleshooting

### Error de conexión a API
- Verificar que el backend está corriendo
- Verificar `VITE_API_URL` en `.env.local`
- Revisar CORS en el backend

### Problemas de autenticación
- Limpiar localStorage: `localStorage.clear()`
- Verificar token en DevTools
- Revisar expiración del token

### Estilos no se cargan
- Ejecutar `pnpm install`
- Limpiar caché: `rm -rf node_modules .next`
- Reconstruir: `pnpm build`

## 📖 Documentación Adicional

- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)

## 📄 Licencia

Todos los derechos reservados © 2024
