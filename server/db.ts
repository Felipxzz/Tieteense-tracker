import { Pool } from 'pg';

let pool: Pool | null = null;

/**
 * Pool de conexões com o PostgreSQL. Usa a variável DATABASE_URL.
 * Em serverless (Vercel) mantém poucas conexões por instância.
 */
export function getPool(): Pool {
  if (pool) return pool;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL não configurada. Veja o README, seção "Banco de dados".');
  }
  pool = new Pool({
    connectionString,
    max: 1,
    // Com SSL verificado por padrão (Neon exige). DATABASE_SSL=false só para banco local sem SSL.
    ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: true },
  });
  return pool;
}
