import { Card } from '@/components/ui';

const equipe = [
  'Vanessa Laveli',
  'João Pedro R. Reis',
  'Rayane Nunes Rosario',
  'Felipe Gustavo Paes A. Silva',
  'Lidia Catelar Wagner (orientadora)',
];

export default function Sobre() {
  return (
    <>
      <header className="space-y-2">
        <p className="text-sm font-medium text-brand">Curso Técnico em Administração · Mostra URE-Itu 2026</p>
        <h1 className="text-2xl font-semibold tracking-tight">Sobre o Ponto Certo</h1>
        <p className="max-w-2xl text-muted">
          Gestão da informação e mobilidade urbana: um aplicativo para facilitar o acesso a horários, itinerários e
          pontos de ônibus.
        </p>
      </header>

      <Card className="space-y-3">
        <h2 className="font-semibold">O problema</h2>
        <p className="text-sm leading-relaxed text-muted">
          Muitas pessoas têm dificuldade para encontrar informações sobre os ônibus: horários, rotas e localização. A
          falta dessas informações pode causar atrasos, aumentar o tempo de espera nos pontos e dificultar o embarque.
        </p>
        <p className="text-sm font-medium">Pergunta do projeto</p>
        <p className="text-sm leading-relaxed text-muted">
          Como o planejamento e a gestão de um serviço digital de informações sobre o transporte público podem facilitar
          o acesso a horários, itinerários e pontos de ônibus?
        </p>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="space-y-3">
          <h2 className="font-semibold">Objetivo geral</h2>
          <p className="text-sm leading-relaxed text-muted">
            Propor um aplicativo que facilite o acesso às informações do transporte público, reunindo horários, rotas e
            localização dos ônibus.
          </p>
        </Card>
        <Card className="space-y-3">
          <h2 className="font-semibold">Objetivos específicos</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
            <li>Identificar as dificuldades dos usuários.</li>
            <li>Reunir informações oficiais de horários e itinerários.</li>
            <li>Criar interfaces simples e fáceis de entender.</li>
            <li>Conhecer a opinião do público por meio de questionário.</li>
          </ul>
        </Card>
      </div>

      <Card className="space-y-3">
        <h2 className="font-semibold">Metodologia</h2>
        <p className="text-sm leading-relaxed text-muted">
          Pesquisa aplicada e exploratória, com levantamento bibliográfico e questionário de percepção com potenciais
          usuários do transporte público. O plano de implantação usa o Business Model Canvas, a Análise SWOT e o 5W2H.
          O protótipo segue o conceito de MVP, com foco na experiência do usuário.
        </p>
      </Card>

      <Card className="space-y-3">
        <h2 className="font-semibold">Estado atual</h2>
        <p className="text-sm leading-relaxed text-muted">
          O protótipo mostra os horários e o itinerário oficiais da EMTU para a linha 6109, que atende Tietê (SP). Há
          login e favoritos salvos em banco de dados. A localização em tempo real ainda não foi implementada: depende de
          uma fonte de dados autorizada, que não está disponível nesta versão.
        </p>
      </Card>

      <Card className="space-y-3">
        <h2 className="font-semibold">Equipe</h2>
        <ul className="grid gap-1 text-sm text-muted sm:grid-cols-2">
          {equipe.map((nome) => (
            <li key={nome}>{nome}</li>
          ))}
        </ul>
      </Card>

      <Card className="space-y-2">
        <h2 className="font-semibold">Referências</h2>
        <ul className="space-y-1 text-xs leading-relaxed text-muted">
          <li>CHIAVENATO, Idalberto; SAPIRO, Arão. Planejamento estratégico: fundamentos e aplicações. Elsevier, 2003.</li>
          <li>GARRETT, Jesse James. The elements of user experience. 2. ed. New Riders, 2011.</li>
          <li>MARCONI, Marina de Andrade; LAKATOS, Eva Maria. Fundamentos de metodologia científica. 5. ed. Atlas, 2003.</li>
          <li>OSTERWALDER, Alexander; PIGNEUR, Yves. Business model generation. Alta Books, 2011.</li>
          <li>RIES, Eric. A startup enxuta. Lua de Papel, 2012.</li>
        </ul>
      </Card>
    </>
  );
}
