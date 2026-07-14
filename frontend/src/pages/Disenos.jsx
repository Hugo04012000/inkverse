import { useState, useEffect } from 'react';
import api from '../services/api';

const filtros = ['Todos', 'Blackwork', 'Realismo', 'Japonés', 'Neo-tradicional', 'Tradicional', 'Watercolor', 'Geometric', 'Fineline', 'Mandala', 'Floral', 'Tribal', 'Lettering', 'Biomecánico', 'Cover-up', 'Minimalista', 'Puntillismo', 'Surrealista', 'Anime', 'Celtíco'];

const colorEstilo = {
  'Blackwork': '#1a1a1a',
  'Japonés': '#1a0a0a',
  'Watercolor': '#0a1a2a',
  'Geometric': '#0a0a1a',
  'Mandala': '#1a0a1a',
  'Realismo': '#0f0f0f',
  'Fineline': '#0a1a0a',
  'Neo-tradicional': '#1a0800',
  'Tradicional': '#1a1000',
  'Tribal': '#111111',
  'Lettering': '#0a0a12',
  'Anime': '#12001a',
  'Biomecánico': '#0a1212',
  'Cover-up': '#121200',
  'Minimalista': '#101010',
  'Puntillismo': '#0a120a',
  'Surrealista': '#12000a',
  'Floral': '#0a1200',
  'Celtíco': '#001212',
};

export default function Disenos() {
  const [disenos, setDisenos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroActivo, setFiltroActivo] = useState('Todos');
  const [nuevoDiseno, setNuevoDiseno] = useState(false);
  const [form, setForm] = useState({ titulo: '', estilo: 'Geometric', imagen_url: '' });

  useEffect(function() {
    cargarDisenos();
  }, [filtroActivo]);

  function cargarDisenos() {
    setLoading(true);
    api.get('/disenos', { params: { estilo: filtroActivo } }).then(function(res) {
      setDisenos(res.data);
      setLoading(false);
    }).catch(function() {
      setLoading(false);
    });
  }

  function darLike(e, id) {
    e.stopPropagation();
    api.put('/disenos/' + id + '/like').then(function() {
      cargarDisenos();
    }).catch(function(err) {
      console.error('Error:', err);
    });
  }

  function subirDiseno() {
    api.post('/disenos', form).then(function() {
      setNuevoDiseno(false);
      setForm({ titulo: '', estilo: 'Geometric', imagen_url: '' });
      cargarDisenos();
    }).catch(function(err) {
      console.error('Error:', err);
    });
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <p style={{ color: '#666', fontSize: '12px', letterSpacing: '2px', marginBottom: '4px' }}>COMUNIDAD</p>
          <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#ffffff' }}>DISEÑOS</h1>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ background: '#1a1a1a', color: '#ffffff', padding: '10px 20px', borderRadius: '4px', border: '1px solid #333', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            Canvas
          </button>
          <button onClick={function() { setNuevoDiseno(true); }} style={{ background: '#cc0000', color: '#ffffff', padding: '10px 20px', borderRadius: '4px', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer' }}>
            + SUBIR
          </button>
        </div>
      </div>

      {nuevoDiseno && (
        <div onClick={function() { setNuevoDiseno(false); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div onClick={function(e) { e.stopPropagation(); }} style={{ background: '#1a1a1a', borderRadius: '8px', padding: '32px', width: '100%', maxWidth: '500px', border: '1px solid #333' }}>
            <h2 style={{ fontWeight: 900, fontSize: '24px', marginBottom: '24px', color: '#ffffff' }}>SUBIR DISEÑO</h2>
            <input
              placeholder="Título del diseño"
              value={form.titulo}
              onChange={function(e) { setForm({ titulo: e.target.value, estilo: form.estilo, imagen_url: form.imagen_url }); }}
              style={{ width: '100%', background: '#111', border: '1px solid #333', borderRadius: '4px', padding: '12px', color: '#ffffff', marginBottom: '12px', fontSize: '14px', boxSizing: 'border-box' }}
            />
            <select
              value={form.estilo}
              onChange={function(e) { setForm({ titulo: form.titulo, estilo: e.target.value, imagen_url: form.imagen_url }); }}
              style={{ width: '100%', background: '#111', border: '1px solid #333', borderRadius: '4px', padding: '12px', color: '#ffffff', marginBottom: '12px', fontSize: '14px', boxSizing: 'border-box' }}>
              {filtros.filter(function(f) { return f !== 'Todos'; }).map(function(f) {
                return <option key={f} value={f}>{f}</option>;
              })}
            </select>
            <input
              placeholder="URL de la imagen (opcional)"
              value={form.imagen_url}
              onChange={function(e) { setForm({ titulo: form.titulo, estilo: form.estilo, imagen_url: e.target.value }); }}
              style={{ width: '100%', background: '#111', border: '1px solid #333', borderRadius: '4px', padding: '12px', color: '#ffffff', marginBottom: '16px', fontSize: '14px', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={subirDiseno} style={{ flex: 1, background: '#cc0000', color: '#ffffff', fontWeight: 700, padding: '12px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
                PUBLICAR
              </button>
              <button onClick={function() { setNuevoDiseno(false); }} style={{ flex: 1, background: '#333', color: '#ffffff', padding: '12px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {filtros.map(function(f) {
          return (
            <button key={f} onClick={function() { setFiltroActivo(f); }} style={{
              padding: '8px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: 600,
              background: filtroActivo === f ? '#cc0000' : 'transparent',
              color: filtroActivo === f ? '#ffffff' : '#888',
              border: filtroActivo === f ? 'none' : '1px solid #333', cursor: 'pointer'
            }}>{f}</button>
          );
        })}
      </div>

      {loading ? (
        <p style={{ color: '#666' }}>Cargando diseños...</p>
      ) : disenos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎨</div>
          <p style={{ fontSize: '18px', marginBottom: '8px', color: '#ffffff' }}>No hay diseños en esta categoría</p>
          <p style={{ fontSize: '14px' }}>Se el primero en subir un diseño</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {disenos.map(function(d, i) {
            return (
              <div key={i} style={{ background: '#1a1a1a', borderRadius: '8px', overflow: 'hidden', border: '1px solid #2a2a2a', cursor: 'pointer' }}>
                <div style={{ position: 'relative' }}>
                  {d.imagen_url ? (
                    <img src={d.imagen_url} alt={d.titulo} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                  ) : (
                    <div style={{
                      width: '100%', height: '200px',
                      background: colorEstilo[d.estilo] || '#1a1a1a',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      borderBottom: '1px solid #2a2a2a'
                    }}>
                      <span style={{ fontSize: '36px' }}>🎨</span>
                      <span style={{ color: '#444', fontSize: '11px', fontWeight: 600, letterSpacing: '2px' }}>{d.estilo ? d.estilo.toUpperCase() : ''}</span>
                    </div>
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
                      <span onClick={function(e) { darLike(e, d.id); }} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
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
            );
          })}
        </div>
      )}
    </div>
  );
}