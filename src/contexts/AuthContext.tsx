import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { apiFetch } from '@/services/api';
import type { Usuario } from '@/types';

interface AuthValue {
  usuario: Usuario | null;
  carregando: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  sair: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  // Ao abrir o site, descobre se já existe uma sessão válida.
  useEffect(() => {
    let ativo = true;
    apiFetch<{ usuario: Usuario }>('/api/auth/me')
      .then((d) => {
        if (ativo) setUsuario(d.usuario);
      })
      .catch(() => {
        if (ativo) setUsuario(null);
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });
    return () => {
      ativo = false;
    };
  }, []);

  const entrar = useCallback(async (email: string, senha: string) => {
    const d = await apiFetch<{ usuario: Usuario }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    });
    setUsuario(d.usuario);
  }, []);

  const sair = useCallback(async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setUsuario(null);
    }
  }, []);

  const valor = useMemo(() => ({ usuario, carregando, entrar, sair }), [usuario, carregando, entrar, sair]);

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
