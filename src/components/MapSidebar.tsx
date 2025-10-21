import { useState, useEffect } from 'react';

interface MapSidebarProps {
  searchTerm: string;
  searchResults: any[];
  mapType: string;
  onSearch: (term: string) => void;
  onSearchResultClick: (id: string) => void;
  onMapTypeChange: (type: string) => void;
  onReload: () => void;
}

const MapSidebar = ({
  searchTerm,
  searchResults,
  mapType,
  onSearch,
  onSearchResultClick,
  onMapTypeChange,
  onReload
}: MapSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Mover el panel de categorías dentro del sidebar en mobile
  useEffect(() => {
    const moveCategoriesToSidebar = () => {
      const isMobile = window.innerWidth <= 768;
      const container = document.getElementById('sidebar-categories-container');
      const types = document.getElementById('types');
      const typeDetails = document.getElementById('typeDetails');

      if (isMobile && container) {
        // Mover #types dentro del sidebar si existe
        if (types && !container.contains(types)) {
          container.appendChild(types);
        }
        // Mover #typeDetails dentro del sidebar si existe
        if (typeDetails && !container.contains(typeDetails)) {
          container.appendChild(typeDetails);
        }
      } else {
        // Restaurar posición original en desktop
        const mapaPage = document.querySelector('.mapa-page');
        if (mapaPage) {
          if (types && !mapaPage.contains(types)) {
            mapaPage.appendChild(types);
          }
          if (typeDetails && !mapaPage.contains(typeDetails)) {
            mapaPage.appendChild(typeDetails);
          }
        }
      }
    };

    // Ejecutar al montar y cuando cambie el tamaño de ventana
    moveCategoriesToSidebar();
    window.addEventListener('resize', moveCategoriesToSidebar);

    // Usar MutationObserver para detectar cuando se agregan los elementos
    const observer = new MutationObserver(moveCategoriesToSidebar);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('resize', moveCategoriesToSidebar);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Settings Button (Tuerca) / Close Button (X) - Solo visible en mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 left-4 z-[60] md:hidden group"
        style={{
          background: 'linear-gradient(to right, rgba(10, 35, 40, 0.95), rgba(29, 126, 115, 0.95), rgba(10, 35, 40, 0.95))',
          borderRadius: '12px',
          padding: '0.75rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        {!isOpen ? (
          // Tuerca cuando está cerrado
          <svg 
            className="w-6 h-6 text-white transition-all duration-300"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        ) : (
          // X cuando está abierto
          <svg 
            className="w-6 h-6 text-white transition-all duration-300"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2.5} 
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
      </button>

      {/* Overlay - Solo en mobile cuando está abierto */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar Container - Solo mobile */}
      <div
        className={`
          fixed top-20 left-0 h-[calc(100vh-5rem)] z-40 bg-white
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:hidden
          w-80
          shadow-2xl
          overflow-y-auto
        `}
      >
        <div className="h-full p-4 pt-16 space-y-4">
          {/* Buscador Mobile */}
          <div className="w-full">
            <div
              className="backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-4"
              style={{
                background: 'linear-gradient(to right, rgba(10, 35, 40, 0.95), rgba(29, 126, 115, 0.95), rgba(10, 35, 40, 0.95))',
                boxShadow: '0 25px 50px -12px rgba(59, 185, 171, 0.3)'
              }}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => onSearch(e.target.value)}
                  placeholder="Buscar ubicaciones..."
                  className="w-full pl-14 pr-4 py-4 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all duration-300"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 10px 30px -10px rgba(59, 185, 171, 0.2)',
                    fontSize: '16px'
                  }}
                />
                {searchTerm && (
                  <button
                    onClick={() => onSearch('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-white hover:text-white/80 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Resultados de búsqueda */}
              {searchResults.length > 0 && (
                <div className="mt-2 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border-2 overflow-hidden animate-slideUp" style={{ borderColor: '#5FEDD8' }}>
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => {
                        onSearchResultClick(result.id);
                        setIsOpen(false);
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 transition-colors text-left border-b border-gray-100 last:border-b-0"
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(95, 237, 216, 0.1)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <svg className="w-5 h-5 flex-shrink-0" style={{ color: '#3BB9AB' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{result.title}</div>
                        <div className="text-xs text-gray-500">{result.type}</div>
                      </div>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Botón Recargar Mapa Mobile */}
          <div>
            <button
              onClick={() => {
                onReload();
                setIsOpen(false);
              }}
              className="w-full group"
            >
              <div className="flex items-center gap-3 text-white px-6 py-3 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300" style={{ background: 'linear-gradient(to right, rgba(10, 35, 40, 0.95), rgba(29, 126, 115, 0.95), rgba(10, 35, 40, 0.95))', boxShadow: '0 25px 50px -12px rgba(59, 185, 171, 0.5)' }}>
                <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="font-semibold">Recargar Mapa</span>
              </div>
            </button>
          </div>

          {/* Panel de Categorías - Dentro del sidebar móvil */}
          <div id="sidebar-categories-container">
            {/* El contenido de #types se renderizará aquí en mobile */}
          </div>

          {/* Botones de tipo de mapa Mobile */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Tipo de Mapa</h3>
            <button
              onClick={() => {
                onMapTypeChange('Atlas');
                setIsOpen(false);
              }}
              className={`w-full px-5 py-3 rounded-lg shadow-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                mapType === 'Atlas' ? 'text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              style={mapType === 'Atlas' ? { background: 'linear-gradient(to right, rgba(10, 35, 40, 0.95), rgba(29, 126, 115, 0.95), rgba(10, 35, 40, 0.95))', boxShadow: '0 25px 50px -12px rgba(59, 185, 171, 0.5)' } : {}}
            >
              🗺️ Atlas
            </button>
            <button
              onClick={() => {
                onMapTypeChange('Road');
                setIsOpen(false);
              }}
              className={`w-full px-5 py-3 rounded-lg shadow-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                mapType === 'Road' ? 'text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              style={mapType === 'Road' ? { background: 'linear-gradient(to right, rgba(10, 35, 40, 0.95), rgba(29, 126, 115, 0.95), rgba(10, 35, 40, 0.95))', boxShadow: '0 25px 50px -12px rgba(59, 185, 171, 0.5)' } : {}}
            >
              🛣️ Road
            </button>
            <button
              onClick={() => {
                onMapTypeChange('Satellite');
                setIsOpen(false);
              }}
              className={`w-full px-5 py-3 rounded-lg shadow-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                mapType === 'Satellite' ? 'text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              style={mapType === 'Satellite' ? { background: 'linear-gradient(to right, rgba(10, 35, 40, 0.95), rgba(29, 126, 115, 0.95), rgba(10, 35, 40, 0.95))', boxShadow: '0 25px 50px -12px rgba(59, 185, 171, 0.5)' } : {}}
            >
              🛰️ Satellite
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP ELEMENTS - Fuera del sidebar móvil */}
      
      {/* Desktop: Buscador */}
      <div className="hidden md:block fixed top-24 left-6 z-[9999]" style={{ width: '340px' }}>
        <div
          className="backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-6"
          style={{
            background: 'linear-gradient(to right, rgba(10, 35, 40, 0.95), rgba(29, 126, 115, 0.95), rgba(10, 35, 40, 0.95))',
            boxShadow: '0 25px 50px -12px rgba(59, 185, 171, 0.3)'
          }}
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Buscar ubicaciones..."
              className="w-full pl-14 pr-4 py-4 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all duration-300"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 10px 30px -10px rgba(59, 185, 171, 0.2)',
                fontSize: '16px'
              }}
            />
            {searchTerm && (
              <button
                onClick={() => onSearch('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-white hover:text-white/80 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Resultados de búsqueda Desktop */}
          {searchResults.length > 0 && (
            <div className="mt-2 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border-2 overflow-hidden animate-slideUp" style={{ borderColor: '#5FEDD8' }}>
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => onSearchResultClick(result.id)}
                  className="w-full px-4 py-3 flex items-center gap-3 transition-colors text-left border-b border-gray-100 last:border-b-0"
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(95, 237, 216, 0.1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <svg className="w-5 h-5 flex-shrink-0" style={{ color: '#3BB9AB' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{result.title}</div>
                    <div className="text-xs text-gray-500">{result.type}</div>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desktop: Botón Recargar */}
      <div className="hidden md:block fixed top-24 right-6 z-[9999]">
        <button onClick={onReload} className="group">
          <div className="flex items-center gap-3 text-white px-6 py-3 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300" style={{ background: 'linear-gradient(to right, rgba(10, 35, 40, 0.95), rgba(29, 126, 115, 0.95), rgba(10, 35, 40, 0.95))', boxShadow: '0 25px 50px -12px rgba(59, 185, 171, 0.5)' }}>
            <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="font-semibold">Recargar Mapa</span>
          </div>
        </button>
      </div>

      {/* Desktop: Botones tipo de mapa */}
      <div className="hidden md:flex fixed bottom-6 right-6 z-[9999] flex-col gap-2">
            <button
              onClick={() => onMapTypeChange('Atlas')}
              className={`px-5 py-3 rounded-lg shadow-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                mapType === 'Atlas' ? 'text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              style={mapType === 'Atlas' ? { background: 'linear-gradient(to right, rgba(10, 35, 40, 0.95), rgba(29, 126, 115, 0.95), rgba(10, 35, 40, 0.95))', boxShadow: '0 25px 50px -12px rgba(59, 185, 171, 0.5)' } : {}}
            >
              🗺️ Atlas
            </button>
            <button
              onClick={() => onMapTypeChange('Road')}
              className={`px-5 py-3 rounded-lg shadow-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                mapType === 'Road' ? 'text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              style={mapType === 'Road' ? { background: 'linear-gradient(to right, rgba(10, 35, 40, 0.95), rgba(29, 126, 115, 0.95), rgba(10, 35, 40, 0.95))', boxShadow: '0 25px 50px -12px rgba(59, 185, 171, 0.5)' } : {}}
            >
              🛣️ Road
            </button>
            <button
              onClick={() => onMapTypeChange('Satellite')}
              className={`px-5 py-3 rounded-lg shadow-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                mapType === 'Satellite' ? 'text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              style={mapType === 'Satellite' ? { background: 'linear-gradient(to right, rgba(10, 35, 40, 0.95), rgba(29, 126, 115, 0.95), rgba(10, 35, 40, 0.95))', boxShadow: '0 25px 50px -12px rgba(59, 185, 171, 0.5)' } : {}}
            >
              🛰️ Satellite
            </button>
      </div>
    </>
  );
};

export default MapSidebar;
