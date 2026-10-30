import { describe, expect, it } from 'vitest';
import {
  cookieSessao,
  gerarToken,
  hashSenha,
  hashToken,
  lerCookie,
  verificarSenha,
} from '../server/seguranca';

describe('senhas', () => {
  it('confere a senha correta e recusa a errada', async () => {
    const hash = await hashSenha('senha-forte-123');
    expect(hash.startsWith('scrypt$')).toBe(true);
    expect(await verificarSenha('senha-forte-123', hash)).toBe(true);
    expect(await verificarSenha('outra-senha', hash)).toBe(false);
  });

  it('usa salt aleatório: a mesma senha gera hashes diferentes', async () => {
    expect(await hashSenha('mesma')).not.toBe(await hashSenha('mesma'));
  });

  it('recusa quando não há hash armazenado (e-mail inexistente)', async () => {
    expect(await verificarSenha('qualquer', null)).toBe(false);
  });
});

describe('tokens e cookies', () => {
  it('gera tokens únicos e o hash do token é determinístico', () => {
    const t = gerarToken();
    expect(t).not.toBe(gerarToken());
    expect(hashToken(t)).toBe(hashToken(t));
    expect(hashToken(t)).not.toContain(t);
  });

  it('o cookie de sessão é HttpOnly e SameSite=Lax', () => {
    const c = cookieSessao('abc');
    expect(c).toContain('HttpOnly');
    expect(c).toContain('SameSite=Lax');
  });

  it('lê o cookie de sessão a partir do cabeçalho', () => {
    expect(lerCookie('outro=1; pc_sessao=abc123; x=y')).toBe('abc123');
    expect(lerCookie('outro=1')).toBeNull();
    expect(lerCookie(undefined)).toBeNull();
  });
});
