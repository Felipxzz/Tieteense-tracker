import type { ReactNode } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { RotaProtegida } from '@/components/RotaProtegida';
import Favoritos from '@/pages/Favoritos';
import Inicio from '@/pages/Inicio';
import Linhas from '@/pages/Linhas';
import LinhaDetalhe from '@/pages/LinhaDetalhe';
import Localizacao from '@/pages/Localizacao';
import Login from '@/pages/Login';
import NaoEncontrado from '@/pages/NaoEncontrado';
import Sobre from '@/pages/Sobre';

/** Páginas internas: exigem login e usam o layout com menu. */
function Protegida({ children }: { children: ReactNode }) {
  return (
    <RotaProtegida>
      <Layout>{children}</Layout>
    </RotaProtegida>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Protegida><Inicio /></Protegida>} />
      <Route path="/linhas" element={<Protegida><Linhas /></Protegida>} />
      <Route path="/linhas/:id" element={<Protegida><LinhaDetalhe /></Protegida>} />
      <Route path="/localizacao" element={<Protegida><Localizacao /></Protegida>} />
      <Route path="/favoritos" element={<Protegida><Favoritos /></Protegida>} />
      <Route path="/sobre" element={<Protegida><Sobre /></Protegida>} />
      <Route path="*" element={<Protegida><NaoEncontrado /></Protegida>} />
    </Routes>
  );
}
