import { useState, useEffect } from 'react';
import api from '../services/api';

const colorEstado = {
  inscripciones_abiertas: '#22c55e',
  resultados_disponibles: '#a855f7',
};

const textoEstado = {
  inscripciones_abiertas: 'INSCRIPCIONES ABIERTAS',
  resultados_disponibles: 'RESULTADOS DISPONIBLES',
};

export default function Competiciones() {
  const [competiciones, setCompeticiones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/competiciones').then(res => {
      setCompeticiones(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <p style={{ color: '#666', fontSize: '12px', letterSpacing: '2px', marginBottom: '4px' }}>COMPETICIÓN</p>
      <h1 style={{ fontSize: '48px', fontWeight: 900, marginBottom: '32px', color: '#ffffff' }}>CAMPEONATOS</h1>

      {loading ? (
        <p style={{ color: '#666' }}>Cargando competiciones...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {competiciones.map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: '24px', background: '#1a1a1a', borderRadius: '8px', overflow: 'hidden', border: '1px solid #2a2a2a' }}>
              <div style={{ width: '260px', minHeight: '220px', background: '#222', flexShrink: 0 }} />
              <div style={{ padding: '24px', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: colorEstado[c.estado], fontSize: '11px', fontWeight: 700, letterSpacing: '2px' }}>
                    {textoEstado[c.estado]}
                  </span>
                  <span style={{ color: '#666', fontSize: '11px', letterSpacing: '1px' }}>PREMIO</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#ffffff' }}>{c.titulo}</h2>
                  <span style={{ color: c.estado === 'resultados_disponibles' ? '#666' : '#d4a017', fontWeight: 700, fontSize: '18px', whiteSpace: 'nowrap', marginLeft: '16px' }}>
                    {c.premio}
                  </span>
                </div>
                <p style={{ color: '#888', fontSize: '14px', marginBottom: '16px', lineHeight: 1.6 }}>{c.descripcion}</p>
                <div style={{ display: 'flex', gap: '20px', color: '#666', fontSize: '13px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <span>📍 {c.ciudad}</span>
                  <span>📅 {new Date(c.fecha).toLocaleDateString('es-ES')}</span>
                  <span>👤 {c.artistas_inscritos}/{c.artistas_total} artistas</span>
                  {c.deadline && <span>⏰ Deadline: {new Date(c.deadline).toLocaleDateString('es-ES')}</span>}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {c.estilos?.map((e, j) => (
                    <span key={j} style={{ border: '1px solid #444', color: '#ffffff', fontSize: '12px', padding: '4px 10px', borderRadius: '4px' }}>{e}</span>
                  ))}
                </div>
                <button style={{
                  background: c.estado === 'inscripciones_abiertas' ? '#cc0000' : 'transparent',
                  border: c.estado === 'inscripciones_abiertas' ? 'none' : '1px solid #d4a017',
                  color: c.estado === 'inscripciones_abiertas' ? '#ffffff' : '#d4a017',
                  fontWeight: 700, fontSize: '13px', padding: '10px 24px', borderRadius: '4px', cursor: 'pointer'
                }}>
                  {c.estado === 'inscripciones_abiertas' ? `INSCRIBIRSE — ${c.precio_inscripcion}€` : 'VER RESULTADOS'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}