import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, LocateFixed, RefreshCw, Star, Ticket, Clock, Trash2 } from 'lucide-react';
import { MapaPontos } from '@/components/MapaPontos';
import { StatusLocalizacao } from '@/components/StatusLocalizacao';
import { Badge, Button, Card, botaoClasses } from '@/components/ui';
import { useFavoritos } from '@/contexts/FavoritosContext';
import { formatarDataHora, proximasSaidas, tipoDoDia } from '@/lib/horarios';
import { buscarLinha } from '@/services/transporte';
import type { GradeHorarios } from '@/types';

const rotulosDia: Record<keyof GradeHorarios, string> = {
  diasUteis: 'Dias úteis',
  sabado: 'Sábado',
  domingo: 'Domingo e feriados',
};

export default function LinhaDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const linha = id ? buscarLinha(id) : undefined;

  const [indiceSentido, setIndiceSentido] = useState(0);
  const [chaveMapa, setChaveMapa] = useState(0);
  const [agora, setAgora] = useState(() => new Date());
  const { isFavorito, alternarFavorito, erro: erroFavoritos } = useFavoritos();

  const sentido = linha?.sentidos[indiceSentido] ?? linha?.sentidos[0];
  const paradas = useMemo(() => sentido?.paradas ?? [], [sentido]);

  if (!linha || !sentido) {
    return (
      <Card className="space-y-4 text-center">
        <p className="font-semibold">Linha não encontrada</p>
        <p className="text-sm text-muted">Verifique o endereço ou volte para a lista de linhas.</p>
        <Link to="/linhas" className={botaoClasses('outline')}>
          <ArrowLeft className="h-4 w-4" /> Ir para linhas
        </Link>
      </Card>
    );
  }

  const favorita = isFavorito(linha.id);
  const tipo = tipoDoDia(agora);
  const saidas = proximasSaidas(sentido.horarios[tipo], agora, 3);
  const naoOpera = tipo === 'domingo' && sentido.horarios.domingo.length === 0;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
        <Button
          variant={favorita ? 'danger' : 'outline'}
          size="sm"
          onClick={() => alternarFavorito(linha.id)}
          aria-pressed={favorita}
        >
          {favorita ? <Trash2 className="h-4 w-4" /> : <Star className="h-4 w-4" />}
          {favorita ? 'Remover dos favoritos' : 'Favoritar linha'}
        </Button>
      </div>

      {erroFavoritos && (
        <p role="alert" className="animate-fade-in rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {erroFavoritos}
        </p>
      )}

      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Linha {linha.codigo}</Badge>
          {linha.tarifa && (
            <Badge>
              <Ticket className="h-3 w-3" /> Tarifa {linha.tarifa}
            </Badge>
          )}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">{linha.nome}</h1>
        {linha.observacao && <p className="text-sm text-muted">{linha.observacao}</p>}
      </header>

      <Card className="space-y-3">
        <p className="text-sm font-medium">Sentido da viagem</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Escolher sentido">
          {linha.sentidos.map((s, i) => (
            <Button
              key={s.id}
              variant={i === indiceSentido ? 'primary' : 'outline'}
              size="sm"
              onClick={() => {
                setIndiceSentido(i);
                setChaveMapa((c) => c + 1);
              }}
              aria-pressed={i === indiceSentido}
            >
              {s.nome}
            </Button>
          ))}
        </div>
        {sentido.tempoPercurso && (
          <p className="flex items-center gap-2 text-sm text-muted">
            <Clock className="h-4 w-4" aria-hidden /> Tempo de percurso: {sentido.tempoPercurso}
          </p>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card key={sentido.id} className="animate-fade-in space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Itinerário</h2>
            <span className="text-xs text-muted">{paradas.length} paradas</span>
          </div>
          <ol className="max-h-[32rem] space-y-3 overflow-y-auto pr-1">
            {paradas.map((p, i) => (
              <li
                key={`${i}-${p.nome}`}
                className="flex animate-slide-up gap-3"
                style={{ animationDelay: `${Math.min(i, 20) * 40}ms` }}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-brand">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{p.nome}</p>
                  <p className="text-xs text-muted">{p.municipio}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>

        <div className="space-y-6 lg:col-span-3">
          <Card className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-semibold">Mapa</h2>
              <Button variant="outline" size="sm" onClick={() => setChaveMapa((c) => c + 1)}>
                <LocateFixed className="h-4 w-4" /> Centralizar
              </Button>
            </div>
            <MapaPontos paradas={paradas} chave={chaveMapa} />
          </Card>

          <Card className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-semibold">Próximas saídas hoje</h2>
              <Button variant="outline" size="sm" onClick={() => setAgora(new Date())}>
                <RefreshCw className="h-4 w-4" /> Atualizar
              </Button>
            </div>
            {naoOpera ? (
              <p className="text-sm text-muted">Esta linha não opera aos domingos e feriados.</p>
            ) : saidas.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {saidas.map((h, i) => (
                  <span
                    key={h}
                    style={{ animationDelay: `${i * 90}ms` }}
                    className="animate-slide-up rounded-xl bg-brand-soft px-3 py-2 text-lg font-semibold text-brand"
                  >
                    {h}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">Não há mais saídas previstas para hoje neste sentido.</p>
            )}
            <div className="rounded-xl bg-bg p-3 text-sm">
              <p className="font-medium">Previsão de chegada</p>
              <p className="text-muted">Previsão indisponível: não há dados em tempo real.</p>
            </div>
          </Card>

          <Card className="space-y-4">
            <h2 className="font-semibold">Tabela de horários</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {(Object.keys(rotulosDia) as (keyof GradeHorarios)[]).map((dia) => (
                <div key={dia} className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">{rotulosDia[dia]}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {sentido.horarios[dia].length > 0 ? (
                      sentido.horarios[dia].map((h) => (
                        <span key={h} className="rounded-lg border border-border px-2 py-1 text-xs">
                          {h}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted">Não opera</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="space-y-3">
            <h2 className="font-semibold">Localização dos ônibus</h2>
            <StatusLocalizacao linhaId={linha.id} />
          </Card>
        </div>
      </div>

      <Card className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted">
          Fonte: {linha.fonte.nome}, consultada em {formatarDataHora(linha.fonte.consultadaEm)}.
        </p>
        <a
          href={linha.fonte.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 font-medium text-brand hover:underline"
        >
          Ver na fonte oficial <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </Card>
    </>
  );
}
