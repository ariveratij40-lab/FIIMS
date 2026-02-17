import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSync } from '../contexts/SyncContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Settings, Database, Shield, Bell } from 'lucide-react';

export function SettingsPage() {
  const { user } = useAuth();
  const { status } = useSync();
  const [apiUrl, setApiUrl] = useState(localStorage.getItem('apiUrl') || '');

  const handleSaveApiUrl = () => {
    localStorage.setItem('apiUrl', apiUrl);
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Configuración</h1>
        <p className="text-slate-600 mt-1">Gestiona la configuración de la aplicación</p>
      </div>

      {/* Información del Usuario */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Información del Usuario
          </CardTitle>
          <CardDescription>Datos de tu cuenta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-500">Nombre</Label>
              <p className="text-lg font-medium">{user?.nombre}</p>
            </div>
            <div>
              <Label className="text-slate-500">Email</Label>
              <p className="text-lg font-medium">{user?.email}</p>
            </div>
            <div>
              <Label className="text-slate-500">Rol</Label>
              <Badge className="mt-2 capitalize">{user?.rol}</Badge>
            </div>
            <div>
              <Label className="text-slate-500">Tenant</Label>
              <p className="text-lg font-medium">{user?.tenant_id}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estado del Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Estado del Sistema
          </CardTitle>
          <CardDescription>Información de sincronización y conectividad</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-500">Estado de Conexión</Label>
              <div className="flex items-center gap-2 mt-2">
                <div
                  className={`h-3 w-3 rounded-full ${
                    status.isOnline ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <span className="font-medium">
                  {status.isOnline ? 'En línea' : 'Sin conexión'}
                </span>
              </div>
            </div>
            <div>
              <Label className="text-slate-500">Cambios Pendientes</Label>
              <p className="text-lg font-medium mt-2">{status.pendingChanges}</p>
            </div>
            <div>
              <Label className="text-slate-500">Última Sincronización</Label>
              <p className="text-sm font-medium mt-2">
                {status.lastSyncTime
                  ? status.lastSyncTime.toLocaleString('es-ES')
                  : 'Nunca'}
              </p>
            </div>
            <div>
              <Label className="text-slate-500">Estado de Sincronización</Label>
              <Badge className="mt-2">
                {status.isSyncing ? 'Sincronizando...' : 'Listo'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuración de API */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuración de API
          </CardTitle>
          <CardDescription>URL del servidor backend</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiUrl">URL del Backend</Label>
            <Input
              id="apiUrl"
              type="url"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://api.fiims.com"
            />
          </div>
          <Button onClick={handleSaveApiUrl}>Guardar Configuración</Button>
        </CardContent>
      </Card>

      {/* Notificaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificaciones
          </CardTitle>
          <CardDescription>Preferencias de notificaciones</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Notificaciones de Sincronización</Label>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-between">
              <Label>Notificaciones de Errores</Label>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-between">
              <Label>Notificaciones de Cambios</Label>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información de la Aplicación */}
      <Card className="bg-slate-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-600">FIIMS - Gestión de Infraestructura Física</p>
            <p className="text-xs text-slate-500">Versión 1.0.0 - Fase 1</p>
            <p className="text-xs text-slate-500">© 2024 - Todos los derechos reservados</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
