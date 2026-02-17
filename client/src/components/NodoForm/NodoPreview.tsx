import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface NodoPreviewProps {
  data: {
    codigo_unico?: string;
    categoria?: string;
    color_cable?: string;
    integrador?: string;
    ubicacion_area?: string;
    ubicacion_faceplate?: string;
    estado?: string;
  };
}

export function NodoPreview({ data }: NodoPreviewProps) {
  return (
    <Card className="bg-slate-50">
      <CardHeader>
        <CardTitle className="text-lg">Vista Previa</CardTitle>
        <CardDescription>Así se verá el nodo en el sistema</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-500 uppercase">Código</p>
            <p className="font-mono text-sm font-semibold">
              {data.codigo_unico || 'NODO-XXXX-XXXX-XXXX'}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase">Categoría</p>
            <Badge className="mt-1">{data.categoria || 'Cat6'}</Badge>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase">Color</p>
            <p className="text-sm font-medium">{data.color_cable || 'No especificado'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase">Integrador</p>
            <p className="text-sm font-medium">{data.integrador || 'No especificado'}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-slate-500 uppercase">Ubicación</p>
            <p className="text-sm font-medium">
              {data.ubicacion_area && data.ubicacion_faceplate
                ? `${data.ubicacion_area} - ${data.ubicacion_faceplate}`
                : 'No especificada'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
