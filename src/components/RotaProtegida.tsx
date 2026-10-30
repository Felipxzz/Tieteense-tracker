import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/** Só mostra o conteúdo para usuários com sessão. Caso contrário, leva ao login. */
export function RotaProtegida({ children }: { children: ReactNode }) {
  const { usuario, carregando } = useAuth();
  const location = useLocation();

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted">Carregando…</div>
    );
  }
  if (!usuario) {
    return <Navigate to="/login" replace state={{ de: location.pathname }} />;
  }
  return <>{children}</>;
}
