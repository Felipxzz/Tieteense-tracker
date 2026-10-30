import { createHash, randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';

const KEYLEN = 64;
export const NOME_COOKIE = 'pc_sessao';
const DURACAO_SESSAO_S = 60 * 60 * 24 * 7; // 7 dias

function scrypt(senha: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCb(senha, salt, KEYLEN, (err, chave) => (err ? reject(err) : resolve(chave)));
  });
}

/** Gera o hash da senha no formato scrypt$<salt-hex>$<hash-hex>. */
export async function hashSenha(senha: string): Promise<string> {
  const salt = randomBytes(16);
  const chave = await scrypt(senha, salt);
  return `scrypt$${salt.toString('hex')}$${chave.toString('hex')}`;
}

/**
 * Confere a senha. Executa o scrypt mesmo quando não há hash armazenado,
 * para que o tempo de resposta não revele se o e-mail existe.
 */
export async function verificarSenha(senha: string, armazenado: string | null): Promise<boolean> {
  const partes = armazenado?.split('$');
  if (!partes || partes.length !== 3 || partes[0] !== 'scrypt') {
    await scrypt(senha, Buffer.alloc(16));
    return false;
  }
  const salt = Buffer.from(partes[1], 'hex');
  const esperado = Buffer.from(partes[2], 'hex');
  const calculado = await scrypt(senha, salt);
  return esperado.length === calculado.length && timingSafeEqual(esperado, calculado);
}

/** Token aleatório de 256 bits, enviado ao navegador dentro de cookie HttpOnly. */
export function gerarToken(): string {
  return randomBytes(32).toString('base64url');
}

/** No banco guardamos só o hash do token: um vazamento do banco não entrega sessões ativas. */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function serializarCookie(valor: string, maxAge: number): string {
  const partes = [`${NOME_COOKIE}=${valor}`, 'Path=/', 'HttpOnly', 'SameSite=Lax', `Max-Age=${maxAge}`];
  if (process.env.NODE_ENV === 'production') partes.push('Secure');
  return partes.join('; ');
}

export function cookieSessao(token: string): string {
  return serializarCookie(token, DURACAO_SESSAO_S);
}

export function cookieEncerrado(): string {
  return serializarCookie('', 0);
}

export function lerCookie(cabecalho: string | undefined, nome = NOME_COOKIE): string | null {
  if (!cabecalho) return null;
  for (const par of cabecalho.split(';')) {
    const indice = par.indexOf('=');
    if (indice < 0) continue;
    if (par.slice(0, indice).trim() === nome) {
      return decodeURIComponent(par.slice(indice + 1).trim());
    }
  }
  return null;
}
