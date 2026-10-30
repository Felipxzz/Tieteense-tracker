import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Usuario } from '../src/types';
import { usuarioDaSessao } from './sessao';
import { lerCookie } from './seguranca';

/**
 * Exige sessão válida. Se não houver, responde 401 e devolve null.
 * Uso: const usuario = await exigirUsuario(req, res); if (!usuario) return;
 */
export async function exigirUsuario(req: VercelRequest, res: VercelResponse): Promise<Usuario | null> {
  const token = lerCookie(req.headers.cookie);
  try {
    const usuario = token ? await usuarioDaSessao(token) : null;
    if (usuario) return usuario;
  } catch (err) {
    console.error('[sessao]', err);
    res.status(500).json({ erro: 'Erro ao verificar sua sessão. Tente novamente.' });
    return null;
  }
  res.status(401).json({ erro: 'Entre na sua conta para continuar.' });
  return null;
}
