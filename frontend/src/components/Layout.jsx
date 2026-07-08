import { useState } from 'react';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = window.innerWidth < 768;

  return (
    <div style={{ display: 'flex' }}>
      {/* Overlay móvil */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 99 }}
        />
      )}

      {/* Botón hamburguesa móvil */}
      {isMobile && (
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            position: 'fixed', top: '16px', left: '16px', zIndex: 101,
            background: '#cc0000', border: 'none', color: '#fff',
            width: '40px', height: '40px', borderRadius: '6px',
            fontSize: '18px', cursor: 'pointer'
          }}>
          ☰
        </button>
      )}

      <div style={{
        position: 'fixed', top: 0, left: 0, zIndex: 100,
        transform: isMobile ? (mobileOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
        transition: 'transform 0.25s ease'
      }}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <main style={{
        marginLeft: isMobile ? '0' : (collapsed ? '70px' : '260px'),
        flex: 1,
        minHeight: '100vh',
        padding: isMobile ? '64px 16px 24px' : '32px 40px',
        background: '#0a0a0a',
        transition: 'margin-left 0.25s ease',
        width: '100%',
        overflowX: 'hidden'
      }}>
        {children}
      </main>
    </div>
  );
}