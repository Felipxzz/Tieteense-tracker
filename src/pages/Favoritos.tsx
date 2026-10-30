import { Link } from 'react-router-dom';
import { Star, Trash2 } from 'lucide-react';
import { Button, Card, Reveal, botaoClasses } from '@/components/ui';
import { useFavoritos } from '@/contexts/FavoritosContext';
import { buscarLinha } from '@/services/transporte';
import type { Linha } from '@/types';

export default function Favoritos() {
  const { favoritos, carregando, erro, removerFavorito } = useFavoritos();
  const linhas = favoritos.map((id) => buscarLinha(id)).filter((l): l is Linha => l !== undefined);

  return (
    <>
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Favoritos</h1>
        <p className="text-muted">Suas linhas salvas na conta.</p>
      </header>

      {erro && (
        <p role="alert" className="animate-fade-in rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {erro}
        </p>
      )}

      {carregando ? (
        <p className="text-sm text-muted">Carregando favoritos…</p>
      ) : linhas.length === 0 ? (
        <Card className="space-y-4 text-center">
          <Star className="mx-auto h-8 w-8 animate-pop text-brand" aria-hidden />
          <p className="font-semibold">Nenhuma linha favorita ainda</p>
          <p className="text-sm text-muted">Favorite uma linha na lista de linhas para vê-la aqui.</p>
          <Link to="/linhas" className={botaoClasses('outline')}>
            Ver linhas
          </Link>
        </Card>
      ) : (
        <div className="grid gap-3">
          {linhas.map((linha, i) => (
            <Reveal key={linha.id} delay={i * 70}>
              <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">
                    Linha {linha.codigo}: {linha.nome}
                  </p>
                  <p className="text-sm text-muted">
                    {linha.origem} → {linha.destino}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/linhas/${linha.id}`} className={botaoClasses('outline', 'sm')}>
                    Ver linha
                  </Link>
                  <Button variant="danger" size="sm" onClick={() => removerFavorito(linha.id)}>
                    <Trash2 className="h-4 w-4" /> Remover
                  </Button>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      )}
    </>
  );
}
