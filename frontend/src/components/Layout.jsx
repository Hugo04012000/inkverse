import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>

      {/* Overlay móvil */}
      {isMobile && mobileOpen && (
        <div onClick={() => setMobileOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 99 }} />
      )}

      {/* Botón hamburguesa móvil */}
      {isMobile && (
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{
          position: 'fixed', top: '16px', left: '16px', zIndex: 101,
          background: '#cc0000', border: 'none', color: '#fff',
          width: '40px', height: '40px', borderRadius: '6px',
          fontSize: '18px', cursor: 'pointer'
        }}>☰</button>
      )}

      {/* Sidebar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, zIndex: 100, height: '100vh',
        transform: isMobile ? (mobileOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
        transition: 'transform 0.25s ease'
      }}>
        <Sidebar
          collapsed={isMobile ? false : collapsed}
          setCollapsed={isMobile ? () => {} : setCollapsed}
        />
      </div>

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