import { describe, expect, it } from 'vitest';
import { paraMinutos, proximasSaidas, tipoDoDia } from '../src/lib/horarios';

describe('paraMinutos', () => {
  it('converte HH:MM em minutos', () => {
    expect(paraMinutos('00:30')).toBe(30);
    expect(paraMinutos('10:15')).toBe(615);
  });
});

describe('proximasSaidas', () => {
  it('retorna as próximas saídas a partir do horário atual, em ordem', () => {
    const agora = new Date(2026, 9, 29, 10, 30); // quinta-feira
    expect(proximasSaidas(['11:15', '09:00', '10:45', '12:00'], agora, 2)).toEqual(['10:45', '11:15']);
  });

  it('retorna lista vazia quando não há mais saídas no dia', () => {
    const agora = new Date(2026, 9, 29, 23, 0);
    expect(proximasSaidas(['06:00', '18:00'], agora)).toEqual([]);
  });
});

describe('tipoDoDia', () => {
  it('identifica dia útil, sábado e domingo', () => {
    expect(tipoDoDia(new Date(2026, 9, 29))).toBe('diasUteis'); // quinta
    expect(tipoDoDia(new Date(2026, 9, 31))).toBe('sabado');
    expect(tipoDoDia(new Date(2026, 9, 25))).toBe('domingo');
  });
});
