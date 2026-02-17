import { z } from 'zod';

// Categorías de cables
export const CategoriaSchema = z.enum(['Cat5e', 'Cat6', 'Cat6a', 'OM3', 'OM4', 'OS2']);
export type Categoria = z.infer<typeof CategoriaSchema>;

// Estados de nodos
export const EstadoNodoSchema = z.enum(['activo', 'libre', 'reservado', 'defectuoso']);
export type EstadoNodo = z.infer<typeof EstadoNodoSchema>;

// Roles de usuarios
export const RolSchema = z.enum(['tecnico', 'admin', 'super_admin']);
export type Rol = z.infer<typeof RolSchema>;

// Tipos de cambios
export const TipoCambioSchema = z.enum(['creacion', 'actualizacion', 'escaneo']);
export type TipoCambio = z.infer<typeof TipoCambioSchema>;

// Esquema de creación de nodo
export const CreateNodoSchema = z.object({
  categoria: CategoriaSchema,
  color_cable: z.string().min(1).max(30),
  integrador: z.string().min(1).max(100),
  ubicacion_area: z.string().min(1).max(100),
  ubicacion_faceplate: z.string().min(1).max(50),
  foto_url: z.string().url().optional(),
});

export type CreateNodo = z.infer<typeof CreateNodoSchema>;

// Esquema de actualización de nodo
export const UpdateNodoSchema = CreateNodoSchema.partial().extend({
  estado: EstadoNodoSchema.optional(),
});

export type UpdateNodo = z.infer<typeof UpdateNodoSchema>;

// Esquema de cambio de nodo
export const CreateCambioSchema = z.object({
  nodo_id: z.string().uuid(),
  tipo_cambio: TipoCambioSchema,
  datos_anteriores: z.record(z.any()).optional(),
  datos_nuevos: z.record(z.any()),
});

export type CreateCambio = z.infer<typeof CreateCambioSchema>;
