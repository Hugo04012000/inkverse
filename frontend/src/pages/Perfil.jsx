import { useAuth } from '../context/AuthContext';

const portfolio = [1, 2, 3, 4, 5, 6];

const reseñas = [
  { nombre: 'María G.', fecha: '2026-06-15', puntuacion: 5, comentario: 'Alex es increíble. El resultado fue exactamente lo que pedí, incluso mejor. Muy profesional y el estudio impecable. Ya tengo reservada la siguiente sesión.' },
  { nombre: 'Carlos R.', fecha: '2026-06-10', puntuacion: 5, comentario: 'Cuarta vez con Alex y siempre supera las expectativas. El blackwork geometric es su especialidad sin ninguna duda. 10/10.' },
  { nombre: 'Sara M.', fecha: '2026-06-02', puntuacion: 4, comentario: 'Gran trabajo, muy detallado. Un punto menos porque el tiempo de espera fue largo. Pero el resultado final es perfecto, muy feliz.' },
];

function Estrellas({ n }) {
  return <span style={{ color: '#d4a017' }}>{'★'.repeat(n)}{'☆'.repeat(5 - n)}</span>;
}

export default function Perfil() {
  const { user } = useAuth();

  return (
    <div>
      <div style={{ background: '#1a1a1a', borderRadius: '8px', padding: '32px', border: '1px solid #2a2a2a', marginBottom: '24px', position: 'relative' }}>
        <button style={{ position: 'absolute', top: '24px', right: '24px', background: '#cc0000', color: '#ffffff', fontWeight: 700, fontSize: '13px', padding: '10px 20px', borderRadius: '4px' }}>
          ✏ EDITAR PERFIL
        </button>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 700, color: '#ffffff', flexShrink: 0 }}>
            {user?.nombre?.charAt(0) || 'A'}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '4px', color: '#ffffff' }}>{user?.nombre?.toUpperCase() || 'ALEX VEGA'}</h1>
            <p style={{ color: '#666', marginBottom: '12px' }}>📍 {user?.ciudad || 'Madrid'}</p>
            <p style={{ color: '#888', fontSize: '14px', marginBottom: '16px', maxWidth: '500px' }}>
              Artista especializado en blackwork geométrico y neo-tradicional. 8 años de experiencia. Ex-ganador Convención Barcelona 2024.
            </p>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {['Blackwork', 'Geometric', 'Neo-tradicional'].map(e => (
                <span key={e} style={{ border: '1px solid #444', color: '#ffffff', fontSize: '12px', padding: '4px 10px', borderRadius: '4px' }}>{e}</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '32px' }}>
              {[['4.230', 'Seguidores'], ['312', 'Siguiendo'], ['127', 'Reseñas']].map(([val, label]) => (
                <div key={label}>
                  <span style={{ color: '#d4a017', fontWeight: 700, fontSize: '20px' }}>{val}</span>
                  <span style={{ color: '#666', fontSize: '13px', marginLeft: '6px' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '16px', letterSpacing: '1px', color: '#ffffff' }}>PORTFOLIO</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {portfolio.map(i => (
              <div key={i} style={{ aspectRatio: '1', background: '#222', borderRadius: '6px', cursor: 'pointer', border: '1px solid #2a2a2a' }} />
            ))}
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '1px', color: '#ffffff' }}>RESEÑAS</h2>
            <span style={{ color: '#cc0000', fontSize: '13px', cursor: 'pointer' }}>+ AÑADIR</span>
          </div>
          <div style={{ background: '#1a1a1a', borderRadius: '8px', padding: '20px', border: '1px solid #2a2a2a', marginBottom: '12px', textAlign: 'center' }}>
            <div style={{ color: '#d4a017', fontSize: '48px', fontWeight: 900 }}>4.7</div>
            <Estrellas n={4} />
            <div style={{ color: '#666', fontSize: '13px', marginTop: '4px' }}>3 valoraciones</div>
          </div>
          {reseñas.map((r, i) => (
            <div key={i} style={{ background: '#1a1a1a', borderRadius: '8px', padding: '16px', border: '1px solid #2a2a2a', marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, fontSize: '14px', color: '#ffffff' }}>{r.nombre}</span>
                <span style={{ color: '#666', fontSize: '12px' }}>{r.fecha}</span>
              </div>
              <Estrellas n={r.puntuacion} />
              <p style={{ color: '#888', fontSize: '13px', marginTop: '8px', lineHeight: 1.5 }}>{r.comentario}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}