import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import type { Linha } from '@/types';
import { useFavoritos } from '@/contexts/FavoritosContext';
import { Badge, Button, Card, botaoClasses } from './ui';

export function LinhaCard({ linha }: { linha: Linha }) {
  const { isFavorito, alternarFavorito } = useFavoritos();
  const favorita = isFavorito(linha.id);

  return (
    <Card className="flex flex-col gap-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 space-y-2">
        <div className="flex items-center gap-2">
          <Badge>Linha {linha.codigo}</Badge>
          <span className="text-xs text-muted">{linha.sentidos.length} sentidos</span>
        </div>
        <h3 className="font-semibold text-ink">{linha.nome}</h3>
        <p className="text-sm text-muted">
          {linha.origem} → {linha.destino}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => alternarFavorito(linha.id)}
          aria-pressed={favorita}
          aria-label={favorita ? `Remover linha ${linha.codigo} dos favoritos` : `Favoritar linha ${linha.codigo}`}
        >
          <Star key={favorita ? 'on' : 'off'} className={favorita ? 'h-4 w-4 fill-brand text-brand animate-pop' : 'h-4 w-4'} />
          {favorita ? 'Remover' : 'Favoritar'}
        </Button>
        <Link to={`/linhas/${linha.id}`} className={botaoClasses('primary', 'sm')} aria-label={`Ver detalhes da linha ${linha.codigo}`}>
          Ver linha <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Card>
  );
}
