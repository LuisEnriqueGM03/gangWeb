import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { URLS } from '../navigation/CONSTANTS';
import '../style/style.css';

const ListaMinijuegos = () => {
  const navigate = useNavigate();

  const minijuegos = [
    {
      id: 1,
      nombre: '🎯 Caja Registradora',
      descripcion: 'Llega al objetivo en 8 segundos moviendo el bloque 2x2 con flechas direccionales',
      dificultad: 'Difícil',
      color: 'linear-gradient(135deg, #2A9D8F, #3BB9AB)',
      ruta: URLS.CAJA_REGISTRADORA,
      disponible: true
    },
    {
      id: 2,
      nombre: '💣 Buscaminas',
      descripcion: 'Encuentra todas las minas en un tablero de 10x10. Nivel fácil con números del 1 al 3',
      dificultad: 'Fácil',
      color: 'linear-gradient(135deg, #E63946, #F77F00)',
      ruta: URLS.BUSCAMINAS,
      disponible: true
    },
    {
      id: 3,
      nombre: '🔌 Descruzar Cables',
      descripcion: 'Arrastra 2 nodos por cable para que no se crucen. Puntos fijos en los extremos. ¡30 segundos!',
      dificultad: 'Difícil',
      color: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
      ruta: URLS.DESCRUZAR_CABLES,
      disponible: true
    },
    {
      id: 4,
      nombre: '⌨️ Key Fast',
      descripcion: 'Presiona las 12 flechas del teclado en orden. ¡Rápido, solo tienes 6 segundos!',
      dificultad: 'Media',
      color: 'linear-gradient(135deg, #06B6D4, #3B82F6)',
      ruta: URLS.KEY_FAST,
      disponible: true
    },
    {
      id: 5,
      nombre: '🐌 Key Slow',
      descripcion: 'Presiona solo 8 flechas del teclado en orden. Tienes 6 segundos - más fácil!',
      dificultad: 'Fácil',
      color: 'linear-gradient(135deg, #10B981, #34D399)',
      ruta: URLS.KEY_SLOW,
      disponible: true
    },
    {
      id: 6,
      nombre: '🔓 Ganzuado',
      descripcion: 'Presiona E cuando la pelota roja pase por los cuadrados del rombo. ¡2 vueltas completas!',
      dificultad: 'Difícil',
      color: 'linear-gradient(135deg, #F59E0B, #F97316)',
      ruta: URLS.GANZUADO,
      disponible: true
    },
    {
      id: 7,
      nombre: '🔑 Código de Acceso',
      descripcion: 'Activa los switches correctos para alcanzar el código objetivo. ¡30 segundos!',
      dificultad: 'Media',
      color: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
      ruta: URLS.CODIGO_ACCESO,
      disponible: true
    },
    {
      id: 8,
      nombre: '🧠 Memorizar símbolos',
      descripcion: 'Memoriza 6 símbolos con sus posiciones en 5s. Identifica el correcto entre 3 opciones. ¡3 rondas para ganar!',
      dificultad: 'Media',
      color: 'linear-gradient(135deg, #14B8A6, #06B6D4)',
      ruta: URLS.MEMORIZAR,
      disponible: true
    },
    {
      id: 9,
      nombre: '🔐 Forzar la caja fuerte',
      descripcion: 'Gira 2 perillas para llegar al 100%. ¡Tienes 30 segundos para abrir la caja fuerte!',
      dificultad: 'Fácil',
      color: 'linear-gradient(135deg, #64748b, #475569)',
      ruta: URLS.CAJA_FUERTE,
      disponible: true
    },
    {
      id: 10,
      nombre: '🔢 Matriz de Seguridad',
      descripcion: 'Mueve el selector rojo con las flechas y presiona Enter cuando encuentres los 4 números. ¡La matriz se mueve!',
      dificultad: 'Media',
      color: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
      ruta: URLS.SECURE,
      disponible: true
    },
    {
      id: 11,
      nombre: '💻 BruteForce',
      descripcion: 'Matriz en movimiento con letras rojas aleatorias. ¡Captura todas presionando Enter en el momento perfecto!',
      dificultad: 'Difícil',
      color: 'linear-gradient(135deg, #10b981, #059669)',
      ruta: URLS.BRUTEFORCE,
      disponible: true
    },
    // Aquí se agregarán más minijuegos en el futuro
  ];

  return (
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(to bottom right, rgb(10, 35, 40), rgb(29, 126, 115), rgb(10, 35, 40))' }}>
      <Navbar />
      
      {/* Contenido */}
      <div className="relative z-10 container mx-auto px-4 py-8 pt-28">
        {/* Título */}
        <div className="text-center mb-12">
          <div className="backdrop-blur-xl inline-block px-8 py-4 rounded-2xl shadow-2xl border border-white/10" style={{ background: 'linear-gradient(to right, rgba(29, 126, 115, 0.95), rgba(42, 157, 143, 0.95))' }}>
            <h1 className="text-4xl md:text-5xl font-bold text-white">🎮 Minijuegos</h1>
            <p className="text-white/80 mt-2">Elige un desafío y pon a prueba tus habilidades</p>
          </div>
        </div>

        {/* Grid de Minijuegos */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {minijuegos.map((juego) => (
            <div
              key={juego.id}
              className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/10 overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-3xl"
            >
              {/* Header con gradiente */}
              <div 
                className="p-6 text-center"
                style={{ background: juego.color }}
              >
                <h2 className="text-3xl font-bold text-white mb-2">{juego.nombre}</h2>
                <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-white/20 text-white">
                  {juego.dificultad}
                </span>
              </div>

              {/* Contenido */}
              <div className="p-6">
                <p className="text-white/80 mb-6 text-center">
                  {juego.descripcion}
                </p>

                {/* Botón */}
                {juego.disponible ? (
                  <button
                    onClick={() => navigate(juego.ruta)}
                    className="w-full py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                    style={{
                      background: juego.color,
                      boxShadow: '0 10px 30px rgba(42, 157, 143, 0.3)'
                    }}
                  >
                    🎯 Jugar Ahora
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-3 rounded-xl font-semibold text-white/50 bg-white/10 cursor-not-allowed"
                  >
                    🔒 Próximamente
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Card de "Más Próximamente" */}
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl shadow-2xl border-2 border-dashed border-white/20 overflow-hidden flex items-center justify-center min-h-[300px]">
            <div className="text-center p-6">
              <div className="text-6xl mb-4">➕</div>
              <h3 className="text-2xl font-bold text-white/60 mb-2">Más Minijuegos</h3>
              <p className="text-white/40">Próximamente...</p>
            </div>
          </div>
        </div>

        {/* Botón Volver */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate(-1)}
            className="backdrop-blur-xl bg-white/10 hover:bg-white/20 rounded-xl px-8 py-3 border border-white/10 text-white font-semibold transition-all duration-300"
          >
            ← Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListaMinijuegos;
