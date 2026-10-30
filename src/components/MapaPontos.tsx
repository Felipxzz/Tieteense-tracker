import { useEffect, useMemo } from 'react';
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { CENTRO_TIETE } from '@/lib/geo';
import { cn } from '@/lib/utils';
import type { Parada } from '@/types';

const COR = '#5D35B1';
type Coordenada = [number, number];

/** Enquadra as paradas com coordenadas. Sem coordenadas, volta ao centro de Tietê. */
function Ajustar({ pontos, chave }: { pontos: Coordenada[]; chave: number }) {
  const map = useMap();
  useEffect(() => {
    if (pontos.length > 0) {
      map.fitBounds(pontos, { padding: [40, 40] });
    } else {
      map.setView(CENTRO_TIETE, 13);
    }
  }, [map, pontos, chave]);
  return null;
}

interface MapaPontosProps {
  paradas: Parada[];
  /** Mudar este número recentraliza o mapa. */
  chave?: number;
  altura?: string;
}

export function MapaPontos({ paradas, chave = 0, altura = 'h-80' }: MapaPontosProps) {
  // Só desenha marcadores de paradas com coordenadas reais. Nada é estimado.
  const marcados = useMemo(
    () =>
      paradas.flatMap((p, i) =>
        p.lat !== undefined && p.lng !== undefined
          ? [{ chave: `${i}-${p.nome}`, nome: p.nome, municipio: p.municipio, ordem: i + 1, posicao: [p.lat, p.lng] as Coordenada }]
          : [],
      ),
    [paradas],
  );
  const coordenadas = useMemo(() => marcados.map((m) => m.posicao), [marcados]);
  const temCoordenadas = coordenadas.length > 0;

  return (
    <div className={cn('relative animate-fade-in overflow-hidden rounded-2xl border border-border shadow-soft', altura)}>
      <MapContainer
        center={temCoordenadas ? coordenadas[0] : CENTRO_TIETE}
        zoom={temCoordenadas ? 14 : 13}
        scrollWheelZoom={false}
        className="h-full w-full"
        aria-label="Mapa de Tietê (SP)"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {coordenadas.length > 1 && (
          <Polyline positions={coordenadas} pathOptions={{ color: COR, weight: 4, opacity: 0.8 }} />
        )}
        {marcados.map((m) => (
          <CircleMarker
            key={m.chave}
            center={m.posicao}
            radius={7}
            pathOptions={{ color: COR, fillColor: '#ffffff', fillOpacity: 1, weight: 3 }}
          >
            <Popup>
              <strong>
                {m.ordem}. {m.nome}
              </strong>
              <br />
              {m.municipio}
            </Popup>
          </CircleMarker>
        ))}
        <Ajustar pontos={coordenadas} chave={chave} />
      </MapContainer>

      {!temCoordenadas && (
        <p className="absolute bottom-3 left-3 right-3 rounded-xl bg-card/90 p-2 text-center text-xs text-muted shadow-soft">
          A fonte oficial não informa a localização exata das paradas. Mapa centralizado em Tietê (SP).
        </p>
      )}
    </div>
  );
}
