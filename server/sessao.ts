import type { Usuario } from '../src/types';
import { getPool } from './db';
import { gerarToken, hashToken } from './seguranca';

const DURACAO_DIAS = 7;

export async function criarSessao(usuarioId: number): Promise<string> {
  const token = gerarToken();
  const expiraEm = new Date(Date.now() + DURACAO_DIAS * 24 * 60 * 60 * 1000);
  await getPool().query('insert into sessoes (token_hash, usuario_id, expira_em) values ($1, $2, $3)', [
    hashToken(token),
    usuarioId,
    expiraEm,
  ]);
  return token;
}

export async function usuarioDaSessao(token: string): Promise<Usuario | null> {
  const { rows } = await getPool().query<{ id: number; email: string; nome: string }>(
    `select u.id, u.email, u.nome
       from sessoes s
       join usuarios u on u.id = s.usuario_id
      where s.token_hash = $1 and s.expira_em > now()`,
    [hashToken(token)],
  );
  return rows[0] ?? null;
}

export async function encerrarSessao(token: string): Promise<void> {
  await getPool().query('delete from sessoes where token_hash = $1', [hashToken(token)]);
}
