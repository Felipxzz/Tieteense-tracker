export class ErroApi extends Error {
  status: number;

  constructor(mensagem: string, status: number) {
    super(mensagem);
    this.name = 'ErroApi';
    this.status = status;
  }
}

/** Chamada à API do próprio site (rotas /api). Envia o cookie de sessão automaticamente. */
export async function apiFetch<T>(caminho: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  if (init.body) headers.set('Content-Type', 'application/json');

  let resposta: Response;
  try {
    resposta = await fetch(caminho, { ...init, headers, credentials: 'same-origin' });
  } catch {
    throw new ErroApi('Sem conexão com o servidor. Verifique sua internet.', 0);
  }

  const texto = await resposta.text();
  let dados: unknown = null;
  try {
    dados = texto ? JSON.parse(texto) : null;
  } catch {
    dados = null;
  }

  if (!resposta.ok) {
    if (resposta.status === 404 && dados === null) {
      throw new ErroApi('API indisponível. Em desenvolvimento, use "npm run dev:vercel".', 404);
    }
    const erro = (dados as { erro?: string } | null)?.erro;
    throw new ErroApi(erro ?? 'Erro inesperado. Tente novamente.', resposta.status);
  }

  return dados as T;
}
