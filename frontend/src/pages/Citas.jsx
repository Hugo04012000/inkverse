import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Citas() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fecha] = useState(new Date().toLocaleDateString('es-ES'));

  useEffect(() => {
    cargarCitas();
  }, []);

  const cargarCitas = async () => {
    try {
      const res = await api.get('/citas');
      setCitas(res.data);
    } catch (err) {
      console.error('Error cargando citas:', err);
    }
    setLoading(false);
  };

  const cambiarEstado = async (id, estado) => {
    try {
      await api.put(`/citas/${id}/estado`, { estado });
      cargarCitas();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const eliminarCita = async (id) => {
    if (!confirm('¿Eliminar esta cita?')) return;
    try {
      await api.delete(`/citas/${id}`);
      cargarCitas();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const colorEstado = { confirmada: '#22c55e', pendiente: '#f97316', en_curso: '#3b82f6', cancelada: '#cc0000' };
  const boxesUnicos = [...new Set(citas.map(c => c.box_nombre))];

  if (loading) return <div style={{ color: '#fff', padding: '40px' }}>Cargando citas...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#ffffff' }}>CITAS</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ background: '#1a1a1a', color: '#ffffff', padding: '10px 16px', borderRadius: '4px', border: '1px solid #333', fontSize: '13px' }}>📄 CSV</button>
          <button style={{ background: '#cc0000', color: '#ffffff', padding: '10px 20px', borderRadius: '4px', fontWeight: 700, fontSize: '13px' }}>+ NUEVA CITA</button>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button style={{ background: '#1a1a1a', color: '#ffffff', padding: '8px 12px', borderRadius: '4px', border: '1px solid #333' }}>‹</button>
        <div style={{ background: '#1a1a1a', color: '#ffffff', padding: '8px 20px', borderRadius: '4px', border: '1px solid #333', fontSize: '14px' }}>{fecha}</div>
        <button style={{ background: '#1a1a1a', color: '#ffffff', padding: '8px 12px', borderRadius: '4px', border: '1px solid #333' }}>›</button>
        <span style={{ color: '#666', fontSize: '14px' }}>{citas.length} citas · {citas.reduce((sum, c) => sum + Number(c.precio || 0), 0)}€ estimados</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {boxesUnicos.map((boxNombre, i) => {
          const citasBox = citas.filter(c => c.box_nombre === boxNombre);
          return (
            <div key={i} style={{ background: '#1a1a1a', borderRadius: '8px', padding: '20px', border: '1px solid #2a2a2a' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', color: '#666', letterSpacing: '1px' }}>{boxNombre?.toUpperCase()}</div>
                <div style={{ color: '#d4a017', fontWeight: 700, fontSize: '20px' }}>{citasBox.length}</div>
              </div>
              {citasBox.length === 0 ? (
                <div style={{ color: '#444', fontSize: '13px', textAlign: 'center', padding: '20px' }}>LIBRE</div>
              ) : (
                citasBox.map((cita, j) => (
                  <div key={j} style={{ background: '#111', borderRadius: '6px', padding: '12px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: '#d4a017', fontWeight: 700 }}>
                        {new Date(cita.fecha_inicio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span style={{ background: colorEstado[cita.estado] + '22', color: colorEstado[cita.estado], fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '3px' }}>
                        {cita.estado}
                      </span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#ffffff' }}>{cita.cliente_nombre}</div>
                    <div style={{ color: '#666', fontSize: '12px' }}>{cita.tamano} · {cita.duracion_horas}h</div>
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>

      <div style={{ background: '#1a1a1a', borderRadius: '8px', padding: '24px', border: '1px solid #2a2a2a' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '1px', marginBottom: '20px', color: '#d4a017' }}>LISTA DEL DÍA</h3>
        {citas.map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0', borderBottom: '1px solid #222' }}>
            <div style={{ minWidth: '60px' }}>
              <div style={{ color: '#d4a017', fontWeight: 700 }}>
                {new Date(c.fecha_inicio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div style={{ color: '#666', fontSize: '12px' }}>{c.duracion_horas}h</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, marginBottom: '4px', color: '#ffffff' }}>{c.cliente_nombre} · {c.box_nombre}</div>
              <div style={{ color: '#666', fontSize: '12px' }}>
                {c.tamano} · {c.precio}€ (depósito {c.deposito}€)
              </div>
              {c.descripcion && <div style={{ color: '#555', fontSize: '12px', fontStyle: 'italic' }}>{c.descripcion}</div>}
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ background: colorEstado[c.estado] + '22', color: colorEstado[c.estado], fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '4px' }}>
                {c.estado}
              </span>
              <select
                value={c.estado}
                onChange={e => cambiarEstado(c.id, e.target.value)}
                style={{ background: '#111', color: '#ffffff', border: '1px solid #333', borderRadius: '4px', padding: '4px 8px', fontSize: '12px' }}>
                <option value="pendiente">Pendiente</option>
                <option value="confirmada">Confirmada</option>
                <option value="en_curso">En curso</option>
                <option value="cancelada">Cancelada</option>
              </select>
              <span onClick={() => eliminarCita(c.id)} style={{ color: '#666', cursor: 'pointer', fontSize: '16px' }}>🗑</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}