import { describe, expect, it } from 'vitest';
import linhas from '../src/data/linhas.json';
import { linhaSchema, linhasArraySchema } from '../src/lib/validators';

describe('dados de Tietê', () => {
  it('todas as linhas do JSON estão no formato esperado', () => {
    expect(linhasArraySchema.safeParse(linhas).success).toBe(true);
  });

  it('todos os horários estão no formato HH:MM', () => {
    for (const linha of linhas) {
      for (const sentido of linha.sentidos) {
        const todos = [...sentido.horarios.diasUteis, ...sentido.horarios.sabado, ...sentido.horarios.domingo];
        for (const h of todos) expect(h).toMatch(/^([01]\d|2[0-3]):[0-5]\d$/);
      }
    }
  });
});

describe('linhaSchema', () => {
  it('rejeita horário fora do formato HH:MM', () => {
    const linha = {
      id: 'x',
      codigo: '1',
      nome: 'Teste',
      origem: 'A',
      destino: 'B',
      fonte: { nome: 'F', url: 'https://exemplo.gov.br', consultadaEm: '2026-10-29' },
      sentidos: [
        {
          id: 's1',
          nome: 'Ida',
          paradas: [{ nome: 'P', municipio: 'Tietê' }],
          horarios: { diasUteis: ['25:99'], sabado: [], domingo: [] },
        },
      ],
    };
    expect(linhaSchema.safeParse(linha).success).toBe(false);
  });
});
