import { useNavigate } from 'react-router-dom';
import { URLS } from '../navigation/CONSTANTS';
import '../style/style.css';

const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigateToMapa = () => {
    navigate(URLS.MAPA);
  };

  const handleNavigateToPawnShop = () => {
    navigate(URLS.PAWNSHOP);
  };

  const handleNavigateToRobos = () => {
    navigate(URLS.ROBOS);
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
      <div className="relative min-h-screen flex items-center justify-center px-4 py-8 sm:p-6 md:p-8">
        <div className="max-w-5xl w-full">
          {/* Main Card */}
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-10 md:p-16 border border-white/10">
            {/* Icon/Logo Area */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <img src="/ChangosLogo.png" alt="Changos Logo" className="w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 object-contain drop-shadow-2xl" />
            </div>

            {/* Welcome Text */}
            <div className="text-center space-y-4 sm:space-y-6 mb-8 sm:mb-10 md:mb-12">
              <div className="space-y-3 sm:space-y-4">
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text drop-shadow-2xl animate-gradient" style={{ backgroundImage: 'linear-gradient(to right, #5FEDD8, #3BB9AB, #7FF5E6)' }}>
                  ¡Bienvenido!
                </h1>
                <div className="flex justify-center">
                  <div className="h-1 sm:h-1.5 w-24 sm:w-32 rounded-full shadow-lg" style={{ background: 'linear-gradient(to right, #3BB9AB, #5FEDD8, #7FF5E6)' }}></div>
                </div>
              </div>
              
              <p className="text-xl sm:text-2xl md:text-3xl text-gray-200 font-light tracking-wide">
                Gang Web Changos
              </p>
            </div>


            {/* Botones de Navegación */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mt-8 sm:mt-10 md:mt-12">
              {/* Botón Explorar Mapa */}
              <button
                onClick={handleNavigateToMapa}
                className="group relative p-6 sm:p-7 md:p-8 rounded-xl sm:rounded-2xl overflow-hidden transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl"
                style={{ background: 'linear-gradient(135deg, #2A9D8F, #3BB9AB)' }}
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex flex-col items-center gap-3 sm:gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">Explorar Mapa</h3>
                    <p className="text-xs sm:text-sm text-white/80">Ubicaciones</p>
                  </div>
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white/60 group-hover:translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Botón Pawn Shop */}
              <button
                onClick={handleNavigateToPawnShop}
                className="group relative p-6 sm:p-7 md:p-8 rounded-xl sm:rounded-2xl overflow-hidden transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl"
                style={{ background: 'linear-gradient(135deg, #2A9D8F, #3BB9AB)' }}
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex flex-col items-center gap-3 sm:gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">Pawn Shop</h3>
                    <p className="text-xs sm:text-sm text-white/80">Precios</p>
                  </div>
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white/60 group-hover:translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Botón Robos - Disponible */}
              <button
                onClick={handleNavigateToRobos}
                className="group relative p-6 sm:p-7 md:p-8 rounded-xl sm:rounded-2xl overflow-hidden transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl sm:col-span-2 lg:col-span-1"
                style={{ background: 'linear-gradient(135deg, #2A9D8F, #3BB9AB)' }}
              >
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                  <span className="px-2.5 py-1 sm:px-3 text-xs font-semibold rounded-full animate-pulse" style={{ backgroundColor: 'rgba(95, 237, 216, 0.3)', color: '#5FEDD8' }}>
                    ¡Disponible!
                  </span>
                </div>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex flex-col items-center gap-3 sm:gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">Robos</h3>
                    <p className="text-xs sm:text-sm text-white/80">Loots</p>
                  </div>
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white/60 group-hover:translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          {/* Footer Dots */}
          <div className="mt-6 sm:mt-8 flex justify-center gap-2 sm:gap-3">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full animate-bounce" style={{ backgroundColor: '#3BB9AB' }}></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full animate-bounce" style={{ backgroundColor: '#5FEDD8', animationDelay: '0.1s' }}></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full animate-bounce" style={{ backgroundColor: '#7FF5E6', animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
