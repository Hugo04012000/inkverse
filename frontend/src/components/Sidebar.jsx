import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, Palette, MessageSquare, Wrench, Mic, Trophy, Tag, Search, Shield, User, Bell, LogOut, X, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const navItems = [
  { to: '/panel', icon: Home, label: 'Panel' },
  { to: '/citas', icon: Calendar, label: 'Citas' },
  { to: '/disenos', icon: Palette, label: 'Disenos' },
  { to: '/foro', icon: MessageSquare, label: 'Foro' },
  { to: '/herramientas', icon: Wrench, label: 'Herramientas' },
  { to: '/eventos', icon: Mic, label: 'Eventos' },
  { to: '/competiciones', icon: Trophy, label: 'Competiciones' },
  { to: '/marcas', icon: Tag, label: 'Marcas' },
  { to: '/busqueda', icon: Search, label: 'Busqueda' },
  { to: '/admin', icon: Shield, label: 'Admin' },
  { to: '/perfil', icon: User, label: 'Mi Perfil' },
];

const iconoTipo = { cita: '📅', diseno: '🎨', foro: '💬', evento: '🎤' };

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();
  const [notificaciones, setNotificaciones] = useState([]);
  const [mostrarNotif, setMostrarNotif] = useState(false);

  useEffect(() => {
    cargarNotificaciones();
  }, []);

  const cargarNotificaciones = async () => {
    try {
      const res = await api.get('/notificaciones');
      setNotificaciones(res.data);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const marcarLeidas = async () => {
    try {
      await api.put('/notificaciones/leer');
      cargarNotificaciones();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const noLeidas = notificaciones.filter(n => !n.leida).length;

  return (
    <>
      <aside style={{
        width: collapsed ? '70px' : '260px',
        minHeight: '100vh',
        background: '#111',
        borderRight: '1px solid #1f1f1f',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s ease',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #1f1f1f',
          display: 'flex',
          justifyContent: collapsed ? 'center' : 'space-between',
          alignItems: 'center',
          gap: '8px'
        }}>
          {!collapsed && (
            <span style={{ color: '#cc0000', fontWeight: 900, fontSize: '22px', letterSpacing: '2px' }}>INKVERSE</span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: '4px', flexShrink: 0 }}>
            <Menu size={20} />
          </button>
        </div>

        <nav style={{ flex: 1, padding: '16px 0', overflowY: 'auto', overflowX: 'hidden' }}>
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to} title={label} style={{
                display: 'flex',
                alignItems: 'center',
                gap: collapsed ? '0' : '12px',
                padding: '10px 20px',
                textDecoration: 'none',
                color: active ? '#fff' : '#888',
                background: active ? 'rgba(204,0,0,0.15)' : 'transparent',
                borderLeft: active ? '3px solid #cc0000' : '3px solid transparent',
                transition: 'all 0.15s',
                justifyContent: collapsed ? 'center' : 'flex-start'
              }}>
                <Icon size={18} style={{ flexShrink: 0 }} />
                {!collapsed && (
                  <span style={{ fontSize: '14px', fontWeight: active ? 600 : 400, whiteSpace: 'nowrap' }}>{label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div style={{ borderTop: '1px solid #1f1f1f', padding: '16px 20px' }}>
          <div
            onClick={() => setMostrarNotif(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '12px',
              cursor: 'pointer',
              color: '#888',
              justifyContent: collapsed ? 'center' : 'flex-start'
            }}>
            <Bell size={18} style={{ flexShrink: 0 }} />
            {!collapsed && <span style={{ fontSize: '14px', color: '#ffffff' }}>Notificaciones</span>}
            {noLeidas > 0 && (
              <span style={{
                marginLeft: collapsed ? '0' : 'auto',
                background: '#cc0000',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                color: '#fff',
                fontWeight: 700,
                flexShrink: 0
              }}>
                {noLeidas}
              </span>
            )}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            justifyContent: collapsed ? 'center' : 'flex-start'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              flexShrink: 0
            }}>
              {user?.nombre?.charAt(0) || 'U'}
            </div>
            {!collapsed && (
              <>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap' }}>{user?.nombre || 'Usuario'}</div>
                  <div style={{ fontSize: '11px', color: '#666' }}>{user?.ciudad || ''}</div>
                </div>
                <LogOut size={16} onClick={handleLogout} style={{ marginLeft: 'auto', color: '#666', cursor: 'pointer', flexShrink: 0 }} />
              </>
            )}
          </div>
          {!collapsed && (
            <div style={{ marginTop: '8px', borderTop: '1px solid #111', paddingTop: '8px' }}>
              <p style={{ color: '#333', fontSize: '10px' }}>2026 INKVERSE</p>
            </div>
          )}
        </div>
      </aside>

      {mostrarNotif && (
        <div style={{ position: 'fixed', top: 0, right: 0, width: '380px', height: '100vh', background: '#111', borderLeft: '1px solid #2a2a2a', zIndex: 200, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #2a2a2a' }}>
            <h3 style={{ fontWeight: 700, fontSize: '16px', color: '#ffffff' }}>NOTIFICACIONES</h3>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <span onClick={marcarLeidas} style={{ color: '#888', fontSize: '12px', cursor: 'pointer' }}>Marcar leidas</span>
              <X size={18} onClick={() => setMostrarNotif(false)} style={{ color: '#666', cursor: 'pointer' }} />
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {notificaciones.length === 0 ? (
              <p style={{ color: '#666', padding: '24px', textAlign: 'center' }}>No hay notificaciones</p>
            ) : (
              notificaciones.map((n, i) => (
                <div key={i} style={{ padding: '16px 24px', borderBottom: '1px solid #1f1f1f', background: n.leida ? 'transparent' : 'rgba(204,0,0,0.05)', position: 'relative' }}>
                  {!n.leida && <div style={{ position: 'absolute', top: '20px', right: '24px', width: '8px', height: '8px', background: '#cc0000', borderRadius: '50%' }} />}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '20px' }}>{iconoTipo[n.tipo] || 'bell'}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px', color: '#ffffff', marginBottom: '4px' }}>{n.titulo}</div>
                      <div style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>{n.mensaje}</div>
                      <div style={{ color: '#444', fontSize: '11px' }}>{new Date(n.fecha).toLocaleDateString('es-ES')}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}