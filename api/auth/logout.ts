import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cookieEncerrado, lerCookie } from '../../server/seguranca';
import { encerrarSessao } from '../../server/sessao';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ erro: 'Método não permitido.' });
  }
  try {
    const token = lerCookie(req.headers.cookie);
    if (token) await encerrarSessao(token);
  } catch (err) {
    console.error('[auth/logout]', err);
  }
  res.setHeader('Set-Cookie', cookieEncerrado());
  return res.status(200).json({ ok: true });
}
