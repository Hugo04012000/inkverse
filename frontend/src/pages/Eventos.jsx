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
  const [misEventos, setMisEventos] = useState([]);
  const [modalEvento, setModalEvento] = useState(null);
  const [mensajeModal, setMensajeModal] = useState('');
  const [inscribiendo, setInscribiendo] = useState(false);

  useEffect(function() {
    cargarEventos();
    cargarMisEventos();
  }, []);

  function cargarEventos() {
    api.get('/eventos').then(function(res) {
      setEventos(res.data);
      setLoading(false);
    }).catch(function() {
      setLoading(false);
    });
  }

  function cargarMisEventos() {
    api.get('/inscripciones/mis-eventos').then(function(res) {
      setMisEventos(res.data);
    }).catch(function() {});
  }

  function inscribirse() {
    if (!modalEvento) return;
    setInscribiendo(true);
    api.post('/inscripciones/eventos/' + modalEvento.id, {}).then(function() {
      setMensajeModal('correctamente');
      setMisEventos(function(prev) { return [...prev, modalEvento.id]; });
      cargarEventos();
    }).catch(function(err) {
      var errorMsg = 'Error al inscribirse';
      if (err.response && err.response.data && err.response.data.error) {
        errorMsg = err.response.data.error;
      }
      setMensajeModal(errorMsg);
    }).finally(function() {
      setInscribiendo(false);
    });
  }

  function irWebOficial(url) {
    window.open(url, '_blank');
  }

  var filtrados = eventos.filter(function(e) {
    var tipoMatch = tipoActivo === 'Todos' ||
      (tipoActivo === 'Charlas' && e.tipo === 'talk') ||
      (tipoActivo === 'Quedadas' && e.tipo === 'meetup') ||
      (tipoActivo === 'Workshops' && e.tipo === 'workshop');
    var ciudadMatch = ciudadActiva === 'Todas' || e.ciudad === ciudadActiva;
    return tipoMatch && ciudadMatch;
  });

  return (
    <div>
      <p style={{ color: '#666', fontSize: '12px', letterSpacing: '2px', marginBottom: '4px' }}>COMUNIDAD</p>
      <h1 style={{ fontSize: '48px', fontWeight: 900, marginBottom: '24px', color: '#ffffff' }}>EVENTOS</h1>

      {modalEvento && (
        <div onClick={function() { setModalEvento(null); setMensajeModal(''); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' }}>
          <div onClick={function(ev) { ev.stopPropagation(); }} style={{ background: '#1a1a1a', borderRadius: '8px', padding: '32px', width: '100%', maxWidth: '440px', borderTop: '3px solid #cc0000', position: 'relative' }}>
            <button onClick={function() { setModalEvento(null); setMensajeModal(''); }} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', color: '#666', fontSize: '20px', border: 'none', cursor: 'pointer' }}>x</button>
            <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#ffffff', marginBottom: '8px' }}>{modalEvento.titulo}</h2>
            <p style={{ color: '#888', fontSize: '13px', marginBottom: '8px' }}>📍 {modalEvento.ciudad}</p>
            <p style={{ color: '#888', fontSize: '13px', marginBottom: '24px' }}>{modalEvento.plazas_ocupadas}/{modalEvento.plazas_total} plazas ocupadas</p>
            <div style={{ background: '#111', borderRadius: '6px', padding: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#ccc', fontSize: '14px' }}>Precio</span>
                <span style={{ color: Number(modalEvento.precio) === 0 ? '#22c55e' : '#d4a017', fontWeight: 700, fontSize: '20px' }}>
                  {Number(modalEvento.precio) === 0 ? 'GRATIS' : modalEvento.precio + ' EUR'}
                </span>
              </div>
            </div>

            {mensajeModal === 'correctamente' ? (
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#22c55e', fontSize: '14px', marginBottom: '16px' }}>Inscripcion guardada correctamente</p>
                {modalEvento.url_oficial ? (
                  <button
                    onClick={function() { irWebOficial(modalEvento.url_oficial); }}
                    style={{ width: '100%', background: '#d4a017', color: '#000', fontWeight: 700, fontSize: '14px', padding: '12px', borderRadius: '4px', border: 'none', cursor: 'pointer', marginBottom: '8px' }}>
                    IR A LA WEB OFICIAL DEL EVENTO
                  </button>
                ) : null}
                <button onClick={function() { setModalEvento(null); setMensajeModal(''); }} style={{ background: 'transparent', color: '#666', fontSize: '13px', padding: '8px', border: 'none', cursor: 'pointer' }}>
                  Cerrar
                </button>
              </div>
            ) : mensajeModal ? (
              <p style={{ color: '#cc0000', fontSize: '14px', textAlign: 'center', marginBottom: '16px' }}>{mensajeModal}</p>
            ) : (
              <button
                onClick={inscribirse}
                disabled={inscribiendo}
                style={{ width: '100%', background: '#cc0000', color: '#fff', fontWeight: 700, fontSize: '15px', padding: '14px', borderRadius: '4px', border: 'none', cursor: 'pointer', opacity: inscribiendo ? 0.7 : 1 }}>
                {inscribiendo ? 'INSCRIBIENDO...' : 'CONFIRMAR INSCRIPCION'}
              </button>
            )}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {tiposFiltro.map(function(t) {
          return (
            <button key={t} onClick={function() { setTipoActivo(t); }} style={{
              padding: '8px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: 600,
              background: tipoActivo === t ? '#cc0000' : 'transparent',
              color: tipoActivo === t ? '#ffffff' : '#888',
              border: tipoActivo === t ? 'none' : '1px solid #333', cursor: 'pointer'
            }}>{t}</button>
          );
        })}
        {ciudadesFiltro.map(function(c) {
          return (
            <button key={c} onClick={function() { setCiudadActiva(c); }} style={{
              padding: '8px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: 600,
              background: ciudadActiva === c ? '#cc0000' : 'transparent',
              color: ciudadActiva === c ? '#ffffff' : '#888',
              border: ciudadActiva === c ? 'none' : '1px solid #333', cursor: 'pointer'
            }}>{c}</button>
          );
        })}
      </div>

      {loading ? (
        <p style={{ color: '#666' }}>Cargando eventos...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          {filtrados.map(function(e, i) {
            var yaInscrito = misEventos.includes(e.id);
            return (
              <div key={i} style={{ background: '#1a1a1a', borderRadius: '8px', overflow: 'hidden', border: '1px solid #2a2a2a' }}>
                <div style={{ height: '180px', background: '#222', position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '12px' }}>
                  <span style={{ background: (colorTipo[e.tipo] || '#888') + '33', color: colorTipo[e.tipo] || '#888', fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '4px' }}>
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
                      {Number(e.precio) === 0 ? 'GRATIS' : e.precio + ' EUR'}
                    </span>
                  </div>
                  <p style={{ color: '#666', fontSize: '13px', marginBottom: '16px', lineHeight: 1.5 }}>{e.descripcion}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ color: '#888', fontSize: '12px' }}>
                        {e.plazas_ocupadas}/{e.plazas_total} plazas · {new Date(e.fecha).toLocaleDateString('es-ES')}
                      </div>
                      <div style={{ height: '3px', background: '#333', borderRadius: '2px', marginTop: '6px', width: '150px' }}>
                        <div style={{ height: '100%', background: '#cc0000', borderRadius: '2px', width: (e.plazas_ocupadas / e.plazas_total * 100) + '%' }} />
                      </div>
                    </div>
                    <button
                      onClick={function() { setModalEvento(e); }}
                      disabled={yaInscrito}
                      style={{ background: yaInscrito ? '#333' : '#cc0000', color: '#ffffff', fontWeight: 700, fontSize: '13px', padding: '10px 20px', borderRadius: '4px', border: 'none', cursor: yaInscrito ? 'default' : 'pointer' }}>
                      {yaInscrito ? 'INSCRITO' : 'INSCRIBIRSE'}
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