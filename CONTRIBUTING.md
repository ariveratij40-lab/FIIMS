# Guía de Contribuciones - FIIMS

Gracias por tu interés en contribuir a FIIMS. Este documento proporciona directrices y procedimientos para contribuir al proyecto.

## 📋 Código de Conducta

Todos los contribuyentes deben adherirse a nuestro [Código de Conducta](CODE_OF_CONDUCT.md). Por favor, lee y comprende antes de contribuir.

## 🚀 Cómo Contribuir

### 1. Reportar Bugs

Antes de crear un reporte de bug, verifica que el problema no haya sido reportado. Si encuentras un bug:

1. **Usa un título descriptivo**
2. **Describe los pasos exactos** para reproducir el problema
3. **Proporciona ejemplos específicos** para demostrar los pasos
4. **Describe el comportamiento observado** y lo que esperabas
5. **Incluye capturas de pantalla** si es posible
6. **Menciona tu entorno** (OS, navegador, versión, etc.)

### 2. Sugerir Mejoras

Las sugerencias de mejora son bienvenidas. Para sugerir una mejora:

1. **Usa un título descriptivo**
2. **Proporciona una descripción detallada** de la mejora sugerida
3. **Lista algunos ejemplos** de cómo la mejora sería útil
4. **Menciona otros proyectos** que implementan esta mejora

### 3. Pull Requests

#### Proceso

1. **Fork el repositorio** y crea una rama desde `main`
2. **Sigue el estilo de código** del proyecto
3. **Incluye comentarios** en el código cuando sea necesario
4. **Escribe mensajes de commit claros** y descriptivos
5. **Prueba tu código** antes de enviar el PR
6. **Incluye tests** para nuevas funcionalidades
7. **Actualiza la documentación** si es necesario

#### Estructura de Commits

```
<tipo>(<alcance>): <descripción>

<cuerpo>

<pie de página>
```

**Tipos de commits:**
- `feat:` Nueva característica
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (no afectan código)
- `refactor:` Refactorización de código
- `perf:` Mejora de rendimiento
- `test:` Agregar o actualizar tests
- `chore:` Cambios en build, dependencias, etc.

**Ejemplos:**

```
feat(nodos): agregar filtro por categoría

Permite filtrar nodos por categoría de cable en la lista principal.
Implementa búsqueda en tiempo real con debounce.

Fixes #123
```

```
fix(auth): corregir expiración de token JWT

El token JWT no se renovaba correctamente al expirar.
Ahora se renueva automáticamente en background.

Fixes #456
```

## 🏗️ Guías de Desarrollo

### Configuración del Entorno

```bash
# Clonar fork
git clone https://github.com/tu-usuario/FIIMS.git
cd FIIMS

# Agregar upstream
git remote add upstream https://github.com/ariveratij40-lab/FIIMS.git

# Instalar dependencias
pnpm install

# Crear rama de feature
git checkout -b feature/tu-feature
```

### Estilo de Código

#### TypeScript/JavaScript

```typescript
// ✅ Correcto
const getUserById = async (id: string): Promise<User> => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });
  return user;
};

// ❌ Incorrecto
const get_user_by_id = async (id) => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });
  return user;
};
```

**Reglas:**
- Usa camelCase para variables y funciones
- Usa PascalCase para componentes React y clases
- Usa UPPER_SNAKE_CASE para constantes
- Incluye tipos en TypeScript
- Usa async/await en lugar de .then()
- Usa const por defecto, let cuando sea necesario

#### React

```typescript
// ✅ Correcto
interface NodoFormProps {
  nodoId?: string;
  onSubmit: (data: CreateNodoData) => void;
}

export function NodoForm({ nodoId, onSubmit }: NodoFormProps) {
  return (
    <form onSubmit={handleSubmit}>
      {/* JSX */}
    </form>
  );
}

// ❌ Incorrecto
export function NodoForm(props) {
  return (
    <form>
      {/* JSX */}
    </form>
  );
}
```

**Reglas:**
- Usa componentes funcionales
- Define props con interfaces
- Usa hooks en lugar de class components
- Mantén componentes pequeños y reutilizables

#### CSS/Tailwind

```jsx
// ✅ Correcto
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  <h2 className="text-lg font-semibold text-slate-900">Título</h2>
  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
    Acción
  </button>
</div>

// ❌ Incorrecto
<div style={{display: 'flex', justifyContent: 'space-between'}}>
  <h2 style={{fontSize: '18px', fontWeight: 'bold'}}>Título</h2>
  <button style={{backgroundColor: 'blue', color: 'white'}}>Acción</button>
</div>
```

**Reglas:**
- Usa Tailwind CSS en lugar de CSS en línea
- Mantén clases en orden: layout, posición, tamaño, tipografía, color
- Usa responsive prefixes (sm:, md:, lg:, xl:)

### Testing

```bash
# Ejecutar tests
pnpm test

# Tests en watch mode
pnpm test:watch

# Coverage
pnpm test:coverage

# E2E
pnpm test:e2e
```

**Escribir tests:**

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { createNodo } from './nodos.service';

describe('Nodos Service', () => {
  beforeEach(() => {
    // Setup
  });

  it('debe crear un nodo correctamente', async () => {
    const data = {
      categoria: 'Cat6',
      color_cable: 'Azul',
      integrador: 'Test Corp',
    };

    const result = await createNodo(data);

    expect(result).toBeDefined();
    expect(result.codigo_unico).toMatch(/^NODO-/);
  });

  it('debe lanzar error si falta información', async () => {
    const data = {
      categoria: 'Cat6',
      // Falta color_cable
    };

    expect(() => createNodo(data)).rejects.toThrow();
  });
});
```

### Documentación

- Actualiza README.md si cambias funcionalidad
- Documenta funciones complejas con JSDoc
- Incluye ejemplos de uso
- Mantén documentación sincronizada con código

```typescript
/**
 * Crea un nuevo nodo de cableado
 * @param data - Datos del nodo a crear
 * @returns Nodo creado con código único
 * @throws Error si los datos son inválidos
 * 
 * @example
 * const nodo = await createNodo({
 *   categoria: 'Cat6',
 *   color_cable: 'Azul',
 *   integrador: 'Test Corp'
 * });
 */
export async function createNodo(data: CreateNodoData): Promise<Nodo> {
  // Implementación
}
```

## 📦 Proceso de Review

1. **Verificación automática** - Tests, linting, build
2. **Review de código** - Al menos 1 revisor
3. **Aprobación** - Debe ser aprobado antes de merge
4. **Merge** - Squash and merge a main

## 🔄 Mantener tu Fork Actualizado

```bash
# Traer cambios del upstream
git fetch upstream

# Rebase tu rama
git rebase upstream/main

# Push a tu fork
git push origin feature/tu-feature --force-with-lease
```

## 📚 Recursos Útiles

- [Documentación de React](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [Drizzle ORM](https://orm.drizzle.team)

## ❓ Preguntas

Si tienes preguntas:

1. Revisa la [documentación](docs/)
2. Busca en [GitHub Issues](https://github.com/ariveratij40-lab/FIIMS/issues)
3. Abre una [Discussion](https://github.com/ariveratij40-lab/FIIMS/discussions)

## 📝 Licencia

Al contribuir, aceptas que tus contribuciones se licencien bajo la misma licencia del proyecto.

---

¡Gracias por contribuir a FIIMS! 🎉
