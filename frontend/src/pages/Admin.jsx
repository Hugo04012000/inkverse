import { useState, useEffect } from 'react';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const datosLinea = [
  { mes: 'Ene', citas: 800 },
  { mes: 'Feb', citas: 1200 },
  { mes: 'Mar', citas: 1800 },
  { mes: 'Abr', citas: 2400 },
  { mes: 'May', citas: 3200 },
  { mes: 'Jun', citas: 4000 },
];

const datosEstilos = [
  { name: 'Blackwork', value: 28, color: '#cc0000' },
  { name: 'Realismo', value: 22, color: '#d4a017' },
  { name: 'Japonés', value: 18, color: '#a855f7' },
  { name: 'Neo-trad', value: 15, color: '#22c55e' },
  { name: 'Otros', value: 17, color: '#555' },
];

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(res => {
      setStats(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const statsCards = stats ? [
    { label: 'Usuarios Totales', valor: stats.totalUsuarios, color: '#3b82f6' },
    { label: 'Citas Este Mes', valor: stats.totalCitas, color: '#22c55e' },
    { label: 'Diseños Subidos', valor: stats.totalDisenos, color: '#a855f7' },
    { label: 'Ingresos Plataforma', valor: `${stats.totalIngresos}€`, color: '#d4a017' },
  ] : [];

  return (
    <div>
      <p style={{ color: '#666', fontSize: '12px', letterSpacing: '2px', marginBottom: '4px' }}>ADMINISTRACIÓN</p>
      <h1 style={{ fontSize: '48px', fontWeight: 900, marginBottom: '32px', color: '#ffffff' }}>PANEL ADMIN</h1>

      {loading ? <p style={{ color: '#666' }}>Cargando estadísticas...</p> : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {statsCards.map(({ label, valor, color }) => (
              <div key={label} style={{ background: '#1a1a1a', borderRadius: '8px', padding: '20px', border: '1px solid #2a2a2a' }}>
                <p style={{ color: '#666', fontSize: '12px', marginBottom: '8px' }}>{label}</p>
                <p style={{ color, fontSize: '32px', fontWeight: 900 }}>{valor}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: '#1a1a1a', borderRadius: '8px', padding: '24px', border: '1px solid #2a2a2a' }}>
              <h3 style={{ fontWeight: 700, letterSpacing: '1px', marginBottom: '20px', color: '#ffffff' }}>CITAS 2026</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={datosLinea}>
                  <XAxis dataKey="mes" stroke="#444" tick={{ fill: '#666', fontSize: 12 }} />
                  <YAxis stroke="#444" tick={{ fill: '#666', fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #333', color: '#ffffff' }} />
                  <Line type="monotone" dataKey="citas" stroke="#d4a017" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background: '#1a1a1a', borderRadius: '8px', padding: '24px', border: '1px solid #2a2a2a' }}>
              <h3 style={{ fontWeight: 700, letterSpacing: '1px', marginBottom: '20px', color: '#ffffff' }}>ESTILOS</h3>
              <PieChart width={200} height={160}>
                <Pie data={datosEstilos} cx={100} cy={80} innerRadius={50} outerRadius={75} dataKey="value">
                  {datosEstilos.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
              <div style={{ marginTop: '12px' }}>
                {datosEstilos.map(e => (
                  <div key={e.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                    <span style={{ color: '#ffffff' }}><span style={{ color: e.color }}>●</span> {e.name}</span>
                    <span style={{ color: '#666' }}>{e.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ background: '#1a1a1a', borderRadius: '8px', padding: '24px', border: '1px solid #2a2a2a' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontWeight: 700, letterSpacing: '1px', color: '#ffffff' }}>GESTIÓN DE USUARIOS</h3>
              <button style={{ background: 'none', border: '1px solid #333', color: '#ffffff', padding: '8px 16px', borderRadius: '4px', fontSize: '13px' }}>
                📄 EXPORTAR CSV
              </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ color: '#666', borderBottom: '1px solid #333' }}>
                  {['USUARIO', 'EMAIL', 'ROL', 'CIUDAD', 'ESTADO', 'REGISTRO', 'CITAS', 'ACCIONES'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600, letterSpacing: '1px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.usuarios.map((u, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '12px', fontWeight: 600, color: '#ffffff' }}>{u.nombre}</td>
                    <td style={{ padding: '12px', color: '#888' }}>{u.email}</td>
                    <td style={{ padding: '12px', color: '#888' }}>{u.rol}</td>
                    <td style={{ padding: '12px', color: '#888' }}>{u.ciudad}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ background: u.activo ? '#22c55e22' : '#cc000022', color: u.activo ? '#22c55e' : '#cc0000', fontSize: '12px', fontWeight: 600, padding: '3px 10px', borderRadius: '4px' }}>
                        {u.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: '#888' }}>{new Date(u.fecha_creacion).toLocaleDateString('es-ES')}</td>
                    <td style={{ padding: '12px', fontWeight: 600, color: '#ffffff' }}>{u.total_citas}</td>
                    <td style={{ padding: '12px' }}>
                      <button style={{ background: '#cc000022', color: '#cc0000', border: 'none', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                        SUSPENDER
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}