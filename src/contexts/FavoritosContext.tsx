import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { apiFetch } from '@/services/api';
import { useAuth } from './AuthContext';

interface FavoritosValue {
  favoritos: string[];
  carregando: boolean;
  erro: string | null;
  isFavorito: (linhaId: string) => boolean;
  alternarFavorito: (linhaId: string) => Promise<void>;
  removerFavorito: (linhaId: string) => Promise<void>;
}

const FavoritosContext = createContext<FavoritosValue | null>(null);

function mensagemErro(err: unknown): string {
  return err instanceof Error ? err.message : 'Não foi possível atualizar os favoritos.';
}

/** Favoritos ficam no banco, vinculados à conta. Atualização otimista com desfazer em caso de erro. */
export function FavoritosProvider({ children }: { children: ReactNode }) {
  const { usuario } = useAuth();
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario) {
      setFavoritos([]);
      setErro(null);
      return;
    }
    let ativo = true;
    setCarregando(true);
    apiFetch<{ favoritos: string[] }>('/api/favoritos')
      .then((d) => {
        if (ativo) setFavoritos(d.favoritos);
      })
      .catch((err: unknown) => {
        if (ativo) setErro(mensagemErro(err));
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });
    return () => {
      ativo = false;
    };
  }, [usuario]);

  const definir = useCallback(
    async (linhaId: string, desejado: boolean) => {
      if (!usuario) {
        setErro('Entre na sua conta para salvar favoritos.');
        return;
      }
      setErro(null);
      setFavoritos((atual) =>
        desejado ? [...atual.filter((f) => f !== linhaId), linhaId] : atual.filter((f) => f !== linhaId),
      );
      try {
        if (desejado) {
          await apiFetch('/api/favoritos', { method: 'POST', body: JSON.stringify({ linhaId }) });
        } else {
          await apiFetch(`/api/favoritos?linhaId=${encodeURIComponent(linhaId)}`, { method: 'DELETE' });
        }
      } catch (err) {
        setFavoritos((atual) =>
          desejado ? atual.filter((f) => f !== linhaId) : [...atual.filter((f) => f !== linhaId), linhaId],
        );
        setErro(mensagemErro(err));
      }
    },
    [usuario],
  );

  const isFavorito = useCallback((linhaId: string) => favoritos.includes(linhaId), [favoritos]);
  const alternarFavorito = useCallback(
    (linhaId: string) => definir(linhaId, !favoritos.includes(linhaId)),
    [definir, favoritos],
  );
  const removerFavorito = useCallback((linhaId: string) => definir(linhaId, false), [definir]);

  const valor = useMemo(
    () => ({ favoritos, carregando, erro, isFavorito, alternarFavorito, removerFavorito }),
    [favoritos, carregando, erro, isFavorito, alternarFavorito, removerFavorito],
  );

  return <FavoritosContext.Provider value={valor}>{children}</FavoritosContext.Provider>;
}

export function useFavoritos(): FavoritosValue {
  const ctx = useContext(FavoritosContext);
  if (!ctx) throw new Error('useFavoritos deve ser usado dentro de FavoritosProvider');
  return ctx;
}
