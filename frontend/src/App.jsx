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
import PostDetalle from './pages/PostDetalle';

function ModalRegistro() {
  const { mostrarRegistro, setMostrarRegistro, logoutUser } = useAuth();
  if (!mostrarRegistro) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '20px' }}>
      <div style={{ background: '#1a1a1a', borderRadius: '8px', padding: '40px 32px', width: '100%', maxWidth: '480px', textAlign: 'center', borderTop: '3px solid #cc0000' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⭐</div>
        <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff', marginBottom: '12px' }}>
          Te ha gustado INKVERSE?
        </h2>
        <p style={{ color: '#888', fontSize: '15px', marginBottom: '8px', lineHeight: 1.6 }}>
          Tu demo de 5 minutos ha terminado. Registrate gratis para acceder a todas las funcionalidades sin limite de tiempo.
        </p>
        <p style={{ color: '#d4a017', fontSize: '13px', marginBottom: '32px' }}>
          Sin tarjeta de credito. Sin compromiso.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => { logoutUser(); window.location.href = '/'; }}
            style={{ background: '#cc0000', color: '#fff', fontWeight: 700, fontSize: '15px', padding: '14px', borderRadius: '4px', cursor: 'pointer', border: 'none' }}>
            CREAR CUENTA GRATIS
          </button>
          <button
            onClick={() => { logoutUser(); window.location.href = '/'; }}
            style={{ background: 'transparent', color: '#666', fontSize: '14px', padding: '10px', borderRadius: '4px', cursor: 'pointer', border: '1px solid #333' }}>
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}

function RutaProtegida({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ color: '#fff', padding: '40px' }}>Cargando...</div>;
  if (!user) return <Navigate to="/" />;
  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  return (
    <>
      <ModalRegistro />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/panel" element={<RutaProtegida><Panel /></RutaProtegida>} />
        <Route path="/citas" element={<RutaProtegida><Citas /></RutaProtegida>} />
        <Route path="/disenos" element={<RutaProtegida><Disenos /></RutaProtegida>} />
        <Route path="/foro" element={<RutaProtegida><Foro /></RutaProtegida>} />
        <Route path="/foro/:id" element={<RutaProtegida><PostDetalle /></RutaProtegida>} />
        <Route path="/herramientas" element={<RutaProtegida><Herramientas /></RutaProtegida>} />
        <Route path="/eventos" element={<RutaProtegida><Eventos /></RutaProtegida>} />
        <Route path="/competiciones" element={<RutaProtegida><Competiciones /></RutaProtegida>} />
        <Route path="/marcas" element={<RutaProtegida><Marcas /></RutaProtegida>} />
        <Route path="/busqueda" element={<RutaProtegida><Busqueda /></RutaProtegida>} />
        <Route path="/admin" element={<RutaProtegida><Admin /></RutaProtegida>} />
        <Route path="/perfil" element={<RutaProtegida><Perfil /></RutaProtegida>} />
      </Routes>
    </>
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