import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const colorNivel = { Basico: '#22c55e', Avanzado: '#f97316' };

export default function ArticuloDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [articulo, setArticulo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(function() {
    api.get('/herramientas').then(function(res) {
      var encontrado = res.data.find(function(a) { return a.id === parseInt(id); });
      setArticulo(encontrado);
      setLoading(false);
    }).catch(function() {
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div style={{ color: '#fff', padding: '40px' }}>Cargando...</div>;
  if (!articulo) return <div style={{ color: '#fff', padding: '40px' }}>Articulo no encontrado</div>;

  return (
    <div>
      <button
        onClick={function() { navigate('/herramientas'); }}
        style={{ background: 'none', border: 'none', color: '#cc0000', cursor: 'pointer', fontSize: '14px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', padding: 0 }}>
        Volver a herramientas
      </button>

      <div style={{ background: '#1a1a1a', borderRadius: '8px', overflow: 'hidden', border: '1px solid #2a2a2a', marginBottom: '24px' }}>
        <div style={{ height: '200px', background: '#222' }} />
        <div style={{ padding: '32px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ background: colorNivel[articulo.nivel] || '#22c55e', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '3px' }}>{articulo.nivel}</span>
            <span style={{ color: '#666', fontSize: '12px' }}>{articulo.categoria}</span>
            <span style={{ color: '#666', fontSize: '12px', marginLeft: 'auto' }}>⏱ {articulo.tiempo} min de lectura</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff', marginBottom: '24px' }}>{articulo.titulo}</h1>
          <p style={{ color: '#888', fontSize: '15px', lineHeight: 1.8, marginBottom: '32px' }}>{articulo.descripcion}</p>
          <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>Contenido</h2>
            <p style={{ color: '#ccc', fontSize: '15px', lineHeight: 2 }}>{articulo.contenido}</p>
          </div>
        </div>
      </div>
    </div>
  );
}