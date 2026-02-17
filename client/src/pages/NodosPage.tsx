import React, { useState } from 'react';
import { Link } from 'wouter';
import { useNodos } from '../hooks/useNodos';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Plus, Search, Trash2, Edit } from 'lucide-react';

export function NodosPage() {
  const { nodos, isLoading, deleteNodo } = useNodos();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNodos = nodos.filter(
    (nodo) =>
      nodo.codigo_unico.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nodo.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nodo.integrador?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este nodo?')) {
      try {
        await deleteNodo(id);
      } catch (error) {
        console.error('Error al eliminar nodo:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Nodos de Cableado</h1>
          <p className="text-slate-600 mt-1">Gestiona todos los nodos de infraestructura física</p>
        </div>
        <Link href="/nodos/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Nodo
          </Button>
        </Link>
      </div>

      {/* Búsqueda */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar por código, categoría o integrador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Nodos */}
      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-slate-500">Cargando nodos...</p>
          </CardContent>
        </Card>
      ) : filteredNodos.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-slate-500">
              {nodos.length === 0 ? 'No hay nodos registrados' : 'No se encontraron resultados'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredNodos.map((nodo) => (
            <Card key={nodo.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-lg">{nodo.codigo_unico}</CardTitle>
                  <CardDescription>{nodo.categoria}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Link href={`/nodos/${nodo.id}`}>
                    <Button size="sm" variant="outline" className="gap-2">
                      <Edit className="h-4 w-4" />
                      Editar
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="gap-2"
                    onClick={() => handleDelete(nodo.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Color</p>
                    <p className="font-medium">{nodo.color_cable || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Integrador</p>
                    <p className="font-medium">{nodo.integrador || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Ubicación</p>
                    <p className="font-medium">
                      {nodo.ubicacion_area} - {nodo.ubicacion_faceplate}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Estado</p>
                    <p className="font-medium capitalize">{nodo.estado}</p>
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
