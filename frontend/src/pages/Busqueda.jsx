import { useState, useEffect } from 'react';
import api from '../services/api';

const ciudades = ['Todas', 'Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao'];
const estilos = ['Todos', 'Japonés', 'Realismo', 'Blackwork', 'Watercolor', 'Neo-trad', 'Fineline'];

function Estrellas({ n }) {
  return <span style={{ color: '#d4a017' }}>{'★'.repeat(Math.floor(n))}</span>;
}

export default function Busqueda() {
  const [artistas, setArtistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [ciudad, setCiudad] = useState('Todas');
  const [estilo, setEstilo] = useState('Todos');

  useEffect(() => {
    cargarArtistas();
  }, [ciudad, estilo]);

  const cargarArtistas = async () => {
    try {
      const res = await api.get('/tatuadores', { params: { ciudad, estilo } });
      setArtistas(res.data);
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(false);
  };

  const filtrados = artistas.filter(a =>
    busqueda === '' || a.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <p style={{ color: '#666', fontSize: '12px', letterSpacing: '2px', marginBottom: '4px' }}>DIRECTORIO</p>
      <h1 style={{ fontSize: '48px', fontWeight: 900, marginBottom: '24px', color: '#ffffff' }}>BÚSQUEDA</h1>

      <div style={{ background: '#1a1a1a', borderRadius: '8px', padding: '16px 20px', marginBottom: '16px', border: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ color: '#666' }}>🔍</span>
        <input
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          placeholder="Buscar artistas..."
          style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '15px', flex: 1, outline: 'none' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '24px', background: '#1a1a1a', padding: '16px', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
        <div>
          <div style={{ color: '#666', fontSize: '11px', letterSpacing: '1px', marginBottom: '8px' }}>CIUDAD</div>
          <select value={ciudad} onChange={e => setCiudad(e.target.value)}
            style={{ width: '100%', background: '#111', border: '1px solid #333', borderRadius: '4px', padding: '10px', color: '#ffffff', fontSize: '14px' }}>
            {ciudades.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <div style={{ color: '#666', fontSize: '11px', letterSpacing: '1px', marginBottom: '8px' }}>ESTILO</div>
          <select value={estilo} onChange={e => setEstilo(e.target.value)}
            style={{ width: '100%', background: '#111', border: '1px solid #333', borderRadius: '4px', padding: '10px', color: '#ffffff', fontSize: '14px' }}>
            {estilos.map(e => <option key={e}>{e}</option>)}
          </select>
        </div>
        <div>
          <div style={{ color: '#666', fontSize: '11px', letterSpacing: '1px', marginBottom: '8px' }}>VALORACIÓN MÍNIMA</div>
          <input type="range" min="0" max="5" step="0.1" style={{ width: '100%', accentColor: '#cc0000' }} />
        </div>
        <div>
          <div style={{ color: '#666', fontSize: '11px', letterSpacing: '1px', marginBottom: '8px' }}>PRECIO MÁX</div>
          <input type="range" min="0" max="500" style={{ width: '100%', accentColor: '#cc0000' }} />
        </div>
      </div>

      <p style={{ color: '#666', fontSize: '13px', marginBottom: '16px' }}>{filtrados.length} artistas encontrados</p>

      {loading ? (
        <p style={{ color: '#666' }}>Cargando artistas...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {filtrados.map((a, i) => (
            <div key={i} style={{ background: '#1a1a1a', borderRadius: '8px', padding: '20px', border: '1px solid #2a2a2a' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#ffffff', fontSize: '16px' }}>
                  {a.nombre?.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: '#ffffff' }}>{a.nombre}</div>
                  <div style={{ color: '#666', fontSize: '12px' }}>📍 {a.ciudad}</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ background: '#333', color: '#ffffff', fontSize: '12px', padding: '4px 10px', borderRadius: '4px' }}>
                  {a.estilos?.[0] || 'Varios'}
                </span>
                <div>
                  <Estrellas n={Number(a.valoracion)} />
                  <span style={{ color: '#888', fontSize: '12px', marginLeft: '4px' }}>{a.valoracion}</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#d4a017', fontWeight: 700, fontSize: '18px' }}>{a.precio_hora}€/h</span>
                <button style={{ background: '#cc0000', color: '#ffffff', fontWeight: 700, fontSize: '13px', padding: '8px 16px', borderRadius: '4px' }}>
                  CONTACTAR
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}