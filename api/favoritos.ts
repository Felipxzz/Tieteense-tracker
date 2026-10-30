import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import linhasJson from '../src/data/linhas.json';
import { linhasArraySchema } from '../src/lib/validators';
import { getPool } from '../server/db';
import { exigirUsuario } from '../server/http';

const idsValidos = new Set(linhasArraySchema.parse(linhasJson).map((l) => l.id));
const corpo = z.object({ linhaId: z.string().min(1).max(100) });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const usuario = await exigirUsuario(req, res);
  if (!usuario) return;

  try {
    const pool = getPool();

    if (req.method === 'GET') {
      const { rows } = await pool.query<{ linha_id: string }>(
        'select linha_id from favoritos where usuario_id = $1 order by criado_em',
        [usuario.id],
      );
      return res.status(200).json({ favoritos: rows.map((r) => r.linha_id) });
    }

    if (req.method === 'POST') {
      const parsed = corpo.safeParse(req.body);
      if (!parsed.success || !idsValidos.has(parsed.data.linhaId)) {
        return res.status(400).json({ erro: 'Linha inválida.' });
      }
      await pool.query(
        'insert into favoritos (usuario_id, linha_id) values ($1, $2) on conflict do nothing',
        [usuario.id, parsed.data.linhaId],
      );
      return res.status(201).json({ ok: true });
    }

    if (req.method === 'DELETE') {
      const linhaId = typeof req.query.linhaId === 'string' ? req.query.linhaId : '';
      if (!linhaId) return res.status(400).json({ erro: 'Informe a linha.' });
      await pool.query('delete from favoritos where usuario_id = $1 and linha_id = $2', [usuario.id, linhaId]);
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', 'GET, POST, DELETE');
    return res.status(405).json({ erro: 'Método não permitido.' });
  } catch (err) {
    console.error('[favoritos]', err);
    return res.status(500).json({ erro: 'Erro ao acessar os favoritos.' });
  }
}
