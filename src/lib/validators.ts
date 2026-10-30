import { z } from 'zod';

const horaSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Horário inválido (use o formato HH:MM)');

export const paradaSchema = z.object({
  nome: z.string().min(1),
  municipio: z.string().min(1),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
});

export const gradeSchema = z.object({
  diasUteis: z.array(horaSchema),
  sabado: z.array(horaSchema),
  domingo: z.array(horaSchema),
});

export const sentidoSchema = z.object({
  id: z.string().min(1),
  nome: z.string().min(1),
  tempoPercurso: z.string().optional(),
  paradas: z.array(paradaSchema).min(1),
  horarios: gradeSchema,
});

export const fonteSchema = z.object({
  nome: z.string().min(1),
  url: z.string().url(),
  consultadaEm: z.string().min(1),
});

export const linhaSchema = z.object({
  id: z.string().min(1),
  codigo: z.string().min(1),
  nome: z.string().min(1),
  origem: z.string().min(1),
  destino: z.string().min(1),
  tarifa: z.string().optional(),
  observacao: z.string().optional(),
  fonte: fonteSchema,
  sentidos: z.array(sentidoSchema).min(1),
});

export const posicaoSchema = z.object({
  linhaId: z.string().min(1),
  veiculoId: z.string().min(1),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  atualizadoEm: z.string().min(1),
});

export const metaSchema = z.object({
  projeto: z.string(),
  versao: z.string(),
  fonteDados: z.string(),
  aviso: z.string(),
  ultimaAtualizacao: z.string(),
});

export const linhasArraySchema = z.array(linhaSchema);
export const posicoesArraySchema = z.array(posicaoSchema);
