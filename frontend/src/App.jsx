import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Panel from './pages/Panel';
import Citas from './pages/Citas';
import Disenos from './pages/Disenos';
import Foro from './pages/Foro';
import Herramientas from './pages/Herramientas';
import Eventos from './pages/Eventos';
import Competiciones from './pages/Competiciones';
import Marcas from './pages/Marcas';
import Busqueda from './pages/Busqueda';
import Admin from './pages/Admin';
import Perfil from './pages/Perfil';

function RutaProtegida({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ color: '#fff', padding: '40px' }}>Cargando...</div>;
  if (!user) return <Navigate to="/" />;
  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/panel" element={<RutaProtegida><Panel /></RutaProtegida>} />
      <Route path="/citas" element={<RutaProtegida><Citas /></RutaProtegida>} />
      <Route path="/disenos" element={<RutaProtegida><Disenos /></RutaProtegida>} />
      <Route path="/foro" element={<RutaProtegida><Foro /></RutaProtegida>} />
      <Route path="/herramientas" element={<RutaProtegida><Herramientas /></RutaProtegida>} />
      <Route path="/eventos" element={<RutaProtegida><Eventos /></RutaProtegida>} />
      <Route path="/competiciones" element={<RutaProtegida><Competiciones /></RutaProtegida>} />
      <Route path="/marcas" element={<RutaProtegida><Marcas /></RutaProtegida>} />
      <Route path="/busqueda" element={<RutaProtegida><Busqueda /></RutaProtegida>} />
      <Route path="/admin" element={<RutaProtegida><Admin /></RutaProtegida>} />
      <Route path="/perfil" element={<RutaProtegida><Perfil /></RutaProtegida>} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}