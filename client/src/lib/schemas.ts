import { z } from 'zod';

export const CategoriaSchema = z.enum(['Cat5e', 'Cat6', 'Cat6a', 'OM3', 'OM4', 'OS2']);
export type Categoria = z.infer<typeof CategoriaSchema>;

export const EstadoNodoSchema = z.enum(['activo', 'libre', 'reservado', 'defectuoso']);
export type EstadoNodo = z.infer<typeof EstadoNodoSchema>;

export const CreateNodoSchema = z.object({
  categoria: CategoriaSchema,
  color_cable: z.string().min(1, 'El color del cable es requerido').max(30),
  integrador: z.string().min(1, 'El integrador es requerido').max(100),
  ubicacion_area: z.string().min(1, 'La ubicación del área es requerida').max(100),
  ubicacion_faceplate: z.string().min(1, 'El número de faceplate es requerido').max(50),
  foto_url: z.string().url('URL inválida').optional().or(z.literal('')),
});

export type CreateNodoFormData = z.infer<typeof CreateNodoSchema>;

export const UpdateNodoSchema = CreateNodoSchema.partial().extend({
  estado: EstadoNodoSchema.optional(),
});

export type UpdateNodoFormData = z.infer<typeof UpdateNodoSchema>;

// Opciones para selects
export const CATEGORIAS = [
  { value: 'Cat5e', label: 'Categoría 5e' },
  { value: 'Cat6', label: 'Categoría 6' },
  { value: 'Cat6a', label: 'Categoría 6a' },
  { value: 'OM3', label: 'OM3 (Fibra Óptica)' },
  { value: 'OM4', label: 'OM4 (Fibra Óptica)' },
  { value: 'OS2', label: 'OS2 (Fibra Óptica)' },
];

export const COLORES = [
  { value: 'Rojo', label: 'Rojo' },
  { value: 'Azul', label: 'Azul' },
  { value: 'Verde', label: 'Verde' },
  { value: 'Amarillo', label: 'Amarillo' },
  { value: 'Naranja', label: 'Naranja' },
  { value: 'Blanco', label: 'Blanco' },
  { value: 'Negro', label: 'Negro' },
  { value: 'Gris', label: 'Gris' },
];

export const ESTADOS = [
  { value: 'activo', label: 'Activo' },
  { value: 'libre', label: 'Libre' },
  { value: 'reservado', label: 'Reservado' },
  { value: 'defectuoso', label: 'Defectuoso' },
];
