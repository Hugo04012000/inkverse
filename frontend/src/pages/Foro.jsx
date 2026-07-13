import { useState, useEffect } from 'react';
import api from '../services/api';

const categorias = ['Todos', 'General', 'Tecnicas', 'Equipamiento', 'Arte', 'Eventos'];

const coloresCat = {
  Equipamiento: '#d4a017',
  Eventos: '#3b82f6',
  Tecnicas: '#22c55e',
  General: '#888',
  Arte: '#a855f7',
};

export default function Foro() {
  const [posts, setPosts] = useState([]);
  const [catActiva, setCatActiva] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const [nuevoPost, setNuevoPost] = useState(false);
  const [form, setForm] = useState({ titulo: '', contenido: '', categoria: 'General' });

  useEffect(() => {
    cargarPosts();
  }, []);

  const cargarPosts = async () => {
    try {
      const res = await api.get('/foro');
      setPosts(res.data);
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(false);
  };

  const crearPost = async () => {
    try {
      await api.post('/foro', form);
      setNuevoPost(false);
      setForm({ titulo: '', contenido: '', categoria: 'General' });
      cargarPosts();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const darLike = async (id) => {
    try {
      await api.put(`/foro/${id}/like`);
      cargarPosts();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const filtrados = catActiva === 'Todos'
    ? posts
    : posts.filter(p => p.categoria === catActiva);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <p style={{ color: '#666', fontSize: '12px', letterSpacing: '2px', marginBottom: '4px' }}>COMUNIDAD</p>
          <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#ffffff' }}>FORO</h1>
        </div>
        <button onClick={() => setNuevoPost(true)} style={{ background: '#cc0000', color: '#ffffff', padding: '10px 20px', borderRadius: '4px', fontWeight: 700, fontSize: '13px' }}>
          + NUEVO POST
        </button>
      </div>

      {nuevoPost && (
        <div onClick={() => setNuevoPost(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#1a1a1a', borderRadius: '8px', padding: '32px', width: '100%', maxWidth: '500px', border: '1px solid #333' }}>
            <h2 style={{ fontWeight: 900, fontSize: '24px', marginBottom: '24px', color: '#ffffff' }}>NUEVO POST</h2>
            <input
              placeholder="Titulo"
              value={form.titulo}
              onChange={e => setForm({ ...form, titulo: e.target.value })}
              style={{ width: '100%', background: '#111', border: '1px solid #333', borderRadius: '4px', padding: '12px', color: '#ffffff', marginBottom: '12px', fontSize: '14px', boxSizing: 'border-box' }}
            />
            <select
              value={form.categoria}
              onChange={e => setForm({ ...form, categoria: e.target.value })}
              style={{ width: '100%', background: '#111', border: '1px solid #333', borderRadius: '4px', padding: '12px', color: '#ffffff', marginBottom: '12px', fontSize: '14px', boxSizing: 'border-box' }}>
              {['General', 'Tecnicas', 'Equipamiento', 'Arte', 'Eventos'].map(c => <option key={c}>{c}</option>)}
            </select>
            <textarea
              placeholder="Contenido del post..."
              value={form.contenido}
              onChange={e => setForm({ ...form, contenido: e.target.value })}
              rows={5}
              style={{ width: '100%', background: '#111', border: '1px solid #333', borderRadius: '4px', padding: '12px', color: '#ffffff', marginBottom: '16px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={crearPost} style={{ flex: 1, background: '#cc0000', color: '#ffffff', fontWeight: 700, padding: '12px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
                PUBLICAR
              </button>
              <button onClick={() => setNuevoPost(false)} style={{ flex: 1, background: '#333', color: '#ffffff', padding: '12px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {categorias.map(cat => (
          <button key={cat} onClick={() => setCatActiva(cat)} style={{
            padding: '8px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: 600,
            background: catActiva === cat ? '#cc0000' : 'transparent',
            color: catActiva === cat ? '#ffffff' : '#888',
            border: catActiva === cat ? 'none' : '1px solid #333', cursor: 'pointer'
          }}>{cat}</button>
        ))}
      </div>

      <div style={{ background: '#1a1a1a', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
        {loading ? (
          <p style={{ color: '#666', padding: '24px' }}>Cargando posts...</p>
        ) : filtrados.length === 0 ? (
          <p style={{ color: '#666', padding: '24px', textAlign: 'center' }}>No hay posts en esta categoria todavia.</p>
        ) : filtrados.map((post, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 24px',
            borderBottom: '1px solid #222', cursor: 'pointer',
            borderLeft: post.fijado ? '3px solid #cc0000' : '3px solid transparent'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                {post.fijado && <span style={{ color: '#cc0000', fontSize: '11px', fontWeight: 700, letterSpacing: '1px' }}>FIJADO</span>}
                <span style={{ color: coloresCat[post.categoria] || '#888', fontSize: '13px', fontWeight: 600 }}>{post.categoria}</span>
              </div>
              <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '4px', color: '#ffffff' }}>{post.titulo}</div>
              <div style={{ color: '#666', fontSize: '12px' }}>{post.autor_nombre} · {new Date(post.fecha).toLocaleDateString('es-ES')}</div>
            </div>
            <div style={{ display: 'flex', gap: '24px', color: '#666', fontSize: '13px', alignItems: 'center' }}>
              <span>0</span>
              <span>{post.vistas}</span>
              <span onClick={() => darLike(post.id)} style={{ cursor: 'pointer' }}>♡ {post.likes}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}