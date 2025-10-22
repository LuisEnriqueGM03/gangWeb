import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import MapSidebar from '../../components/MapSidebar';
import LocationPopup from '../../components/LocationPopup';
import '../../style/style.css';

interface Category {
  name: string;
  icon: string;
  type: string;
  enabled: boolean;
}

const MapaPage = () => {
  const [showButtons, setShowButtons] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [clickCoords, setClickCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [tempMarker, setTempMarker] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mapType, setMapType] = useState<string>('Atlas');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [currentInfoWindow, setCurrentInfoWindow] = useState<any>(null);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [locationPopupData, setLocationPopupData] = useState<{
    title: string;
    notes?: string;
    image?: string;
    type?: string;
  }>({ title: '' });
  const [formData, setFormData] = useState({
    title: '',
    type: 'Chester',
    notes: '',
    image: ''
  });

  // Cargar categorías
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/data/categories.json');
        const data = await response.json();
        setCategories(data);
        
        // Establecer la primera categoría como default
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, type: data[0].name }));
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    
    loadCategories();
  }, []);

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

  // Ocultar modal de error de Google Maps
  useEffect(() => {
    const hideGoogleMapsError = () => {
      // Buscar y ocultar el modal de error
      const errorModals = document.querySelectorAll('div[style*="z-index"]');
      errorModals.forEach((modal) => {
        const modalElement = modal as HTMLElement;
        const text = modalElement.textContent || '';
        if (text.includes('Google Maps') || text.includes('correctamente') || text.includes('Aceptar')) {
          modalElement.style.display = 'none';
          modalElement.style.visibility = 'hidden';
          modalElement.remove();
        }
      });
    };

    // Ejecutar inmediatamente
    hideGoogleMapsError();

    // Observar cambios en el DOM para eliminar el modal si aparece
    const observer = new MutationObserver(() => {
      hideGoogleMapsError();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Ejecutar periódicamente como respaldo
    const interval = setInterval(hideGoogleMapsError, 100);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  // Detectar click derecho en el mapa usando el evento de Google Maps
  useEffect(() => {
    let listener: any = null;
    
    const setupMapListener = () => {
      const map = (window as any).map;
      const google = (window as any).google;
      
      if (!map || !google) {
        // Esperar a que el mapa se cargue
        setTimeout(setupMapListener, 500);
        return;
      }

      console.log('🗺️ Configurando listener de mapa...');

      // Agregar listener para capturar el evento del click derecho
      listener = google.maps.event.addListener(map, 'rightclick', (e: any) => {
        console.log('🖱️ Click derecho detectado!', e.latLng);
        
        if (!e.latLng) return;
        
        // Limpiar marcadores anteriores (solo permitir uno)
        const locs = (window as any).locs;
        if (locs && locs.length > 0) {
          console.log('🧹 Limpiando marcadores anteriores:', locs.length);
          locs.forEach((marker: any) => marker.setMap(null));
          locs.length = 0;
        }
        
        // Capturar coordenadas del click
        const coords = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        };
        console.log('📍 Coordenadas capturadas:', coords);
        setClickCoords(coords);
        
        // Crear nuestro propio marcador en lugar de esperar al legacy
        const marker = new google.maps.Marker({
          map: map,
          draggable: true,
          position: e.latLng,
          animation: google.maps.Animation.DROP
        });
        
        // Agregar al array de locs
        if (!locs) {
          (window as any).locs = [];
        }
        (window as any).locs.push(marker);
        
        console.log('✅ Marcador creado y visible');
        setTempMarker(marker);
        
        // Mostrar botones flotantes
        console.log('👆 Mostrando botones');
        setShowButtons(true);
      });
    };

    setupMapListener();

    return () => {
      if (listener && (window as any).google?.maps?.event) {
        console.log('🧹 Limpiando listener');
        (window as any).google.maps.event.removeListener(listener);
      }
    };
  }, []); // Sin dependencias para que se configure solo una vez

  // Interceptar clics en marcadores para mostrar popup móvil
  useEffect(() => {
    const setupLocationClickListener = () => {
      const Vent = (window as any).Vent;
      
      if (!Vent) {
        console.log('⏳ Esperando Vent...');
        setTimeout(setupLocationClickListener, 500);
        return;
      }

      console.log('📍 Configurando listener para clics en ubicaciones...');

      // Interceptar el evento location:clicked de Backbone
      const handleLocationClick = (location: any) => {
        const isMobile = window.innerWidth <= 768;
        console.log('🎯 Location clicked!', {
          isMobile,
          width: window.innerWidth,
          location: location
        });
        
        if (isMobile) {
          console.log('📱 ES MÓVIL - Mostrando popup personalizado');
          
          try {
            const title = location.get('title') || '';
            const notes = location.get('notes') || '';
            const image = location.get('image') || '';
            const type = location.get('type') || '';
            
            console.log('📦 Datos extraídos:', { title, notes, image, type });
            
            // Prevenir que se abra el InfoWindow de Google Maps
            const mapView = (window as any).mapView;
            if (mapView && mapView.currentInfoWindow) {
              mapView.currentInfoWindow.close();
              console.log('❌ InfoWindow cerrado');
            }
            
            // Mostrar nuestro popup personalizado
            setLocationPopupData({ title, notes, image, type });
            setShowLocationPopup(true);
            console.log('✅ Popup state actualizado');
          } catch (error) {
            console.error('❌ Error al procesar location:', error);
          }
        } else {
          console.log('💻 ES DESKTOP - Usando InfoWindow normal');
        }
      };

      Vent.on('location:clicked', handleLocationClick);
      console.log('✅ Listener configurado exitosamente');
    };

    setupLocationClickListener();

    return () => {
      const Vent = (window as any).Vent;
      if (Vent) {
        Vent.off('location:clicked');
        console.log('🧹 Listener removido');
      }
    };
  }, []);

  const handleCreatePoint = () => {
    // Mostrar formulario y ocultar botones
    setShowButtons(false);
    setShowForm(true);
  };

  const handleMapTypeChange = (type: string) => {
    const map = (window as any).map;
    if (map) {
      map.setMapTypeId(type);
      setMapType(type);
      console.log('🗺️ Tipo de mapa cambiado a:', type);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    if (!term) {
      setSearchResults([]);
      return;
    }
    
    // Buscar en las ubicaciones
    const locations = (window as any).locations;
    if (locations && locations.models) {
      const results = locations.models
        .filter((model: any) => {
          const title = model.get('title') || '';
          return title.toLowerCase().includes(term.toLowerCase());
        })
        .map((model: any) => ({
          id: model.get('id') || model.cid,
          title: model.get('title'),
          type: model.get('type')
        }))
        .slice(0, 5); // Limitar a 5 resultados
      
      setSearchResults(results);
      console.log('🔍 Resultados encontrados:', results.length);
    }
  };

  const handleSearchResultClick = (locationId: string) => {
    console.log('🔍 Click en resultado de búsqueda:', locationId);
    const locations = (window as any).locations;
    const google = (window as any).google;
    const isMobile = window.innerWidth <= 768;
    
    if (locations && google) {
      let location = locations.get(locationId);
      
      // Si no se encuentra por id, buscar por cid
      if (!location) {
        location = locations.find((model: any) => model.cid === locationId);
      }
      
      if (location && (window as any).map) {
        const title = location.get('title');
        const notes = location.get('notes') || '';
        const image = location.get('image') || '';
        const type = location.get('type') || '';
        
        console.log(`✅ Navegando a: ${title} y abriendo popup`);
        
        // Hacer zoom y centrar
        const marker = location.get('marker');
        if (marker) {
          const map = (window as any).map;
          map.panTo(marker.getPosition());
          map.setZoom(5);
          
          // Cerrar popup anterior si existe
          if (currentInfoWindow) {
            currentInfoWindow.close();
            console.log('🔴 Popup anterior cerrado');
          }
          
          // En móvil, usar el popup personalizado
          if (isMobile) {
            setLocationPopupData({ title, notes, image, type });
            setShowLocationPopup(true);
            console.log('📱 Mostrando popup móvil');
          } else {
            // En desktop, usar InfoWindow de Google Maps
            const popupContent = `
              <div class="modern-popup">
                <div class="popup-container">
                  <div class="popup-header">
                    <div class="header-icon">📍</div>
                    <h3 class="popup-title">${title}</h3>
                  </div>
                  ${image ? `
                    <div class="popup-image-container">
                      <img src="${image}" class="popup-main-image" alt="${title}">
                      <div class="image-overlay"></div>
                    </div>
                  ` : ''}
                  <div class="popup-content">
                    ${notes ? `
                      <div class="popup-description">
                        <div class="description-icon">📝</div>
                        <p class="description-text">${notes}</p>
                      </div>
                    ` : ''}
                  </div>
                </div>
              </div>
            `;
            
            const infoWindow = new google.maps.InfoWindow({
              content: popupContent
            });
            
            infoWindow.open(map, marker);
            setCurrentInfoWindow(infoWindow);
            console.log('💻 InfoWindow abierto en desktop');
          }
        }
        
        // Limpiar búsqueda después de seleccionar
        setSearchTerm('');
        setSearchResults([]);
      } else {
        console.error('❌ No se encontró la ubicación:', locationId);
      }
    }
  };

  const handleCancel = () => {
    // Eliminar el marcador temporal
    if (tempMarker) {
      tempMarker.setMap(null);
      const locs = (window as any).locs;
      if (locs) {
        const index = locs.indexOf(tempMarker);
        if (index > -1) {
          locs.splice(index, 1);
        }
      }
      setTempMarker(null);
    }
    
    // Cerrar botones y formulario
    setShowButtons(false);
    setShowForm(false);
    
    // Resetear formulario
    setFormData({
      title: '',
      type: 'Chester',
      notes: '',
      image: ''
    });
    setClickCoords(null);
  };

  // Función para generar ID aleatorio de 5 caracteres
  const generateRandomId = (): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clickCoords) return;

    // Obtener locations actuales para calcular order
    const response = await fetch('/data/locations.json');
    const locations = await response.json();
    
    // Calcular nuevo order
    const maxOrder = Math.max(...locations.map((l: any) => l.order || 0), 0);
    const newOrder = maxOrder + 1;

    // Generar ID aleatorio de 5 caracteres
    const randomId = generateRandomId();

    // Crear nuevo punto con ID aleatorio
    // Si un campo está vacío, se guarda como string vacío ""
    const newLocation = {
      id: randomId,
      type: formData.type || "",
      title: formData.title || "",
      notes: formData.notes || "",
      order: newOrder,
      lat: parseFloat(clickCoords.lat.toFixed(3)),
      lng: parseFloat(clickCoords.lng.toFixed(3)),
      image: formData.image || ""
    };

    // Convertir a JSON formateado
    const jsonString = JSON.stringify(newLocation, null, 2);
    
    // Copiar al portapapeles
    try {
      await navigator.clipboard.writeText(jsonString);
      
      // Mostrar mensaje de éxito
      alert('✅ JSON copiado al portapapeles!\n\nMandar a Goddark83 para que haga los cambios en la base de datos.');
      
      // Eliminar el marcador temporal
      if (tempMarker) {
        tempMarker.setMap(null);
        const locs = (window as any).locs;
        if (locs) {
          const index = locs.indexOf(tempMarker);
          if (index > -1) {
            locs.splice(index, 1);
          }
        }
        setTempMarker(null);
      }
      
      // Cerrar botones y formulario
      setShowButtons(false);
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
      {/* Navbar */}
      <Navbar />

      {/* MapSidebar - Contiene buscador, categorías, botón recargar y tipos de mapa */}
      <MapSidebar
        searchTerm={searchTerm}
        searchResults={searchResults}
        mapType={mapType}
        onSearch={handleSearch}
        onSearchResultClick={handleSearchResultClick}
        onMapTypeChange={handleMapTypeChange}
        onReload={() => window.location.reload()}
      />

      {/* Location Popup - Solo móvil */}
      <LocationPopup
        isOpen={showLocationPopup}
        onClose={() => setShowLocationPopup(false)}
        title={locationPopupData.title}
        notes={locationPopupData.notes}
        image={locationPopupData.image}
        type={locationPopupData.type}
      />

      {/* Botones flotantes para crear punto */}
      {showButtons && (
        <div className="fixed bottom-6 left-6 z-[9999] flex gap-3 animate-slideUp">
          <button
            onClick={handleCreatePoint}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-full shadow-2xl hover:shadow-green-500/50 transform hover:scale-105 transition-all duration-300 font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Crear Punto
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-3 rounded-full shadow-2xl hover:shadow-red-500/50 transform hover:scale-105 transition-all duration-300 font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancelar
          </button>
        </div>
      )}

      <div id="map" className="w-full h-screen" style={{ background: '#2596be' }}></div>

      <div id="tour-info"></div>

      {/* Handlebars Templates - Se quedan como script type="text/x-handlebars-template" */}
      <script type="text/x-handlebars-template" id="categoriesTemplate">
        {`{{#each categories}}
			<section class="type">
				<h3>Ubicaciones</h3>
				<ul>
					{{#each types}}
						<li>
							<label>
								<input type="checkbox" {{#if enabled}}checked{{/if}} value="{{name}}"> 
								<img src="{{icon}}" style="width: 40px; height: 40px;"> 
								{{name}}
							</label> 
							<a href="#" class="details" data-name="{{name}}">▶</a>
						</li>
					{{/each}}
				</ul>
			</section>
		{{/each}}`}
      </script>

      <script type="text/x-handlebars-template" id="categoryDetailsTemplate">
        {`<section class="type">
			<h3>
				<a href="#" class="back details">◀</a> 
				{{type.name}}
			</h3>
			<ul>
				{{#each locations}}
					<li data-id="{{#if id}}{{id}}{{else}}{{cid}}{{/if}}" style="cursor: pointer;">
						<label style="cursor: pointer;">{{title}}</label>
					</li>
				{{/each}}
			</ul>
		</section>`}
      </script>

      <script type="text/x-handlebars-template" id="markerPopupTemplate2">
        {`<div id="info-window" class="modern-popup">
			<div class="popup-container">
				<!-- Header con gradiente -->
				<div class="popup-header">
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
            <div className="p-6 relative overflow-hidden" style={{ background: 'linear-gradient(to right, #2A9D8F, #3BB9AB, #5FEDD8)' }}>
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Crear Punto</h2>
                    <p className="text-white/80 text-sm">Agrega una nueva ubicación al mapa</p>
                  </div>
                </div>
                <button
                  onClick={handleCancel}
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
                  Título
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-300 outline-none"
                  style={{ borderColor: 'rgb(229, 231, 235)' }}
                  onFocus={(e) => { e.target.style.borderColor = '#3BB9AB'; e.target.style.boxShadow = '0 0 0 4px rgba(59, 185, 171, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgb(229, 231, 235)'; e.target.style.boxShadow = 'none'; }}
                  placeholder="Ej: Obey Tailgator (opcional)"
                />
              </div>

              {/* Tipo/Categoría - Dropdown personalizado */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  Categoría
                </label>
                <div className="relative">
                  {/* Botón que muestra la categoría seleccionada */}
                  <button
                    type="button"
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className="w-full px-4 py-3 pl-14 border-2 border-gray-200 rounded-xl transition-all duration-300 outline-none bg-white text-left flex items-center justify-between"
                    style={{ borderColor: 'rgb(229, 231, 235)' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#3BB9AB'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(59, 185, 171, 0.1)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgb(229, 231, 235)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <span>{formData.type}</span>
                    <svg className={`w-5 h-5 text-gray-400 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Icono de la categoría seleccionada */}
                  {categories.find(c => c.name === formData.type) && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <img 
                        src={categories.find(c => c.name === formData.type)?.icon} 
                        alt=""
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                  )}
                  
                  {/* Dropdown con todas las categorías */}
                  {showCategoryDropdown && (
                    <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                      {categories.map((category) => (
                        <button
                          key={category.name}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, type: category.name });
                            setShowCategoryDropdown(false);
                          }}
                          className={`w-full px-4 py-3 flex items-center gap-3 transition-colors text-left ${
                            formData.type === category.name ? '' : ''
                          }`}
                          style={formData.type === category.name ? { backgroundColor: 'rgba(59, 185, 171, 0.15)' } : {}}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(59, 185, 171, 0.1)'}
                          onMouseLeave={(e) => { if (formData.type !== category.name) e.currentTarget.style.backgroundColor = 'transparent'; }}
                        >
                          <img 
                            src={category.icon} 
                            alt={category.name}
                            className="w-6 h-6 object-contain"
                          />
                          <span className="font-medium text-gray-700">{category.name}</span>
                          {formData.type === category.name && (
                            <svg className="w-5 h-5 ml-auto" style={{ color: '#3BB9AB' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Notas */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  Descripción
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-300 outline-none resize-none"
                  style={{ borderColor: 'rgb(229, 231, 235)' }}
                  onFocus={(e) => { e.target.style.borderColor = '#3BB9AB'; e.target.style.boxShadow = '0 0 0 4px rgba(59, 185, 171, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgb(229, 231, 235)'; e.target.style.boxShadow = 'none'; }}
                  placeholder="Escribe una descripción detallada... (opcional)"
                />
              </div>

              {/* Imagen URL */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  URL de Imagen
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-300 outline-none"
                  style={{ borderColor: 'rgb(229, 231, 235)' }}
                  onFocus={(e) => { e.target.style.borderColor = '#3BB9AB'; e.target.style.boxShadow = '0 0 0 4px rgba(59, 185, 171, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgb(229, 231, 235)'; e.target.style.boxShadow = 'none'; }}
                  placeholder="https://ejemplo.com/imagen.jpg (opcional)"
                />
                
                {/* Botón para Postimage */}
                <div className="mt-2">
                  <a
                    href="https://postimages.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                    style={{ background: 'linear-gradient(to right, #2A9D8F, #3BB9AB)' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Cargar a Postimage
                  </a>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                    Cargar foto a PostImage y copiar el <span className="font-semibold">enlace directo</span> para colocar en el campo de URL
                  </p>
                </div>
                
                {formData.image && (
                  <div className="mt-3 rounded-xl overflow-hidden border-2 border-gray-100">
                    <img src={formData.image} alt="Preview" className="w-full h-48 object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
              </div>

              {/* Coordenadas (solo mostrar) */}
              {clickCoords && (
                <div className="p-4 rounded-xl border-2" style={{ background: 'linear-gradient(to right, rgba(59, 185, 171, 0.1), rgba(95, 237, 216, 0.1))', borderColor: 'rgba(59, 185, 171, 0.3)' }}>
                  <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
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
                  onClick={handleCancel}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(to right, #2A9D8F, #3BB9AB, #5FEDD8)' }}
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
