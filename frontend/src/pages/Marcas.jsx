import { useState, useEffect } from 'react';
import api from '../services/api';

const categorias = ['Todas', 'Tintas', 'Maquinas', 'Accesorios', 'Cuidado'];

function Estrellas({ n }) {
  return (
    <span style={{ color: '#d4a017' }}>
      {'★'.repeat(Math.floor(n))}{'☆'.repeat(5 - Math.floor(n))}
      <span style={{ color: '#888', fontSize: '12px', marginLeft: '4px' }}>{n}</span>
    </span>
  );
}

export default function Marcas() {
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catActiva, setCatActiva] = useState('Todas');

  useEffect(function() {
    api.get('/marcas').then(function(res) {
      setMarcas(res.data);
      setLoading(false);
    }).catch(function() {
      setLoading(false);
    });
  }, []);

  var filtradas = catActiva === 'Todas'
    ? marcas
    : marcas.filter(function(m) { return m.categoria === catActiva; });

  function irAMarca(url) {
    if (url) window.open(url, '_blank');
  }

  return (
    <div>
      <h1 style={{ fontSize: '48px', fontWeight: 900, marginBottom: '24px', color: '#ffffff' }}>MARCAS</h1>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {categorias.map(function(cat) {
          return (
            <button key={cat} onClick={function() { setCatActiva(cat); }} style={{
              padding: '8px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: 600,
              background: catActiva === cat ? '#cc0000' : 'transparent',
              color: catActiva === cat ? '#ffffff' : '#888',
              border: catActiva === cat ? 'none' : '1px solid #333', cursor: 'pointer'
            }}>{cat}</button>
          );
        })}
      </div>

      {loading ? (
        <p style={{ color: '#666' }}>Cargando marcas...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {filtradas.map(function(m, i) {
            return (
              <div
                key={i}
                onClick={function() { irAMarca(m.url_oficial); }}
                style={{ background: '#1a1a1a', borderRadius: '8px', padding: '20px', border: '1px solid #2a2a2a', display: 'flex', gap: '16px', cursor: m.url_oficial ? 'pointer' : 'default', transition: 'border-color 0.15s' }}>
                <div style={{ width: '60px', height: '60px', background: '#333', borderRadius: '8px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 900, color: '#cc0000' }}>
                  {m.nombre.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '16px', color: '#ffffff' }}>{m.nombre}</h3>
                    <Estrellas n={Number(m.valoracion)} />
                  </div>
                  <div style={{ color: '#666', fontSize: '11px', letterSpacing: '1px', marginBottom: '8px' }}>{m.categoria ? m.categoria.toUpperCase() : ''}</div>
                  <p style={{ color: '#888', fontSize: '13px', marginBottom: '12px', lineHeight: 1.5 }}>{m.descripcion}</p>
                  {m.oferta && (
                    <div style={{ background: '#2a2000', border: '1px solid #d4a01733', borderRadius: '4px', padding: '8px 12px', color: '#d4a017', fontSize: '13px' }}>
                      🏷 {m.oferta}
                    </div>
                  )}
                  {m.url_oficial && (
                    <div style={{ marginTop: '8px', color: '#cc0000', fontSize: '12px' }}>
                      Ver web oficial →
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}