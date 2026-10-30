import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bus, MapPin, RefreshCw, Route } from 'lucide-react';
import { AvisoDemo } from '@/components/AvisoDemo';
import { MapaPontos } from '@/components/MapaPontos';
import { Button, Card, Reveal } from '@/components/ui';
import { formatarDataHora } from '@/lib/horarios';
import { getMeta, listarLinhas, listarPosicoes } from '@/services/transporte';

export default function Inicio() {
  const [verificadoEm, setVerificadoEm] = useState(() => new Date());
  const linhas = listarLinhas();
  const comLocalizacao = listarPosicoes().length;
  const meta = getMeta();
  const sentidoDestaque = linhas[0]?.sentidos[0];

  const indicadores = [
    { rotulo: 'Linhas cadastradas', valor: linhas.length, icone: Route },
    { rotulo: 'Paradas no trajeto', valor: sentidoDestaque?.paradas.length ?? 0, icone: MapPin },
    { rotulo: 'Ônibus com localização', valor: comLocalizacao, icone: Bus },
  ];

  return (
    <>
      <header className="space-y-2">
        <p className="text-sm font-medium text-brand">Tietê (SP)</p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Horários e itinerários de ônibus</h1>
        <p className="max-w-2xl text-muted">
          Consulte as linhas que atendem Tietê, veja o itinerário completo e os próximos horários de saída.
        </p>
      </header>

      <AvisoDemo />

      <section aria-label="Indicadores" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {indicadores.map(({ rotulo, valor, icone: Icon }, i) => (
          <Reveal key={rotulo} delay={i * 80}>
            <Card className="space-y-3 p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <Icon className="h-4 w-4" aria-hidden />
              </div>
              <p className="text-2xl font-semibold">{valor}</p>
              <p className="text-xs text-muted">{rotulo}</p>
            </Card>
          </Reveal>
        ))}
        <Reveal delay={indicadores.length * 80}>
          <Card className="space-y-3 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <RefreshCw className="h-4 w-4" aria-hidden />
            </div>
            <p className="text-sm font-semibold">{formatarDataHora(meta.ultimaAtualizacao)}</p>
            <p className="text-xs text-muted">Última atualização dos dados</p>
          </Card>
        </Reveal>
      </section>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">Mapa de Tietê</h2>
            <p className="text-xs text-muted">
              Verificado às {verificadoEm.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setVerificadoEm(new Date())}>
            <RefreshCw className="h-4 w-4" /> Atualizar
          </Button>
        </div>
        <MapaPontos paradas={sentidoDestaque?.paradas ?? []} altura="h-72 sm:h-96" />
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link to="/linhas" className="group">
          <Card className="flex h-full items-center justify-between transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
            <div>
              <p className="font-semibold">Ver linhas e horários</p>
              <p className="text-sm text-muted">Itinerários, paradas e próximas saídas</p>
            </div>
            <ArrowRight className="h-5 w-5 text-brand transition-transform group-hover:translate-x-1" />
          </Card>
        </Link>
        <Link to="/sobre" className="group">
          <Card className="flex h-full items-center justify-between transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
            <div>
              <p className="font-semibold">Sobre o projeto</p>
              <p className="text-sm text-muted">Problema, objetivos e metodologia</p>
            </div>
            <ArrowRight className="h-5 w-5 text-brand transition-transform group-hover:translate-x-1" />
          </Card>
        </Link>
      </div>
    </>
  );
}
