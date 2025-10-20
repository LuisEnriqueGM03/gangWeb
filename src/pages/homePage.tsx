import { useNavigate } from 'react-router-dom';
import { URLS } from '../navigation/CONSTANTS';
import '../style/style.css';

const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigateToMapa = () => {
    navigate(URLS.MAPA);
  };

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: 'linear-gradient(to bottom right, rgb(10, 35, 40), rgb(29, 126, 115), rgb(10, 35, 40))' }}>
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" style={{ backgroundColor: '#3BB9AB' }}></div>
        <div className="absolute top-0 -right-4 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" style={{ backgroundColor: '#5FEDD8' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" style={{ backgroundColor: '#2A9D8F' }}></div>
      </div>

      {/* Content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Main Card */}
          <div className="backdrop-blur-xl bg-white/5 rounded-3xl shadow-2xl p-8 md:p-16 border border-white/10">
            {/* Icon/Logo Area */}
            <div className="flex justify-center mb-8">
              <img src="/ChangosLogo.png" alt="Changos Logo" className="w-64 h-64 object-contain drop-shadow-2xl" />
            </div>

            {/* Welcome Text */}
            <div className="text-center space-y-6 mb-12">
              <div className="space-y-4">
                <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text drop-shadow-2xl animate-gradient" style={{ backgroundImage: 'linear-gradient(to right, #5FEDD8, #3BB9AB, #7FF5E6)' }}>
                  ¡Bienvenido!
                </h1>
                <div className="flex justify-center">
                  <div className="h-1.5 w-32 rounded-full shadow-lg" style={{ background: 'linear-gradient(to right, #3BB9AB, #5FEDD8, #7FF5E6)' }}></div>
                </div>
              </div>
              
              <p className="text-2xl md:text-3xl text-gray-200 font-light tracking-wide">
                Gang Web Changos
              </p>
            </div>


            {/* Botones de Navegación */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {/* Botón Explorar Mapa */}
              <button
                onClick={handleNavigateToMapa}
                className="group relative p-8 rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-xl"
                style={{ background: 'linear-gradient(135deg, #2A9D8F, #3BB9AB)' }}
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">Explorar Mapa</h3>
                    <p className="text-sm text-white/80">Ubicaciones</p>
                  </div>
                  <svg className="w-6 h-6 text-white/60 group-hover:translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Botón Lista Items - Próximamente */}
              <div
                className="group relative p-8 rounded-2xl overflow-hidden transition-all duration-300 shadow-xl cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, rgba(42, 157, 143, 0.3), rgba(59, 185, 171, 0.3))' }}
              >
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full" style={{ backgroundColor: 'rgba(95, 237, 216, 0.3)', color: '#5FEDD8' }}>
                    Próximamente
                  </span>
                </div>
                <div className="relative z-10 flex flex-col items-center gap-4 opacity-60">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">Pawn Shop</h3>
                    <p className="text-sm text-white/70">Precios </p>
                  </div>
                </div>
              </div>

              {/* Botón Robos - Próximamente */}
              <div
                className="group relative p-8 rounded-2xl overflow-hidden transition-all duration-300 shadow-xl cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, rgba(42, 157, 143, 0.3), rgba(59, 185, 171, 0.3))' }}
              >
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full" style={{ backgroundColor: 'rgba(95, 237, 216, 0.3)', color: '#5FEDD8' }}>
                    Próximamente
                  </span>
                </div>
                <div className="relative z-10 flex flex-col items-center gap-4 opacity-60">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">Robos</h3>
                    <p className="text-sm text-white/70">Loots</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Dots */}
          <div className="mt-8 flex justify-center gap-3">
            <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: '#3BB9AB' }}></div>
            <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: '#5FEDD8', animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: '#7FF5E6', animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
