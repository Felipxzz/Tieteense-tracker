import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Tema = 'claro' | 'escuro';

interface ThemeContextValue {
  tema: Tema;
  alternarTema: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const CHAVE = 'pontocerto:tema';

function temaInicial(): Tema {
  try {
    const salvo = localStorage.getItem(CHAVE);
    if (salvo === 'claro' || salvo === 'escuro') return salvo;
  } catch {
    // localStorage indisponível (modo privado, por exemplo): usa a preferência do sistema.
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>(temaInicial);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', tema === 'escuro');
    try {
      localStorage.setItem(CHAVE, tema);
    } catch {
      // ignora falha de persistência
    }
  }, [tema]);

  const alternarTema = () => setTema((t) => (t === 'claro' ? 'escuro' : 'claro'));

  return <ThemeContext.Provider value={{ tema, alternarTema }}>{children}</ThemeContext.Provider>;
}

export function useTema(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTema deve ser usado dentro de ThemeProvider');
  return ctx;
}
