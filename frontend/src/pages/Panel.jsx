import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Panel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const hoy = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  useEffect(() => {
    api.get('/citas').then(res => {
      setCitas(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const totalIngresos = citas.reduce((sum, c) => sum + Number(c.precio || 0), 0);
  const colorEstado = { confirmada: '#22c55e', pendiente: '#f97316', en_curso: '#3b82f6', cancelada: '#cc0000' };

  const stats = [
    { label: 'CITAS HOY', valor: citas.length.toString(), sub: `en ${[...new Set(citas.map(c => c.box_nombre))].length} boxes`, color: '#3b82f6' },
    { label: 'INGRESOS HOY', valor: `${totalIngresos}`, sub: 'estimados', color: '#22c55e' },
    { label: 'VALORACION', valor: '-', sub: 'sin resenas aun', color: '#d4a017' },
    { label: 'SEGUIDORES', valor: '0', sub: 'empieza a crecer', color: '#a855f7' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '48px', fontWeight: 900, marginBottom: '4px', color: '#ffffff' }}>
        HOLA, <span style={{ color: '#cc0000' }}>{user?.nombre?.split(' ')[0]?.toUpperCase() || 'ARTISTA'}</span>
      </h1>
      <p style={{ color: '#666', marginBottom: '24px', textTransform: 'capitalize' }}>{hoy}</p>

      <div style={{
        background: 'linear-gradient(135deg, #1a0a00, #2a1500)',
        border: '1px solid #d4a01755', borderRadius: '8px',
        padding: '16px 24px', marginBottom: '24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>⭐</span>
          <div>
            <div style={{ color: '#d4a017', fontWeight: 700, fontSize: '14px', marginBottom: '2px' }}>PLAN PREMIUM - PROXIMAMENTE</div>
            <div style={{ color: '#888', fontSize: '13px' }}>Gestion avanzada de citas, estadisticas detalladas, prioridad en busquedas y mucho mas.</div>
          </div>
        </div>
        <button style={{ background: '#d4a017', color: '#000', fontWeight: 700, fontSize: '12px', padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          AVISAME CUANDO ESTE
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {stats.map(({ label, valor, sub, color }) => (
          <div key={label} style={{ background: '#1a1a1a', borderRadius: '8px', padding: '20px', border: '1px solid #2a2a2a' }}>
            <p style={{ color: '#666', fontSize: '11px', letterSpacing: '2px', marginBottom: '8px' }}>{label}</p>
            <p style={{ color, fontSize: '32px', fontWeight: 900, marginBottom: '4px' }}>{valor}</p>
            <p style={{ color: '#666', fontSize: '12px' }}>{sub}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px' }}>
        <div style={{ background: '#1a1a1a', borderRadius: '8px', padding: '24px', border: '1px solid #2a2a2a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '1px', color: '#ffffff' }}>CITAS DE HOY</h3>
            <span onClick={() => navigate('/citas')} style={{ color: '#cc0000', fontSize: '13px', cursor: 'pointer' }}>VER TODO</span>
          </div>
          {loading ? (
            <p style={{ color: '#666' }}>Cargando...</p>
          ) : citas.length === 0 ? (
            <p style={{ color: '#666' }}>No hay citas para hoy</p>
          ) : (
            citas.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 0', borderBottom: '1px solid #222' }}>
                <div style={{ minWidth: '60px' }}>
                  <div style={{ color: '#d4a017', fontWeight: 700, fontSize: '15px' }}>
                    {new Date(c.fecha_inicio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div style={{ color: '#666', fontSize: '12px' }}>{c.duracion_horas}h</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '15px', color: '#ffffff' }}>{c.cliente_nombre}</div>
                  <div style={{ color: '#666', fontSize: '12px' }}>{c.tamano} · {c.box_nombre}</div>
                </div>
                <div style={{ fontWeight: 700, color: '#ffffff' }}>{c.precio}€</div>
                <div style={{ background: colorEstado[c.estado] + '22', color: colorEstado[c.estado], fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '4px' }}>
                  {c.estado}
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ background: '#1a1a1a', borderRadius: '8px', padding: '24px', border: '1px solid #2a2a2a' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '1px', marginBottom: '16px', color: '#ffffff' }}>ACCESO RAPIDO</h3>
          {[
            { label: 'Nueva cita', icon: '+', ruta: '/citas' },
            { label: 'Subir diseno', icon: '🎨', ruta: '/disenos' },
            { label: 'Ver eventos', icon: '🎤', ruta: '/eventos' },
            { label: 'Foro', icon: '💬', ruta: '/foro' },
          ].map(({ label, icon, ruta }) => (
            <div key={label} onClick={() => navigate(ruta)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #222', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#ffffff' }}>
                <span style={{ color: '#cc0000' }}>{icon}</span>
                {label}
              </div>
              <span style={{ color: '#666' }}>›</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}