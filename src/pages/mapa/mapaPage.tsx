import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../style/mapa.css';

const MapaPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [clickCoords, setClickCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Chester',
    notes: '',
    image: ''
  });

  useEffect(() => {
    // Variable para rastrear si el componente está montado
    let isMounted = true;

    // Cargar scripts en secuencia estricta (sin async para garantizar orden)
    const loadScript = (src: string): Promise<void> =>
      new Promise((resolve, reject) => {
        // Evitar cargar duplicados
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
          console.log(`⏭️ Script ya cargado: ${src}`);
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = src;
        // NO usar async para garantizar ejecución en orden
        script.onload = () => {
          if (isMounted) {
            console.log(`✅ Loaded: ${src}`);
            resolve();
          }
        };
        script.onerror = () => reject(new Error(`Failed to load: ${src}`));
        document.body.appendChild(script);
      });

    const initializeMap = async () => {
      try {
        // Verificar si ya se inicializó antes
        if ((window as any).mapInitialized) {
          console.log('⏭️ Mapa ya inicializado, reutilizando...');
          return;
        }

        console.log('🚀 Starting map initialization...');
        
        // 1. Cargar librerías legacy en orden
        await loadScript('/utils/mapa/libs/jquery-min.js');
        await loadScript('/utils/mapa/libs/underscore-min.js');
        await loadScript('/utils/mapa/libs/backbone-min.js');
        await loadScript('/utils/mapa/libs/handlebars.js');

        // 2. Cargar Google Maps y esperar a que esté listo
        await loadScript('https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false');
        
        // Verificar que Google Maps está disponible
        if (typeof google === 'undefined') {
          throw new Error('Google Maps no se cargó correctamente');
        }
        console.log('✅ Google Maps disponible');

        // 3. Cargar app.js DESPUÉS de confirmar que todo está listo
        await loadScript('/utils/mapa/app.js');
        
        // Marcar como inicializado
        (window as any).mapInitialized = true;
        
        console.log('✅ Mapa inicializado correctamente');
      } catch (error) {
        console.error('❌ Error loading map scripts:', error);
      }
    };

    initializeMap();

    return () => {
      // Marcar componente como desmontado
      isMounted = false;
    };
  }, []);

  // Detectar click derecho en el mapa
  useEffect(() => {
    const handleMapRightClick = (e: MouseEvent) => {
      e.preventDefault();
      const mapElement = document.getElementById('map');
      if (mapElement && mapElement.contains(e.target as Node)) {
        // Obtener coordenadas del click (esto lo obtendremos desde el mapa de Google)
        // Por ahora mostramos el formulario
        setShowForm(true);
        
        // Capturar coordenadas desde Google Maps (se hará después de que el mapa esté cargado)
        const map = (window as any).map;
        if (map) {
          const coords = map.getCenter();
          setClickCoords({
            lat: coords.lat(),
            lng: coords.lng()
          });
        }
      }
    };

    document.addEventListener('contextmenu', handleMapRightClick);
    return () => {
      document.removeEventListener('contextmenu', handleMapRightClick);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clickCoords) return;

    // Obtener locations actuales para calcular order
    const response = await fetch('/data/locations.json');
    const locations = await response.json();
    
    // Calcular nuevo order
    const maxOrder = Math.max(...locations.map((l: any) => l.order || 0), 0);
    const newOrder = maxOrder + 1;

    // Crear nuevo punto sin ID (se agregará manualmente)
    const newLocation = {
      type: formData.type,
      title: formData.title,
      notes: formData.notes,
      order: newOrder,
      lat: parseFloat(clickCoords.lat.toFixed(3)),
      lng: parseFloat(clickCoords.lng.toFixed(3)),
      image: formData.image
    };

    // Convertir a JSON formateado
    const jsonString = JSON.stringify(newLocation, null, 2);
    
    // Copiar al portapapeles
    try {
      await navigator.clipboard.writeText(jsonString);
      
      // Mostrar mensaje de éxito
      alert('✅ JSON copiado al portapapeles!\n\nAhora puedes pegarlo en locations.json');
      
      // Cerrar el formulario
      setShowForm(false);
      
      // Resetear formulario
      setFormData({
        title: '',
        type: 'Chester',
        notes: '',
        image: ''
      });
      setClickCoords(null);
      
    } catch (err) {
      console.error('Error al copiar:', err);
      // Fallback: mostrar el JSON en un prompt
      prompt('Copia este JSON:', jsonString);
    }
  };

  return (
    <div className="mapa-page relative">
      {/* Botón flotante para volver a Home */}
      <Link
        to="/"
        className="fixed top-6 left-6 z-[9999] group"
      >
        <div className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300">
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-semibold">Inicio</span>
        </div>
      </Link>

      {/* Título del mapa */}
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999]">
        <div className="bg-gradient-to-r from-slate-900/95 to-purple-900/95 backdrop-blur-xl text-white px-8 py-4 rounded-2xl shadow-2xl border border-white/10">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Mapa Interactivo GTA V
            </h1>
          </div>
        </div>
      </div>

      <div id="map" className="w-full h-screen" style={{ background: '#2596be' }}></div>

      <div id="tour-info"></div>

      {/* Handlebars Templates - Se quedan como script type="text/x-handlebars-template" */}
      <script type="text/x-handlebars-template" id="categoriesTemplate">
        {`{{#each categories}}
			<section class="type">
				<h3>{{name}}</h3>
				<ul>
					{{#each types}}
						<li><label><input type="checkbox" {{#if enabled}}checked{{/if}} value="{{name}}"> <img src="{{icon}}"> {{name}}</label> <a href="#" class="details" data-name="{{name}}"><i class="icon-chevron-sign-right"></i></a></li>
					{{/each}}
				</ul>
			</section>
		{{/each}}`}
      </script>

      <script type="text/x-handlebars-template" id="categoryDetailsTemplate">
        {`<section class="type">
			<h3><a href="#" class="back details"><i class="icon-chevron-sign-left"></i></a> {{type.name}}</h3>
			<ul>
				{{#each locations}}
					<li data-id="{{id}}"><label>{{title}}</label></li>
				{{/each}}
			</ul>
		</section>`}
      </script>

      <script type="text/x-handlebars-template" id="markerPopupTemplate2">
        {`<div id="info-window" class="modern-popup">
			<div class="popup-container">
				<!-- Header con gradiente -->
				<div class="popup-header">
					<div class="header-icon">📍</div>
					<h3 class="popup-title">{{title}}</h3>
				</div>

				<!-- Imagen principal -->
				{{#if image}}
					<div class="popup-image-container">
						<img src="{{image}}" class="popup-main-image" alt="{{title}}">
						<div class="image-overlay"></div>
					</div>
				{{/if}}

				<!-- Contenido -->
				<div class="popup-content">
					{{#if notes}}
						<div class="popup-description">
							<div class="description-icon">📝</div>
							<p class="description-text">{{notes}}</p>
						</div>
					{{/if}}
				</div>
			</div>
		</div>`}
      </script>

      <div id="typeDetails" className="types"></div>

      <div id="types" className="types"></div>

      {/* Formulario para crear nuevo punto */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden transform animate-slideUp">
            {/* Header del formulario */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Crear Punto</h2>
                    <p className="text-white/80 text-sm">Agrega una nueva ubicación al mapa</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Título */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <span className="text-lg">✏️</span>
                  Título
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none"
                  placeholder="Ej: Obey Tailgator"
                />
              </div>

              {/* Tipo/Categoría */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <span className="text-lg">🏷️</span>
                  Categoría
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 outline-none bg-white"
                >
                  <option value="Chester">Chester</option>
                </select>
              </div>

              {/* Notas */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <span className="text-lg">📝</span>
                  Descripción
                </label>
                <textarea
                  required
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 outline-none resize-none"
                  placeholder="Escribe una descripción detallada..."
                />
              </div>

              {/* Imagen URL */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <span className="text-lg">🖼️</span>
                  URL de Imagen
                </label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all duration-300 outline-none"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                {formData.image && (
                  <div className="mt-3 rounded-xl overflow-hidden border-2 border-gray-100">
                    <img src={formData.image} alt="Preview" className="w-full h-48 object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
              </div>

              {/* Coordenadas (solo mostrar) */}
              {clickCoords && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border-2 border-blue-100">
                  <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <span>🗺️</span>
                    Coordenadas
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/60 px-3 py-2 rounded-lg">
                      <span className="text-xs text-gray-500 block">Latitud</span>
                      <span className="text-sm font-mono font-semibold text-gray-800">{clickCoords.lat.toFixed(3)}</span>
                    </div>
                    <div className="bg-white/60 px-3 py-2 rounded-lg">
                      <span className="text-xs text-gray-500 block">Longitud</span>
                      <span className="text-sm font-mono font-semibold text-gray-800">{clickCoords.lng.toFixed(3)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copiar JSON
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapaPage;
