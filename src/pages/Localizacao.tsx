import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { AvisoDemo } from '@/components/AvisoDemo';
import { StatusLocalizacao } from '@/components/StatusLocalizacao';
import { Button, Card, Reveal } from '@/components/ui';
import { formatarDataHora } from '@/lib/horarios';
import { listarLinhas, listarPosicoes } from '@/services/transporte';

export default function Localizacao() {
  const [verificadoEm, setVerificadoEm] = useState(() => new Date().toISOString());
  const linhas = listarLinhas();
  const total = listarPosicoes().length;

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Localização dos ônibus</h1>
          <p className="text-muted">Status de localização por linha.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setVerificadoEm(new Date().toISOString())}>
          <RefreshCw className="h-4 w-4" /> Atualizar
        </Button>
      </header>

      <AvisoDemo />

      <Card className="space-y-1">
        <p className="text-sm">
          Posições recebidas: <strong>{total}</strong>
        </p>
        <p className="text-xs text-muted">Última verificação: {formatarDataHora(verificadoEm)}</p>
        <p className="pt-2 text-sm text-muted">
          Para exibir posições reais, é preciso uma fonte de GPS autorizada pela empresa de transporte. Sem ela, o
          aplicativo mostra o estado "Localização indisponível".
        </p>
      </Card>

      <div className="grid gap-4">
        {linhas.map((linha, i) => (
          <Reveal key={linha.id} delay={i * 70}>
          <Card className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-semibold">
                Linha {linha.codigo}: {linha.nome}
              </h2>
              <Link to={`/linhas/${linha.id}`} className="text-sm font-medium text-brand hover:underline">
                Ver linha
              </Link>
            </div>
            <StatusLocalizacao linhaId={linha.id} />
          </Card>
          </Reveal>
        ))}
      </div>
    </>
  );
}
