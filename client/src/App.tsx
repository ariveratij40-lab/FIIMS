import React from 'react';
import { Route, Router } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SyncProvider } from './contexts/SyncContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { trpc, queryClient } from './lib/trpc-client';

import { Layout } from './components/Layout/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { NodosPage } from './pages/NodosPage';
import { CambiosPage } from './pages/CambiosPage';
import { CreateNodoPage } from './pages/CreateNodoPage';
import { EditNodoPage } from './pages/EditNodoPage';
import { SettingsPage } from './pages/SettingsPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Route path="/login" component={LoginPage} />
      <Route path="/">
        {() => (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/dashboard">
        {() => (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/nodos">
        {() => (
          <ProtectedRoute>
            <NodosPage />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/nodos/new">
        {() => (
          <ProtectedRoute>
            <CreateNodoPage />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/nodos/:id">
        {() => (
          <ProtectedRoute>
            <EditNodoPage />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/cambios">
        {() => (
          <ProtectedRoute>
            <CambiosPage />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/settings">
        {() => (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        )}
      </Route>
      <Route>
        {() => (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        )}
      </Route>
    </Router>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpc} queryClient={queryClient}>
        <AuthProvider>
          <SyncProvider>
            <NotificationProvider>
              <AppRoutes />
              <Toaster />
            </NotificationProvider>
          </SyncProvider>
        </AuthProvider>
      </trpc.Provider>
    </QueryClientProvider>
  );
}

export default App;
