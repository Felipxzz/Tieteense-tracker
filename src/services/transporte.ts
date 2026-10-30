import linhasJson from '@/data/linhas.json';
import posicoesJson from '@/data/posicoes.json';
import metaJson from '@/data/meta.json';
import { linhasArraySchema, metaSchema, posicoesArraySchema } from '@/lib/validators';
import type { Linha, MetaDados, PosicaoVeiculo } from '@/types';

// Os dados são validados na carga: um JSON fora do formato falha de imediato.
const linhas: Linha[] = linhasArraySchema.parse(linhasJson);
const posicoes: PosicaoVeiculo[] = posicoesArraySchema.parse(posicoesJson);
const meta: MetaDados = metaSchema.parse(metaJson);

export function getMeta(): MetaDados {
  return meta;
}

export function listarLinhas(): Linha[] {
  return linhas;
}

export function buscarLinha(id: string): Linha | undefined {
  return linhas.find((l) => l.id === id);
}

/** Posições vindas de fonte autorizada. Vazio enquanto não houver integração de GPS. */
export function listarPosicoes(): PosicaoVeiculo[] {
  return posicoes;
}

export function posicoesDaLinha(linhaId: string): PosicaoVeiculo[] {
  return posicoes.filter((p) => p.linhaId === linhaId);
}
