import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>

      {/* Overlay móvil - cierra el menú al tocar fuera */}
      {isMobile && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 98 }}
        />
      )}

      {/* Botón hamburguesa móvil */}
      {isMobile && (
        <button
          onClick={() => setMobileOpen(prev => !prev)}
          style={{
            position: 'fixed', top: '16px', left: '16px', zIndex: 102,
            background: '#cc0000', border: 'none', color: '#fff',
            width: '40px', height: '40px', borderRadius: '6px',
            fontSize: '18px', cursor: 'pointer', lineHeight: 1
          }}>
          {mobileOpen ? '✕' : '☰'}
        </button>
      )}

      {/* Sidebar - solo visible en móvil cuando mobileOpen es true */}
      {(!isMobile || mobileOpen) && (
        <div style={{
          position: 'fixed', top: 0, left: 0, zIndex: 100, height: '100vh',
        }}>
          <Sidebar
            collapsed={isMobile ? false : collapsed}
            setCollapsed={isMobile ? () => {} : setCollapsed}
          />
        </div>
      )}

      {/* Contenido principal */}
      <main style={{
        marginLeft: isMobile ? '0' : (collapsed ? '70px' : '260px'),
        flex: 1,
        minHeight: '100vh',
        padding: isMobile ? '60px 16px 24px' : '32px 40px',
        background: '#0a0a0a',
        transition: 'margin-left 0.25s ease',
        width: '100%',
        boxSizing: 'border-box',
        overflowX: 'hidden'
      }}>
        {children}
      </main>
    </div>
  );
}