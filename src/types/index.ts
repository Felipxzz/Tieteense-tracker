export interface Parada {
  nome: string;
  municipio: string;
  lat?: number;
  lng?: number;
}

export interface GradeHorarios {
  diasUteis: string[];
  sabado: string[];
  domingo: string[];
}

export interface Sentido {
  id: string;
  nome: string;
  tempoPercurso?: string;
  paradas: Parada[];
  horarios: GradeHorarios;
}

export interface FonteDados {
  nome: string;
  url: string;
  consultadaEm: string;
}

export interface Linha {
  id: string;
  codigo: string;
  nome: string;
  origem: string;
  destino: string;
  tarifa?: string;
  observacao?: string;
  fonte: FonteDados;
  sentidos: Sentido[];
}

export interface PosicaoVeiculo {
  linhaId: string;
  veiculoId: string;
  lat: number;
  lng: number;
  atualizadoEm: string;
}

export interface MetaDados {
  projeto: string;
  versao: string;
  fonteDados: string;
  aviso: string;
  ultimaAtualizacao: string;
}

export interface Usuario {
  id: number;
  email: string;
  nome: string;
}

export type TipoDia = keyof GradeHorarios;
