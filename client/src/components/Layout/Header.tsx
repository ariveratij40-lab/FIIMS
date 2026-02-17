import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSync } from '../../contexts/SyncContext';
import { Button } from '../ui/Button';
import { LogOut, Wifi, WifiOff } from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();
  const { status } = useSync();

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-slate-900">FIIMS</h2>
        <div className="flex items-center gap-2">
          {status.isOnline ? (
            <Wifi className="h-4 w-4 text-green-500" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-500" />
          )}
          <span className="text-sm text-slate-600">
            {status.isOnline ? 'En línea' : 'Sin conexión'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-900">{user?.nombre}</p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          Salir
        </Button>
      </div>
    </header>
  );
}
