import { useState } from 'react';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main style={{
        marginLeft: collapsed ? '70px' : '260px',
        flex: 1,
        minHeight: '100vh',
        padding: '32px 40px',
        background: '#0a0a0a',
        transition: 'margin-left 0.25s ease'
      }}>
        {children}
      </main>
    </div>
  );
}