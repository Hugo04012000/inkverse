import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../services/api';

function Estrellas({ n }) {
  return <span style={{ color: '#d4a017' }}>{'★'.repeat(n)}{'☆'.repeat(5 - n)}</span>;
}

export default function Perfil() {
  const { user } = useAuth();
  const [reseñas, setReseñas] = useState([]);
  const [portfolio, setPortfolio] = useState([1, 2, 3, 4, 5, 6]);

  return (
    <div>
      <div style={{ background: '#1a1a1a', borderRadius: '8px', padding: '32px', border: '1px solid #2a2a2a', marginBottom: '24px', position: 'relative' }}>
        <button style={{ position: 'absolute', top: '24px', right: '24px', background: '#cc0000', color: '#ffffff', fontWeight: 700, fontSize: '13px', padding: '10px 20px', borderRadius: '4px' }}>
          ✏ EDITAR PERFIL
        </button>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 700, color: '#ffffff', flexShrink: 0 }}>
            {user?.nombre?.charAt(0) || 'A'}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '4px', color: '#ffffff' }}>{user?.nombre?.toUpperCase()}</h1>
            <p style={{ color: '#666', marginBottom: '12px' }}>📍 {user?.ciudad || 'Sin ciudad'}</p>
            <p style={{ color: '#888', fontSize: '14px', marginBottom: '16px', maxWidth: '500px' }}>
              Artista de tatuaje profesional en INKVERSE.
            </p>
            <div style={{ display: 'flex', gap: '32px' }}>
              {[['0', 'Seguidores'], ['0', 'Siguiendo'], ['0', 'Reseñas']].map(([val, label]) => (
                <div key={label}>
                  <span style={{ color: '#d4a017', fontWeight: 700, fontSize: '20px' }}>{val}</span>
                  <span style={{ color: '#666', fontSize: '13px', marginLeft: '6px' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '16px', letterSpacing: '1px', color: '#ffffff' }}>PORTFOLIO</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {portfolio.map(i => (
              <div key={i} style={{ aspectRatio: '1', background: '#222', borderRadius: '6px', cursor: 'pointer', border: '1px solid #2a2a2a' }} />
            ))}
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '1px', color: '#ffffff' }}>RESEÑAS</h2>
            <span style={{ color: '#cc0000', fontSize: '13px', cursor: 'pointer' }}>+ AÑADIR</span>
          </div>
          <div style={{ background: '#1a1a1a', borderRadius: '8px', padding: '20px', border: '1px solid #2a2a2a', marginBottom: '12px', textAlign: 'center' }}>
            <div style={{ color: '#666', fontSize: '16px' }}>Sin reseñas todavía</div>
          </div>
          {reseñas.length === 0 && (
            <div style={{ color: '#666', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
              Cuando recibas reseñas aparecerán aquí.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}