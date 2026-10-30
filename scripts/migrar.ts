import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPool } from '../server/db';

const here = path.dirname(fileURLToPath(import.meta.url));
const schema = readFileSync(path.resolve(here, '../db/schema.sql'), 'utf8');

async function main() {
  const pool = getPool();
  try {
    await pool.query(schema);
    console.log('Migração aplicada com sucesso.');
  } finally {
    await pool.end();
  }
}

main().catch((err: unknown) => {
  console.error('Falha na migração:', err instanceof Error ? err.message : err);
  process.exit(1);
});
