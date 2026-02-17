import React from 'react';
import { useCambios } from '../hooks/useCambios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export function CambiosPage() {
  const { cambios, isLoading } = useCambios();

  const getTipoCambioColor = (tipo: string) => {
    switch (tipo) {
      case 'creacion':
        return 'bg-green-100 text-green-800';
      case 'actualizacion':
        return 'bg-blue-100 text-blue-800';
      case 'escaneo':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Historial de Cambios</h1>
        <p className="text-slate-600 mt-1">Auditoría completa de todas las modificaciones realizadas</p>
      </div>

      {/* Lista de Cambios */}
      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-slate-500">Cargando historial...</p>
          </CardContent>
        </Card>
      ) : cambios.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-slate-500">No hay cambios registrados</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {cambios.map((cambio) => (
            <Card key={cambio.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">Cambio en Nodo {cambio.nodo_id}</CardTitle>
                  <CardDescription>
                    {new Date(cambio.fecha_cambio).toLocaleString('es-ES')}
                  </CardDescription>
                </div>
                <Badge className={getTipoCambioColor(cambio.tipo_cambio)}>
                  {cambio.tipo_cambio}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cambio.datos_anteriores && (
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-2">Datos Anteriores:</p>
                      <pre className="bg-slate-50 p-3 rounded text-xs overflow-auto max-h-40">
                        {JSON.stringify(cambio.datos_anteriores, null, 2)}
                      </pre>
                    </div>
                  )}
                  {cambio.datos_nuevos && (
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-2">Datos Nuevos:</p>
                      <pre className="bg-slate-50 p-3 rounded text-xs overflow-auto max-h-40">
                        {JSON.stringify(cambio.datos_nuevos, null, 2)}
                      </pre>
                    </div>
                  )}
                  <div className="text-sm text-slate-500">
                    Técnico: {cambio.tecnico_id || 'Sistema'} | Sincronizado:{' '}
                    {cambio.sincronizado ? '✓' : '✗'}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
