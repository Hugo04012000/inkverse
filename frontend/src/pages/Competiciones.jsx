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
  const [misComp, setMisComp] = useState([]);
  const [modalComp, setModalComp] = useState(null);
  const [mensajeModal, setMensajeModal] = useState('');
  const [inscribiendo, setInscribiendo] = useState(false);

  useEffect(function() {
    cargarCompeticiones();
    cargarMisComp();
  }, []);

  function cargarCompeticiones() {
    api.get('/competiciones').then(function(res) {
      setCompeticiones(res.data);
      setLoading(false);
    }).catch(function() {
      setLoading(false);
    });
  }

  function cargarMisComp() {
    api.get('/inscripciones/mis-competiciones').then(function(res) {
      setMisComp(res.data);
    }).catch(function() {});
  }

  function inscribirse() {
    if (!modalComp) return;
    setInscribiendo(true);
    api.post('/inscripciones/competiciones/' + modalComp.id, {}).then(function() {
      setMensajeModal('correctamente');
      setMisComp(function(prev) { return [...prev, modalComp.id]; });
      cargarCompeticiones();
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

  return (
    <div>
      <p style={{ color: '#666', fontSize: '12px', letterSpacing: '2px', marginBottom: '4px' }}>COMPETICION</p>
      <h1 style={{ fontSize: '48px', fontWeight: 900, marginBottom: '32px', color: '#ffffff' }}>CAMPEONATOS</h1>

      {modalComp && (
        <div onClick={function() { setModalComp(null); setMensajeModal(''); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' }}>
          <div onClick={function(ev) { ev.stopPropagation(); }} style={{ background: '#1a1a1a', borderRadius: '8px', padding: '32px', width: '100%', maxWidth: '440px', borderTop: '3px solid #cc0000', position: 'relative' }}>
            <button onClick={function() { setModalComp(null); setMensajeModal(''); }} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', color: '#666', fontSize: '20px', border: 'none', cursor: 'pointer' }}>x</button>
            <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#ffffff', marginBottom: '8px' }}>{modalComp.titulo}</h2>
            <p style={{ color: '#888', fontSize: '13px', marginBottom: '8px' }}>📍 {modalComp.ciudad}</p>
            <p style={{ color: '#888', fontSize: '13px', marginBottom: '24px' }}>{modalComp.artistas_inscritos}/{modalComp.artistas_total} artistas inscritos</p>

            {modalComp.estado === 'resultados_disponibles' ? (
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#a855f7', fontSize: '14px', marginBottom: '16px' }}>Los resultados ya estan disponibles</p>
                {modalComp.url_oficial ? (
                  <button
                    onClick={function() { irWebOficial(modalComp.url_oficial); }}
                    style={{ width: '100%', background: '#a855f7', color: '#fff', fontWeight: 700, fontSize: '14px', padding: '12px', borderRadius: '4px', border: 'none', cursor: 'pointer', marginBottom: '8px' }}>
                    VER RESULTADOS EN LA WEB OFICIAL
                  </button>
                ) : null}
                <button onClick={function() { setModalComp(null); }} style={{ background: 'transparent', color: '#666', fontSize: '13px', padding: '8px', border: 'none', cursor: 'pointer' }}>
                  Cerrar
                </button>
              </div>
            ) : mensajeModal === 'correctamente' ? (
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#22c55e', fontSize: '14px', marginBottom: '16px' }}>Inscripcion guardada correctamente</p>
                {modalComp.url_oficial ? (
                  <button
                    onClick={function() { irWebOficial(modalComp.url_oficial); }}
                    style={{ width: '100%', background: '#d4a017', color: '#000', fontWeight: 700, fontSize: '14px', padding: '12px', borderRadius: '4px', border: 'none', cursor: 'pointer', marginBottom: '8px' }}>
                    IR A LA WEB OFICIAL PARA COMPLETAR INSCRIPCION
                  </button>
                ) : null}
                <button onClick={function() { setModalComp(null); setMensajeModal(''); }} style={{ background: 'transparent', color: '#666', fontSize: '13px', padding: '8px', border: 'none', cursor: 'pointer' }}>
                  Cerrar
                </button>
              </div>
            ) : mensajeModal ? (
              <p style={{ color: '#cc0000', fontSize: '14px', textAlign: 'center', marginBottom: '16px' }}>{mensajeModal}</p>
            ) : (
              <div>
                <div style={{ background: '#111', borderRadius: '6px', padding: '16px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#ccc', fontSize: '14px' }}>Precio inscripcion</span>
                    <span style={{ color: '#d4a017', fontWeight: 700, fontSize: '20px' }}>{modalComp.precio_inscripcion} EUR</span>
                  </div>
                </div>
                <button
                  onClick={inscribirse}
                  disabled={inscribiendo}
                  style={{ width: '100%', background: '#cc0000', color: '#fff', fontWeight: 700, fontSize: '15px', padding: '14px', borderRadius: '4px', border: 'none', cursor: 'pointer', opacity: inscribiendo ? 0.7 : 1 }}>
                  {inscribiendo ? 'INSCRIBIENDO...' : 'CONFIRMAR INSCRIPCION'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <p style={{ color: '#666' }}>Cargando competiciones...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {competiciones.map(function(c, i) {
            var yaInscrito = misComp.includes(c.id);
            return (
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
                    {c.estilos && c.estilos.map(function(e, j) {
                      return (
                        <span key={j} style={{ border: '1px solid #444', color: '#ffffff', fontSize: '12px', padding: '4px 10px', borderRadius: '4px' }}>{e}</span>
                      );
                    })}
                  </div>
                  <button
                    onClick={function() { setModalComp(c); }}
                    disabled={yaInscrito && c.estado === 'inscripciones_abiertas'}
                    style={{
                      background: yaInscrito && c.estado === 'inscripciones_abiertas' ? '#333' :
                        c.estado === 'inscripciones_abiertas' ? '#cc0000' : 'transparent',
                      border: c.estado === 'inscripciones_abiertas' ? 'none' : '1px solid #d4a017',
                      color: c.estado === 'inscripciones_abiertas' ? '#ffffff' : '#d4a017',
                      fontWeight: 700, fontSize: '13px', padding: '10px 24px', borderRadius: '4px', cursor: 'pointer'
                    }}>
                    {yaInscrito && c.estado === 'inscripciones_abiertas' ? 'YA INSCRITO' :
                      c.estado === 'inscripciones_abiertas' ? 'INSCRIBIRSE — ' + c.precio_inscripcion + 'EUR' : 'VER RESULTADOS'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}