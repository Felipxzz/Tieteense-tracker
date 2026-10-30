import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Bus, Eye, EyeOff, LogIn } from 'lucide-react';
import { Button, Card, Input } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const { usuario, entrar } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destino = (location.state as { de?: string } | null)?.de ?? '/';

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  if (usuario) return <Navigate to={destino} replace />;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim() || !senha) {
      setErro('Preencha o e-mail e a senha.');
      return;
    }
    setErro(null);
    setEnviando(true);
    try {
      await entrar(email.trim(), senha);
      navigate(destino, { replace: true });
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Não foi possível entrar.');
      setSenha('');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-10">
      <div className="w-full max-w-sm animate-slide-up space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white shadow-soft">
            <Bus className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-ink">Entrar no Ponto Certo</h1>
            <p className="text-sm text-muted">Acesse para salvar suas linhas favoritas.</p>
          </div>
        </div>

        <Card className="p-6">
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-ink">
                E-mail
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@exemplo.com"
                disabled={enviando}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="senha" className="text-sm font-medium text-ink">
                Senha
              </label>
              <div className="relative">
                <Input
                  id="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="pr-10"
                  disabled={enviando}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  aria-pressed={mostrarSenha}
                  className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-muted hover:bg-brand-soft/50 hover:text-ink"
                >
                  {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {erro && (
              <p role="alert" className="animate-fade-in rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
                {erro}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={enviando}>
              <LogIn className="h-4 w-4" />
              {enviando ? 'Entrando…' : 'Entrar'}
            </Button>
          </form>
        </Card>

        <p className="text-center text-xs text-muted">
          Acesso apenas para contas cadastradas. Não há cadastro público nesta versão.
        </p>
      </div>
    </div>
  );
}
