import { useState, useCallback } from 'react';
import { trpc } from '../lib/_core/trpc';

export function useNodos() {
  const [selectedNodo, setSelectedNodo] = useState<string | null>(null);

  const listQuery = trpc.nodos.list.useQuery();
  const createMutation = trpc.nodos.create.useMutation();
  const updateMutation = trpc.nodos.update.useMutation();
  const deleteMutation = trpc.nodos.delete.useMutation();
  const findByCodeQuery = trpc.nodos.findByCode.useQuery(
    { codigo_unico: selectedNodo || '' },
    { enabled: !!selectedNodo }
  );

  const createNodo = useCallback(
    async (data: any) => {
      try {
        const result = await createMutation.mutateAsync(data);
        await listQuery.refetch();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [createMutation, listQuery]
  );

  const updateNodo = useCallback(
    async (id: string, data: any) => {
      try {
        const result = await updateMutation.mutateAsync({ id, data });
        await listQuery.refetch();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [updateMutation, listQuery]
  );

  const deleteNodo = useCallback(
    async (id: string) => {
      try {
        await deleteMutation.mutateAsync({ id });
        await listQuery.refetch();
      } catch (error) {
        throw error;
      }
    },
    [deleteMutation, listQuery]
  );

  const findByCode = useCallback(
    async (codigo: string) => {
      setSelectedNodo(codigo);
      return findByCodeQuery.data;
    },
    [findByCodeQuery]
  );

  return {
    nodos: listQuery.data || [],
    isLoading: listQuery.isLoading,
    error: listQuery.error,
    createNodo,
    updateNodo,
    deleteNodo,
    findByCode,
    refetch: listQuery.refetch,
  };
}
