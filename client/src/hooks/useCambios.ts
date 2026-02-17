import { useCallback } from 'react';
import { trpc } from '../lib/_core/trpc';

export function useCambios() {
  const listAllQuery = trpc.cambios.listAll.useQuery();
  const getPendingSyncQuery = trpc.cambios.getPendingSync.useQuery();
  const markAsSyncedMutation = trpc.cambios.markAsSynced.useMutation();

  const markAsSynced = useCallback(
    async (ids: string[]) => {
      try {
        await markAsSyncedMutation.mutateAsync({ ids });
        await listAllQuery.refetch();
        await getPendingSyncQuery.refetch();
      } catch (error) {
        throw error;
      }
    },
    [markAsSyncedMutation, listAllQuery, getPendingSyncQuery]
  );

  return {
    cambios: listAllQuery.data || [],
    pendingSync: getPendingSyncQuery.data || [],
    isLoading: listAllQuery.isLoading,
    error: listAllQuery.error,
    markAsSynced,
    refetch: listAllQuery.refetch,
  };
}
