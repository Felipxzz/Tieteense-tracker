import { Moon, Sun } from 'lucide-react';
import { useTema } from '@/contexts/ThemeContext';
import { Button } from './ui';

export function ThemeToggle() {
  const { tema, alternarTema } = useTema();
  const escuro = tema === 'escuro';
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={alternarTema}
      aria-label={escuro ? 'Ativar tema claro' : 'Ativar tema escuro'}
      title={escuro ? 'Tema claro' : 'Tema escuro'}
    >
      {escuro ? <Sun key="sol" className="h-4 w-4 animate-pop" /> : <Moon key="lua" className="h-4 w-4 animate-pop" />}
      <span className="hidden sm:inline">{escuro ? 'Claro' : 'Escuro'}</span>
    </Button>
  );
}
