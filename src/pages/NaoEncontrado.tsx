import { Link } from 'react-router-dom';
import { Card, botaoClasses } from '@/components/ui';

export default function NaoEncontrado() {
  return (
    <Card className="space-y-4 text-center">
      <p className="text-4xl font-semibold text-brand">404</p>
      <p className="font-semibold">Página não encontrada</p>
      <Link to="/" className={botaoClasses('outline')}>
        Voltar ao início
      </Link>
    </Card>
  );
}
