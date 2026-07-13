import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function PostDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [respuesta, setRespuesta] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    cargarPost();
  }, [id]);

  const cargarPost = async () => {
    try {
      const res = await api.get('/foro');
      const postEncontrado = res.data.find(p => p.id === parseInt(id));
      setPost(postEncontrado);
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(false);
  };

  const darLike = async () => {
    try {
      await api.put(`/foro/${id}/like`);
      cargarPost();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const enviarRespuesta = async () => {
    if (!respuesta.trim()) return;
    setEnviando(true);
    try {
      await api.post(`/foro/${id}/respuesta`, { contenido: respuesta });
      setRespuesta('');
      cargarPost();
    } catch (err) {
      console.error('Error:', err);
    }
    setEnviando(false);
  };

  if (loading) return <div style={{ color: '#fff', padding: '40px' }}>Cargando...</div>;
  if (!post) return <div style={{ color: '#fff', padding: '40px' }}>Post no encontrado</div>;

  return (
    <div>
      <button
        onClick={() => navigate('/foro')}
        style={{ background: 'none', border: 'none', color: '#cc0000', cursor: 'pointer', fontSize: '14px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', padding: 0 }}>
        ← Volver al foro
      </button>

      <div style={{ background: '#1a1a1a', borderRadius: '8px', padding: '32px', border: '1px solid #2a2a2a', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
          {post.fijado && <span style={{ color: '#cc0000', fontSize: '11px', fontWeight: 700, letterSpacing: '1px' }}>FIJADO</span>}
          <span style={{ background: '#333', color: '#ccc', fontSize: '12px', padding: '3px 10px', borderRadius: '4px' }}>{post.categoria}</span>
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff', marginBottom: '16px' }}>{post.titulo}</h1>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px' }}>
          {post.autor_nombre} · {new Date(post.fecha).toLocaleDateString('es-ES')}
        </p>
        <p style={{ color: '#ccc', fontSize: '15px', lineHeight: 1.8, marginBottom: '24px' }}>
          {post.contenido}
        </p>
        <div style={{ display: 'flex', gap: '24px', color: '#666', fontSize: '14px', borderTop: '1px solid #222', paddingTop: '16px' }}>
          <span>👁 {post.vistas} vistas</span>
          <span onClick={darLike} style={{ cursor: 'pointer', color: '#cc0000' }}>♡ {post.likes} likes</span>
        </div>
      </div>

      <div style={{ background: '#1a1a1a', borderRadius: '8px', padding: '24px', border: '1px solid #2a2a2a', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '20px' }}>
          RESPUESTAS
        </h3>
        <p style={{ color: '#666', fontSize: '14px' }}>Se el primero en responder.</p>
      </div>

      <div style={{ background: '#1a1a1a', borderRadius: '8px', padding: '24px', border: '1px solid #2a2a2a' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>TU RESPUESTA</h3>
        <textarea
          value={respuesta}
          onChange={e => setRespuesta(e.target.value)}
          placeholder="Escribe tu respuesta..."
          rows={4}
          style={{ width: '100%', background: '#111', border: '1px solid #333', borderRadius: '4px', padding: '12px', color: '#fff', fontSize: '14px', resize: 'vertical', marginBottom: '12px', boxSizing: 'border-box' }}
        />
        <button
          onClick={enviarRespuesta}
          disabled={enviando}
          style={{ background: '#cc0000', color: '#fff', fontWeight: 700, fontSize: '14px', padding: '12px 24px', borderRadius: '4px', border: 'none', cursor: 'pointer', opacity: enviando ? 0.7 : 1 }}>
          {enviando ? 'PUBLICANDO...' : 'PUBLICAR RESPUESTA'}
        </button>
      </div>
    </div>
  );
}