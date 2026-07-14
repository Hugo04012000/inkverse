import { useState, useEffect } from 'react';
import api from '../services/api';

const filtros = ['Todos', 'Blackwork', 'Realismo', 'Japonés', 'Neo-tradicional', 'Tradicional', 'Watercolor', 'Geometric', 'Fineline', 'Mandala', 'Floral', 'Tribal', 'Lettering', 'Biomecánico', 'Cover-up', 'Minimalista', 'Puntillismo', 'Surrealista', 'Anime', 'Celtíco'];
export default function Disenos() {
  const [disenos, setDisenos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroActivo, setFiltroActivo] = useState('Todos');
  const [nuevoDiseno, setNuevoDiseno] = useState(false);
  const [form, setForm] = useState({ titulo: '', estilo: 'Geometric', imagen_url: '' });

  useEffect(() => {
    cargarDisenos();
  }, [filtroActivo]);

  const cargarDisenos = async () => {
    setLoading(true);
    try {
      const res = await api.get('/disenos', {
        params: { estilo: filtroActivo }
      });
      setDisenos(res.data);
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(false);
  };

  const darLike = async (id) => {
    try {
      await api.put(`/disenos/${id}/like`);
      cargarDisenos();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const subirDiseno = async () => {
    try {
      await api.post('/disenos', form);
      setNuevoDiseno(false);
      setForm({ titulo: '', estilo: 'Geometric', imagen_url: '' });
      cargarDisenos();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <p style={{ color: '#666', fontSize: '12px', letterSpacing: '2px', marginBottom: '4px' }}>COMUNIDAD</p>
          <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#ffffff' }}>DISEÑOS</h1>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ background: '#1a1a1a', color: '#ffffff', padding: '10px 20px', borderRadius: '4px', border: '1px solid #333', fontSize: '13px', fontWeight: 600 }}>
            🖼 Canvas
          </button>
          <button onClick={() => setNuevoDiseno(true)} style={{ background: '#cc0000', color: '#ffffff', padding: '10px 20px', borderRadius: '4px', fontWeight: 700, fontSize: '13px' }}>
            + SUBIR
          </button>
        </div>
      </div>

      {/* Modal nuevo diseño */}
      {nuevoDiseno && (
        <div onClick={() => setNuevoDiseno(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#1a1a1a', borderRadius: '8px', padding: '32px', width: '100%', maxWidth: '500px', border: '1px solid #333' }}>
            <h2 style={{ fontWeight: 900, fontSize: '24px', marginBottom: '24px', color: '#ffffff' }}>SUBIR DISEÑO</h2>
            <input
              placeholder="Título del diseño"
              value={form.titulo}
              onChange={e => setForm({ ...form, titulo: e.target.value })}
              style={{ width: '100%', background: '#111', border: '1px solid #333', borderRadius: '4px', padding: '12px', color: '#ffffff', marginBottom: '12px', fontSize: '14px' }}
            />
            <select
              value={form.estilo}
              onChange={e => setForm({ ...form, estilo: e.target.value })}
              style={{ width: '100%', background: '#111', border: '1px solid #333', borderRadius: '4px', padding: '12px', color: '#ffffff', marginBottom: '12px', fontSize: '14px' }}>
              {filtros.filter(f => f !== 'Todos').map(f => <option key={f}>{f}</option>)}
            </select>
            <input
              placeholder="URL de la imagen"
              value={form.imagen_url}
              onChange={e => setForm({ ...form, imagen_url: e.target.value })}
              style={{ width: '100%', background: '#111', border: '1px solid #333', borderRadius: '4px', padding: '12px', color: '#ffffff', marginBottom: '16px', fontSize: '14px' }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={subirDiseno} style={{ flex: 1, background: '#cc0000', color: '#ffffff', fontWeight: 700, padding: '12px', borderRadius: '4px' }}>
                PUBLICAR
              </button>
              <button onClick={() => setNuevoDiseno(false)} style={{ flex: 1, background: '#333', color: '#ffffff', padding: '12px', borderRadius: '4px' }}>
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {filtros.map(f => (
          <button key={f} onClick={() => setFiltroActivo(f)} style={{
            padding: '8px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: 600,
            background: filtroActivo === f ? '#cc0000' : 'transparent',
            color: filtroActivo === f ? '#ffffff' : '#888',
            border: filtroActivo === f ? 'none' : '1px solid #333', cursor: 'pointer'
          }}>{f}</button>
        ))}
      </div>

      {/* Grid de diseños */}
      {loading ? (
        <p style={{ color: '#666' }}>Cargando diseños...</p>
      ) : disenos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎨</div>
          <p style={{ fontSize: '18px', marginBottom: '8px', color: '#ffffff' }}>No hay diseños en esta categoría</p>
          <p style={{ fontSize: '14px' }}>Sé el primero en subir un diseño</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {disenos.map((d, i) => (
            <div key={i} style={{ background: '#1a1a1a', borderRadius: '8px', overflow: 'hidden', border: '1px solid #2a2a2a', cursor: 'pointer' }}>
              <div style={{ position: 'relative' }}>
                {d.imagen_url ? (
                  <img src={d.imagen_url} alt={d.titulo} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '200px', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>🎨</div>
                )}
                {d.es_remix && (
                  <span style={{ position: 'absolute', top: '8px', left: '8px', background: '#d4a017', color: '#000', fontSize: '10px', fontWeight: 900, padding: '3px 8px', borderRadius: '3px' }}>
                    REMIX
                  </span>
                )}
              </div>
              <div style={{ padding: '14px' }}>
                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px', color: '#ffffff' }}>{d.titulo}</div>
                <div style={{ color: '#666', fontSize: '12px', marginBottom: '10px' }}>{d.estilo} · {d.autor_nombre}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '12px', color: '#666', fontSize: '12px' }}>
                    <span onClick={() => darLike(d.id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      ♡ <span style={{ color: '#ffffff' }}>{d.likes}</span>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      🔀 <span style={{ color: '#ffffff' }}>{d.remixes}</span>
                    </span>
                  </div>
                  <button style={{ background: '#cc000022', color: '#cc0000', border: 'none', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '3px', cursor: 'pointer' }}>
                    REMIX
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}