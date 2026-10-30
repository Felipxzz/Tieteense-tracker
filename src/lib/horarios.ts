import type { TipoDia } from '@/types';

/** Converte "HH:MM" em minutos desde meia-noite. */
export function paraMinutos(hora: string): number {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
}

/** Define se a data cai em dia útil, sábado ou domingo. */
export function tipoDoDia(data: Date): TipoDia {
  const dia = data.getDay();
  if (dia === 0) return 'domingo';
  if (dia === 6) return 'sabado';
  return 'diasUteis';
}

/**
 * Retorna as próximas saídas (a partir do horário informado).
 * Pura e sem dependências de dados, para facilitar testes.
 */
export function proximasSaidas(horarios: string[], agora: Date, limite = 3): string[] {
  const minutoAtual = agora.getHours() * 60 + agora.getMinutes();
  return [...horarios]
    .sort((a, b) => paraMinutos(a) - paraMinutos(b))
    .filter((h) => paraMinutos(h) >= minutoAtual)
    .slice(0, limite);
}

export function formatarDataHora(iso: string): string {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return iso;
  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
