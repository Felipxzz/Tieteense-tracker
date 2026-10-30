import { useEffect, useState, type ReactNode } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Bus, Home, Info, LogOut, Menu, MapPin, Route, Star, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui';
import { ThemeToggle } from './ThemeToggle';

const navItens = [
  { to: '/', label: 'Início', icon: Home, end: true },
  { to: '/linhas', label: 'Linhas e itinerários', icon: Route, end: false },
  { to: '/localizacao', label: 'Localização', icon: MapPin, end: false },
  { to: '/favoritos', label: 'Favoritos', icon: Star, end: false },
  { to: '/sobre', label: 'Sobre o projeto', icon: Info, end: false },
];

function Navegacao({ onNavegar }: { onNavegar?: () => void }) {
  return (
    <nav className="flex flex-col gap-1" aria-label="Navegação principal">
      {navItens.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavegar}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.97]',
              isActive ? 'bg-brand text-white shadow-soft' : 'text-muted hover:bg-brand-soft/50 hover:text-ink',
            )
          }
        >
          <Icon className="h-4 w-4" aria-hidden />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

function Marca() {
  return (
    <div className="flex items-center gap-2.5 px-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white">
        <Bus className="h-5 w-5" aria-hidden />
      </div>
      <div className="leading-tight">
        <p className="font-semibold text-ink">Ponto Certo</p>
        <p className="text-xs text-muted">Protótipo acadêmico</p>
      </div>
    </div>
  );
}

function BlocoUsuario() {
  const { usuario, sair } = useAuth();
  const navigate = useNavigate();
  const [saindo, setSaindo] = useState(false);

  if (!usuario) return null;

  async function onSair() {
    setSaindo(true);
    try {
      await sair();
    } catch {
      // Mesmo com falha de rede a sessão local é encerrada (ver AuthProvider).
    } finally {
      setSaindo(false);
      navigate('/login', { replace: true });
    }
  }

  return (
    <div className="rounded-xl bg-bg p-3 text-sm">
      <p className="truncate font-medium text-ink">{usuario.nome}</p>
      <p className="truncate text-xs text-muted">{usuario.email}</p>
      <Button variant="outline" size="sm" className="mt-3 w-full" onClick={onSair} disabled={saindo}>
        <LogOut className="h-4 w-4" /> {saindo ? 'Saindo…' : 'Sair'}
      </Button>
    </div>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const location = useLocation();

  // Fecha o menu ao mudar de página e com a tecla Esc.
  useEffect(() => setMenuAberto(false), [location.pathname]);
  useEffect(() => {
    if (!menuAberto) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuAberto(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuAberto]);

  return (
    <div className="min-h-screen bg-bg text-ink">
      {/* Barra superior (mobile) */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/90 px-4 py-3 backdrop-blur lg:hidden">
        <Marca />
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuAberto(true)}
            aria-label="Abrir menu"
            aria-expanded={menuAberto}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-ink hover:bg-brand-soft/50"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Menu lateral mobile */}
      {menuAberto && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setMenuAberto(false)}
            className="absolute inset-0 animate-fade-in bg-ink/40"
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 max-w-[85%] animate-slide-in-left flex-col gap-6 bg-card p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <Marca />
              <button
                type="button"
                onClick={() => setMenuAberto(false)}
                aria-label="Fechar menu"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-ink hover:bg-brand-soft/50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Navegacao onNavegar={() => setMenuAberto(false)} />
            <BlocoUsuario />
          </aside>
        </div>
      )}

      {/* Menu lateral desktop */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col gap-8 border-r border-border bg-card p-5 lg:flex">
        <Marca />
        <Navegacao />
        <div className="mt-auto flex flex-col gap-3">
          <BlocoUsuario />
          <ThemeToggle />
        </div>
      </aside>

      <main className="px-4 py-6 sm:px-6 lg:ml-64 lg:px-10 lg:py-10">
        <div key={location.pathname} className="mx-auto max-w-5xl animate-slide-up space-y-6">{children}</div>
      </main>
    </div>
  );
}
