import { useState, useEffect } from 'react';
import api from '../services/api';

const colorNivel = { Básico: '#22c55e', Avanzado: '#f97316' };

export default function Herramientas() {
  const [articulos, setArticulos] = useState([]);
  const [nivel, setNivel] = useState('Básico');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/herramientas', { params: { nivel } }).then(res => {
      setArticulos(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [nivel]);

  return (
    <div>
      <p style={{ color: '#666', fontSize: '12px', letterSpacing: '2px', marginBottom: '4px' }}>CONOCIMIENTO</p>
      <h1 style={{ fontSize: '48px', fontWeight: 900, marginBottom: '24px', color: '#ffffff' }}>HERRAMIENTAS</h1>

      <div style={{ display: 'flex', marginBottom: '32px', borderRadius: '4px', overflow: 'hidden', width: 'fit-content' }}>
        {['Básico', 'Avanzado'].map(n => (
          <button key={n} onClick={() => setNivel(n)} style={{
            padding: '12px 32px', fontWeight: 700, fontSize: '13px', letterSpacing: '1px',
            background: nivel === n ? '#cc0000' : '#1a1a1a',
            color: '#ffffff', border: '1px solid #333', cursor: 'pointer'
          }}>
            {n === 'Básico' ? 'CONOCIMIENTOS BÁSICOS' : 'NIVEL AVANZADO'}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: '#666' }}>Cargando artículos...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          {articulos.map((a, i) => (
            <div key={i} style={{ background: '#1a1a1a', borderRadius: '8px', overflow: 'hidden', border: '1px solid #2a2a2a', cursor: 'pointer' }}>
              <div style={{ height: '160px', background: '#222' }} />
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ background: colorNivel[a.nivel], color: '#ffffff', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '3px' }}>{a.nivel}</span>
                  <span style={{ color: '#666', fontSize: '12px' }}>{a.categoria}</span>
                  <span style={{ color: '#666', fontSize: '12px', marginLeft: 'auto' }}>⏱ {a.tiempo} min</span>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '8px', color: '#ffffff' }}>{a.titulo}</h3>
                <p style={{ color: '#666', fontSize: '13px', marginBottom: '12px', lineHeight: 1.5 }}>{a.descripcion}</p>
                <span style={{ color: '#cc0000', fontSize: '13px', fontWeight: 600 }}>LEER ARTÍCULO →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}