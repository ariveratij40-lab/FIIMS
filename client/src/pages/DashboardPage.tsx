import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSync } from '../contexts/SyncContext';
import { useNodos } from '../hooks/useNodos';
import { useCambios } from '../hooks/useCambios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Link } from 'wouter';
import { Activity, Database, RefreshCw, AlertCircle } from 'lucide-react';

export function DashboardPage() {
  const { user } = useAuth();
  const { status, startSync } = useSync();
  const { nodos } = useNodos();
  const { pendingSync } = useCambios();

  const stats = [
    {
      title: 'Total de Nodos',
      value: nodos.length,
      icon: Database,
      color: 'bg-blue-500',
    },
    {
      title: 'Cambios Pendientes',
      value: pendingSync.length,
      icon: AlertCircle,
      color: 'bg-yellow-500',
    },
    {
      title: 'Estado de Sincronización',
      value: status.isOnline ? 'En línea' : 'Sin conexión',
      icon: Activity,
      color: status.isOnline ? 'bg-green-500' : 'bg-red-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Bienvenido, {user?.nombre}</p>
        </div>
        <Button
          onClick={() => startSync()}
          disabled={status.isSyncing || !status.isOnline}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${status.isSyncing ? 'animate-spin' : ''}`} />
          {status.isSyncing ? 'Sincronizando...' : 'Sincronizar'}
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Estado de Sincronización */}
      {status.syncError && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-900">Error de Sincronización</CardTitle>
          </CardHeader>
          <CardContent className="text-red-800">{status.syncError}</CardContent>
        </Card>
      )}

      {/* Acciones Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Crear Nuevo Nodo</CardTitle>
            <CardDescription>Registra un nuevo nodo de cableado estructurado</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/nodos/new">
              <Button className="w-full">Crear Nodo</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ver Historial</CardTitle>
            <CardDescription>Consulta el historial de cambios realizados</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/cambios">
              <Button className="w-full" variant="outline">
                Ver Historial
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Información de Última Sincronización */}
      {status.lastSyncTime && (
        <Card className="bg-slate-50">
          <CardContent className="pt-6">
            <p className="text-sm text-slate-600">
              Última sincronización: {status.lastSyncTime.toLocaleString('es-ES')}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
