import React, { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { NodoForm } from '../components/NodoForm/NodoForm';
import { useNodos } from '../hooks/useNodos';
import { Card, CardContent } from '../components/ui/Card';

export function EditNodoPage() {
  const [match, params] = useRoute('/nodos/:id');
  const { nodos, isLoading } = useNodos();
  const [nodo, setNodo] = useState<any>(null);

  useEffect(() => {
    if (params?.id && nodos.length > 0) {
      const foundNodo = nodos.find((n) => n.id === params.id);
      setNodo(foundNodo);
    }
  }, [params?.id, nodos]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-slate-500">Cargando nodo...</p>
        </CardContent>
      </Card>
    );
  }

  if (!nodo) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-slate-500">Nodo no encontrado</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <NodoForm
      nodoId={params?.id}
      initialData={nodo}
      isEditing={true}
    />
  );
}
