import { MapPinOff, Radio } from 'lucide-react';
import { Badge } from './ui';
import { formatarDataHora } from '@/lib/horarios';
import { posicoesDaLinha } from '@/services/transporte';

/**
 * Mostra a localização dos ônibus da linha.
 * Sem fonte de GPS autorizada, exibe "Localização indisponível" em vez de inventar posições.
 */
export function StatusLocalizacao({ linhaId }: { linhaId: string }) {
  const posicoes = posicoesDaLinha(linhaId);

  if (posicoes.length === 0) {
    return (
      <div className="flex items-start gap-3 rounded-xl bg-bg p-3 text-sm text-muted">
        <MapPinOff className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <div>
          <p className="font-medium text-ink">Localização indisponível</p>
          <p>Este protótipo não tem integração com GPS dos ônibus. Nenhuma posição é exibida.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {posicoes.map((p) => (
        <div key={p.veiculoId} className="flex items-center justify-between rounded-xl bg-bg p-3 text-sm">
          <span className="flex items-center gap-2 text-ink">
            <Radio className="h-4 w-4 animate-pulse-soft text-brand" aria-hidden /> Veículo {p.veiculoId}
          </span>
          <Badge>Atualizado em {formatarDataHora(p.atualizadoEm)}</Badge>
        </div>
      ))}
    </div>
  );
}
