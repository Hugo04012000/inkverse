import { useState, useEffect } from 'react';
import api from '../services/api';

const tiposFiltro = ['Todos', 'Charlas', 'Quedadas', 'Workshops'];
const ciudadesFiltro = ['Todas', 'Madrid', 'Barcelona', 'Valencia', 'Bilbao'];
const colorTipo = { talk: '#a855f7', meetup: '#3b82f6', workshop: '#22c55e' };

export default function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tipoActivo, setTipoActivo] = useState('Todos');
  const [ciudadActiva, setCiudadActiva] = useState('Todas');

  useEffect(() => {
    api.get('/eventos').then(res => {
      setEventos(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtrados = eventos.filter(e => {
    const tipoMatch = tipoActivo === 'Todos' ||
      (tipoActivo === 'Charlas' && e.tipo === 'talk') ||
      (tipoActivo === 'Quedadas' && e.tipo === 'meetup') ||
      (tipoActivo === 'Workshops' && e.tipo === 'workshop');
    const ciudadMatch = ciudadActiva === 'Todas' || e.ciudad === ciudadActiva;
    return tipoMatch && ciudadMatch;
  });

  return (
    <div>
      <p style={{ color: '#666', fontSize: '12px', letterSpacing: '2px', marginBottom: '4px' }}>COMUNIDAD</p>
      <h1 style={{ fontSize: '48px', fontWeight: 900, marginBottom: '24px', color: '#ffffff' }}>EVENTOS</h1>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {tiposFiltro.map(t => (
          <button key={t} onClick={() => setTipoActivo(t)} style={{
            padding: '8px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: 600,
            background: tipoActivo === t ? '#cc0000' : 'transparent',
            color: tipoActivo === t ? '#ffffff' : '#888',
            border: tipoActivo === t ? 'none' : '1px solid #333', cursor: 'pointer'
          }}>{t}</button>
        ))}
        {ciudadesFiltro.map(c => (
          <button key={c} onClick={() => setCiudadActiva(c)} style={{
            padding: '8px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: 600,
            background: ciudadActiva === c ? '#cc0000' : 'transparent',
            color: ciudadActiva === c ? '#ffffff' : '#888',
            border: ciudadActiva === c ? 'none' : '1px solid #333', cursor: 'pointer'
          }}>{c}</button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: '#666' }}>Cargando eventos...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          {filtrados.map((e, i) => (
            <div key={i} style={{ background: '#1a1a1a', borderRadius: '8px', overflow: 'hidden', border: '1px solid #2a2a2a' }}>
              <div style={{ height: '180px', background: '#222', position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '12px' }}>
                <span style={{ background: colorTipo[e.tipo] + '33', color: colorTipo[e.tipo], fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '4px' }}>
                  {e.tipo}
                </span>
                <span style={{ color: '#ffffff', fontSize: '12px', background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: '4px' }}>
                  📍 {e.ciudad}
                </span>
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '16px', flex: 1, marginRight: '12px', color: '#ffffff' }}>{e.titulo}</h3>
                  <span style={{ color: Number(e.precio) === 0 ? '#22c55e' : '#d4a017', fontWeight: 700, fontSize: '16px', whiteSpace: 'nowrap' }}>
                    {Number(e.precio) === 0 ? 'GRATIS' : `${e.precio}€`}
                  </span>
                </div>
                <p style={{ color: '#666', fontSize: '13px', marginBottom: '16px', lineHeight: 1.5 }}>{e.descripcion}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: '#888', fontSize: '12px' }}>
                      {e.plazas_ocupadas}/{e.plazas_total} plazas · {new Date(e.fecha).toLocaleDateString('es-ES')}
                    </div>
                    <div style={{ height: '3px', background: '#333', borderRadius: '2px', marginTop: '6px', width: '150px' }}>
                      <div style={{ height: '100%', background: '#cc0000', borderRadius: '2px', width: `${(e.plazas_ocupadas / e.plazas_total) * 100}%` }} />
                    </div>
                  </div>
                  <button style={{ background: '#cc0000', color: '#ffffff', fontWeight: 700, fontSize: '13px', padding: '10px 20px', borderRadius: '4px' }}>
                    INSCRIBIRSE
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