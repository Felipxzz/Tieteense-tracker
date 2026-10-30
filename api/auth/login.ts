import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { getPool } from '../../server/db';
import { cookieSessao, verificarSenha } from '../../server/seguranca';
import { criarSessao } from '../../server/sessao';

const entrada = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  senha: z.string().min(1).max(200),
});

type UsuarioComSenha = {
  id: number;
  email: string;
  nome: string;
  senha_hash: string;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ erro: 'Método não permitido.' });
  }

  const parsed = entrada.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ erro: 'Informe um e-mail válido e a senha.' });
  }

  try {
    const { rows } = await getPool().query<UsuarioComSenha>(
      'select id, email, nome, senha_hash from usuarios where email = $1',
      [parsed.data.email],
    );
    const usuario = rows[0] ?? null;
    const senhaOk = await verificarSenha(parsed.data.senha, usuario?.senha_hash ?? null);

    if (!usuario || !senhaOk) {
      // Mesma mensagem para e-mail inexistente e senha errada: não revela quais contas existem.
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
    }

    const token = await criarSessao(usuario.id);
    res.setHeader('Set-Cookie', cookieSessao(token));
    return res.status(200).json({ usuario: { id: usuario.id, email: usuario.email, nome: usuario.nome } });
  } catch (err) {
    console.error('[auth/login]', err);
    return res.status(500).json({ erro: 'Não foi possível entrar agora. Tente novamente.' });
  }
}
