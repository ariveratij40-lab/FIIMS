import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'wouter';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/Select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { FormField } from '../Form/FormField';
import { useNotification } from '../../contexts/AuthContext';
import { useSync } from '../../contexts/SyncContext';
import {
  CreateNodoSchema,
  UpdateNodoSchema,
  CreateNodoFormData,
  UpdateNodoFormData,
  CATEGORIAS,
  COLORES,
} from '../../lib/schemas';
import { useNodos } from '../../hooks/useNodos';
import { Loader2, ArrowLeft } from 'lucide-react';

interface NodoFormProps {
  nodoId?: string;
  initialData?: any;
  isEditing?: boolean;
}

export function NodoForm({ nodoId, initialData, isEditing = false }: NodoFormProps) {
  const navigate = useNavigate();
  const { addPendingChange } = useSync();
  const { createNodo, updateNodo } = useNodos();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = isEditing ? UpdateNodoSchema : CreateNodoSchema;
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateNodoFormData | UpdateNodoFormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      categoria: 'Cat6',
      color_cable: '',
      integrador: '',
      ubicacion_area: '',
      ubicacion_faceplate: '',
      foto_url: '',
    },
  });

  const categoria = watch('categoria');

  const onSubmit = async (data: CreateNodoFormData | UpdateNodoFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditing && nodoId) {
        await updateNodo(nodoId, data);
      } else {
        await createNodo(data as CreateNodoFormData);
      }

      addPendingChange();
      navigate('/nodos');
    } catch (error) {
      console.error('Error al guardar nodo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/nodos')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {isEditing ? 'Editar Nodo' : 'Crear Nuevo Nodo'}
          </h1>
          <p className="text-slate-600 mt-1">
            {isEditing
              ? 'Modifica los datos del nodo de cableado'
              : 'Registra un nuevo nodo de cableado estructurado'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Información Básica */}
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
            <CardDescription>Datos principales del nodo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Categoría */}
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría del Cable</Label>
              <Select defaultValue={categoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIAS.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoria && (
                <p className="text-sm text-red-500">{errors.categoria.message}</p>
              )}
            </div>

            {/* Color del Cable */}
            <div className="space-y-2">
              <Label htmlFor="color_cable">Color del Cable</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un color" />
                </SelectTrigger>
                <SelectContent>
                  {COLORES.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      {color.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.color_cable && (
                <p className="text-sm text-red-500">{errors.color_cable.message}</p>
              )}
            </div>

            {/* Integrador */}
            <div className="space-y-2">
              <Label htmlFor="integrador">Empresa Integradora</Label>
              <Input
                id="integrador"
                placeholder="Nombre de la empresa que instaló"
                {...control.register('integrador')}
              />
              {errors.integrador && (
                <p className="text-sm text-red-500">{errors.integrador.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Ubicación */}
        <Card>
          <CardHeader>
            <CardTitle>Ubicación</CardTitle>
            <CardDescription>Localización del nodo en la infraestructura</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Área */}
            <div className="space-y-2">
              <Label htmlFor="ubicacion_area">Área / Piso / Oficina</Label>
              <Input
                id="ubicacion_area"
                placeholder="Ej: Piso 3, Oficina A"
                {...control.register('ubicacion_area')}
              />
              {errors.ubicacion_area && (
                <p className="text-sm text-red-500">{errors.ubicacion_area.message}</p>
              )}
            </div>

            {/* Faceplate */}
            <div className="space-y-2">
              <Label htmlFor="ubicacion_faceplate">Número de Faceplate / Outlet</Label>
              <Input
                id="ubicacion_faceplate"
                placeholder="Ej: F-001, Outlet-A1"
                {...control.register('ubicacion_faceplate')}
              />
              {errors.ubicacion_faceplate && (
                <p className="text-sm text-red-500">{errors.ubicacion_faceplate.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Información Adicional */}
        <Card>
          <CardHeader>
            <CardTitle>Información Adicional</CardTitle>
            <CardDescription>Datos opcionales del nodo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* URL de Foto */}
            <div className="space-y-2">
              <Label htmlFor="foto_url">URL de Foto (Opcional)</Label>
              <Input
                id="foto_url"
                type="url"
                placeholder="https://ejemplo.com/foto.jpg"
                {...control.register('foto_url')}
              />
              {errors.foto_url && (
                <p className="text-sm text-red-500">{errors.foto_url.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Botones de Acción */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/nodos')}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} className="gap-2">
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEditing ? 'Guardar Cambios' : 'Crear Nodo'}
          </Button>
        </div>
      </form>
    </div>
  );
}
