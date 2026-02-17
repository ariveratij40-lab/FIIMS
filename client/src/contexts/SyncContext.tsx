import React, { createContext, useContext, useState, useCallback } from 'react';

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  pendingChanges: number;
  lastSyncTime: Date | null;
  syncError: string | null;
}

interface SyncContextType {
  status: SyncStatus;
  startSync: () => Promise<void>;
  addPendingChange: () => void;
  clearPendingChanges: () => void;
  setSyncError: (error: string | null) => void;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    isSyncing: false,
    pendingChanges: 0,
    lastSyncTime: null,
    syncError: null,
  });

  // Monitorear cambios de conectividad
  React.useEffect(() => {
    const handleOnline = () => {
      setStatus((prev) => ({ ...prev, isOnline: true, syncError: null }));
    };

    const handleOffline = () => {
      setStatus((prev) => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const startSync = useCallback(async () => {
    setStatus((prev) => ({ ...prev, isSyncing: true, syncError: null }));
    try {
      // TODO: Implementar sincronización real con backend
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus((prev) => ({
        ...prev,
        isSyncing: false,
        pendingChanges: 0,
        lastSyncTime: new Date(),
      }));
    } catch (error) {
      setStatus((prev) => ({
        ...prev,
        isSyncing: false,
        syncError: error instanceof Error ? error.message : 'Error de sincronización',
      }));
    }
  }, []);

  const addPendingChange = useCallback(() => {
    setStatus((prev) => ({
      ...prev,
      pendingChanges: prev.pendingChanges + 1,
    }));
  }, []);

  const clearPendingChanges = useCallback(() => {
    setStatus((prev) => ({
      ...prev,
      pendingChanges: 0,
    }));
  }, []);

  const setSyncError = useCallback((error: string | null) => {
    setStatus((prev) => ({
      ...prev,
      syncError: error,
    }));
  }, []);

  return (
    <SyncContext.Provider
      value={{
        status,
        startSync,
        addPendingChange,
        clearPendingChanges,
        setSyncError,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync debe ser usado dentro de SyncProvider');
  }
  return context;
}
