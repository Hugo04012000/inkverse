import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login, register } from '../services/api';

export default function Landing() {
  const [modal, setModal] = useState(null);
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ nombre: '', email: '', password: '', ciudad: '', rol: 'artista' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      let res;
      if (tab === 'login') {
        res = await login(form.email, form.password);
      } else {
        res = await register(form);
      }
      loginUser(res.data.user, res.data.token);
      navigate('/panel');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al conectar');
    }
    setLoading(false);
  };

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff' }}>

      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', position: 'fixed', top: 0, width: '100%', zIndex: 100, background: 'rgba(10,10,10,0.9)' }}>
        <span style={{ color: '#cc0000', fontWeight: 900, fontSize: '22px', letterSpacing: '2px' }}>INKVERSE</span>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button onClick={() => { setModal(true); setTab('login'); }} style={{ background: 'none', color: '#fff', fontSize: '14px', padding: '8px 16px' }}>
            Iniciar sesión
          </button>
          <button onClick={() => { setModal(true); setTab('register'); }} style={{ background: '#cc0000', color: '#fff', fontSize: '14px', fontWeight: 700, padding: '10px 20px', borderRadius: '4px' }}>
            REGISTRARSE
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '0 20px' }}>
        <p style={{ color: '#cc0000', fontSize: '13px', letterSpacing: '4px', marginBottom: '24px' }}>LA PLATAFORMA PARA TATUADORES PROFESIONALES</p>
        <h1 style={{ fontSize: 'clamp(60px, 12vw, 140px)', fontWeight: 900, lineHeight: 1, marginBottom: '24px' }}>
          <span style={{ color: '#fff' }}>INK</span>
          <span style={{ color: '#cc0000' }}>VERSE</span>
        </h1>
        <p style={{ color: '#999', fontSize: '18px', maxWidth: '500px', marginBottom: '40px' }}>
          Gestiona tu estudio, conecta con la comunidad, comparte tus diseños y crece como artista.
        </p>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={() => { setModal(true); setTab('register'); }} style={{ background: '#cc0000', color: '#fff', fontWeight: 700, fontSize: '15px', padding: '14px 32px', borderRadius: '4px', letterSpacing: '1px' }}>
            EMPIEZA GRATIS →
          </button>
          <button style={{ background: '#1a1a1a', color: '#fff', fontSize: '15px', padding: '14px 32px', borderRadius: '4px', border: '1px solid #333' }}>
            Ver demo
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '60px', marginTop: '60px' }}>
          {[['2.400+', 'Artistas'], ['18.000+', 'Diseños'], ['95.000+', 'Citas gestionadas']].map(([num, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ color: '#d4a017', fontSize: '32px', fontWeight: 900 }}>{num}</div>
              <div style={{ color: '#666', fontSize: '13px' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Funcionalidades */}
      <div style={{ padding: '80px 40px', background: '#0d0d0d' }}>
        <p style={{ color: '#cc0000', fontSize: '13px', letterSpacing: '4px', textAlign: 'center', marginBottom: '16px' }}>FUNCIONALIDADES</p>
        <h2 style={{ fontSize: '48px', fontWeight: 900, textAlign: 'center', marginBottom: '60px', color: '#ffffff' }}>TODO LO QUE NECESITAS</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#222', maxWidth: '1000px', margin: '0 auto' }}>
          {[
            { icon: '📅', titulo: 'Gestión de Citas', desc: 'Boxes, tamaños y tiempos. Todo en un panel visual.' },
            { icon: '🎨', titulo: 'Galería de Diseños', desc: 'Comparte tus diseños y remixea el trabajo de la comunidad.' },
            { icon: '💬', titulo: 'Foro Profesional', desc: 'Técnicas, equipamiento, precios. Debate con otros artistas.' },
            { icon: '🏆', titulo: 'Competiciones', desc: 'Inscríbete a campeonatos e inspírate con los ganadores.' },
            { icon: '🎤', titulo: 'Eventos y Quedadas', desc: 'Masterclasses, workshops y meetups en toda España.' },
            { icon: '🏷', titulo: 'Marcas y Tintas', desc: 'Reviews, descuentos y novedades del sector.' },
            { icon: '🔍', titulo: 'Búsqueda con Filtros', desc: 'Encuentra artistas por ciudad, estilo y precio.' },
            { icon: '🛡', titulo: 'Panel Admin', desc: 'Gestión de usuarios, estadísticas y exportación de datos.' },
            { icon: '⭐', titulo: 'Valoraciones', desc: 'Sistema de reseñas verificado para artistas.' },
          ].map(({ icon, titulo, desc }) => (
            <div key={titulo} style={{ background: '#111', padding: '32px 24px' }}>
              <div style={{ color: '#cc0000', fontSize: '28px', marginBottom: '12px' }}>{icon}</div>
              <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '8px', color: '#ffffff' }}>{titulo}</div>
              <div style={{ color: '#666', fontSize: '13px', lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA final */}
      <div style={{ padding: '80px 40px', textAlign: 'center', background: '#110000' }}>
        <h2 style={{ fontSize: '48px', fontWeight: 900, marginBottom: '16px', color: '#ffffff' }}>¿LISTO PARA EMPEZAR?</h2>
        <p style={{ color: '#666', fontSize: '16px', marginBottom: '32px' }}>Únete a más de 2.400 tatuadores que ya usan INKVERSE.</p>
        <button onClick={() => { setModal(true); setTab('register'); }} style={{ background: '#cc0000', color: '#fff', fontWeight: 700, fontSize: '16px', padding: '16px 40px', borderRadius: '4px', letterSpacing: '1px' }}>
          CREAR CUENTA GRATIS
        </button>
      </div>

      {/* Footer con copyright */}
      <footer style={{ background: '#0a0a0a', borderTop: '1px solid #1a1a1a', padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#cc0000', fontWeight: 900, fontSize: '16px', letterSpacing: '2px' }}>INKVERSE</span>
        <p style={{ color: '#444', fontSize: '13px' }}>
          © 2026 INKVERSE. Todos los derechos reservados. Diseño y desarrollo protegidos por derechos de autor.
        </p>
        <div style={{ display: 'flex', gap: '24px' }}>
          <span style={{ color: '#444', fontSize: '13px', cursor: 'pointer' }}>Privacidad</span>
          <span style={{ color: '#444', fontSize: '13px', cursor: 'pointer' }}>Términos</span>
          <span style={{ color: '#444', fontSize: '13px', cursor: 'pointer' }}>Contacto</span>
        </div>
      </footer>

      {/* Modal login/register */}
      {modal && (
        <div onClick={() => setModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#1a1a1a', borderRadius: '8px', padding: '40px', width: '100%', maxWidth: '440px', position: 'relative', borderTop: '3px solid #cc0000' }}>
            <button onClick={() => setModal(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', color: '#666', fontSize: '20px' }}>✕</button>
            <p style={{ color: '#cc0000', fontSize: '11px', letterSpacing: '3px', marginBottom: '8px' }}>PLATAFORMA PARA TATUADORES</p>
            <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '24px', color: '#ffffff' }}>INKVERSE</h2>

            <div style={{ display: 'flex', marginBottom: '24px', borderRadius: '4px', overflow: 'hidden' }}>
              <button onClick={() => setTab('login')} style={{ flex: 1, padding: '12px', fontWeight: 700, fontSize: '13px', letterSpacing: '1px', background: tab === 'login' ? '#cc0000' : '#111', color: '#fff', border: '1px solid #333' }}>
                INICIAR SESIÓN
              </button>
              <button onClick={() => setTab('register')} style={{ flex: 1, padding: '12px', fontWeight: 700, fontSize: '13px', letterSpacing: '1px', background: tab === 'register' ? '#cc0000' : '#111', color: '#fff', border: '1px solid #333' }}>
                REGISTRARSE
              </button>
            </div>

            {tab === 'register' && (
              <input placeholder="Nombre artístico" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
                style={{ width: '100%', background: '#111', border: '1px solid #333', borderRadius: '4px', padding: '12px 16px', color: '#fff', marginBottom: '12px', fontSize: '14px' }} />
            )}
            <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              style={{ width: '100%', background: '#111', border: '1px solid #333', borderRadius: '4px', padding: '12px 16px', color: '#fff', marginBottom: '12px', fontSize: '14px' }} />
            <input placeholder="Contraseña" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              style={{ width: '100%', background: '#111', border: '1px solid #333', borderRadius: '4px', padding: '12px 16px', color: '#fff', marginBottom: '12px', fontSize: '14px' }} />
            {tab === 'register' && (
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <input placeholder="Ciudad" value={form.ciudad} onChange={e => setForm({ ...form, ciudad: e.target.value })}
                  style={{ flex: 1, background: '#111', border: '1px solid #333', borderRadius: '4px', padding: '12px 16px', color: '#fff', fontSize: '14px' }} />
                <select value={form.rol} onChange={e => setForm({ ...form, rol: e.target.value })}
                  style={{ flex: 1, background: '#111', border: '1px solid #333', borderRadius: '4px', padding: '12px 16px', color: '#fff', fontSize: '14px' }}>
                  <option value="artista">Artista</option>
                  <option value="cliente">Cliente</option>
                </select>
              </div>
            )}

            {error && <p style={{ color: '#cc0000', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}

            <button onClick={handleSubmit} disabled={loading}
              style={{ width: '100%', background: '#cc0000', color: '#fff', fontWeight: 700, fontSize: '15px', padding: '14px', borderRadius: '4px', letterSpacing: '1px', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'CARGANDO...' : tab === 'login' ? 'ENTRAR' : 'CREAR CUENTA'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}