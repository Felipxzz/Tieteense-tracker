import { getPool } from '../server/db';
import { hashSenha } from '../server/seguranca';

// Uso (a senha vai por variável de ambiente, para não ficar no histórico do shell):
//   SENHA='uma-senha-forte' npm run criar-usuario -- --email ana@exemplo.com --nome "Ana"

function argumento(nome: string): string | undefined {
  const i = process.argv.indexOf(`--${nome}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main() {
  const email = argumento('email')?.trim().toLowerCase();
  const nome = argumento('nome')?.trim();
  const senha = process.env.SENHA;

  if (!email || !nome || !senha) {
    console.error('Uso: SENHA=... npm run criar-usuario -- --email <e-mail> --nome "<nome>"');
    process.exit(1);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error('E-mail inválido.');
    process.exit(1);
  }
  if (senha.length < 8) {
    console.error('A senha deve ter pelo menos 8 caracteres.');
    process.exit(1);
  }

  const pool = getPool();
  try {
    const hash = await hashSenha(senha);
    await pool.query('insert into usuarios (email, nome, senha_hash) values ($1, $2, $3)', [email, nome, hash]);
    console.log(`Usuário ${email} criado.`);
  } catch (err) {
    const codigo = (err as { code?: string }).code;
    console.error(codigo === '23505' ? 'Já existe um usuário com este e-mail.' : 'Falha ao criar usuário.');
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
