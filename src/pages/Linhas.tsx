import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { LinhaCard } from '@/components/LinhaCard';
import { Button, Card, Input, Reveal } from '@/components/ui';
import { useFavoritos } from '@/contexts/FavoritosContext';
import { listarLinhas } from '@/services/transporte';

export default function Linhas() {
  const [busca, setBusca] = useState('');
  const { erro } = useFavoritos();
  const linhas = listarLinhas();

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return linhas;
    return linhas.filter((l) =>
      [l.codigo, l.nome, l.origem, l.destino].some((campo) => campo.toLowerCase().includes(termo)),
    );
  }, [busca, linhas]);

  return (
    <>
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Linhas e itinerários</h1>
        <p className="text-muted">Busque por número, nome, origem ou destino.</p>
      </header>

      <form role="search" onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Ex.: 6109, Tietê, Cerquilho"
            className="pl-9"
            aria-label="Buscar linha"
          />
        </div>
        <Button variant="outline" onClick={() => setBusca('')} disabled={!busca} className="sm:flex-none">
          <X className="h-4 w-4" /> Limpar
        </Button>
      </form>

      {erro && (
        <p role="alert" className="animate-fade-in rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {erro}
        </p>
      )}

      <p className="text-sm text-muted" aria-live="polite">
        {filtradas.length} de {linhas.length} linha(s)
      </p>

      {filtradas.length === 0 ? (
        <Card className="text-center text-sm text-muted">Nenhuma linha encontrada para "{busca}".</Card>
      ) : (
        <div className="grid gap-3">
          {filtradas.map((linha, i) => (
            <Reveal key={linha.id} delay={Math.min(i, 8) * 60}>
              <LinhaCard linha={linha} />
            </Reveal>
          ))}
        </div>
      )}
    </>
  );
}
