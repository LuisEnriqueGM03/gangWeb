// @ts-nocheck
/// <reference types="google.maps" />

// Export para hacer este archivo un módulo TypeScript
export {};

// Extender Window con propiedades custom
declare global {
	interface Window {
		locations: any;
		cats: any;
		map: google.maps.Map;
		locs: google.maps.Marker[];
	}
}

// Declarar globales cargados por scripts externos
declare const Handlebars: any;
declare const Backbone: any;
declare const _: any;
declare const $: any;

interface LocationAttributes {
	id?: string;
	title?: string;
	type?: string;
	lat?: number;
	lng?: number;
	marker?: google.maps.Marker;
	notes?: string;
	video?: {
		yt_id: string;
		yt_user?: string;
		start?: string;
		end?: string;
	};
	images?: Array<{
		id: string;
		headline: string;
		url: string;
		author: string;
		contact: string;
	}>;
	credit?: Array<{
		what: string;
		who: string;
		where?: string;
	}>;
}

interface CategoryAttributes {
	name?: string;
	icon?: string;
	type?: string;
	enabled?: boolean;
}

interface MapDetails {
	[key: string]: string;
}

$(() => {
	const showCoordinations = true;

	// Eliminado el chequeo de protocolo HTTP para compatibilidad con HTTPS en Vercel
	
	const $types = $('.types');

	const onResize = (): void => {
		$types.css({
			maxHeight: ($(window).height() || 600) - parseInt($types.css('marginTop'), 10) - parseInt($types.css('marginBottom'), 10) - parseInt(String($('header').height() || 60)) + 6
		});
	};

	onResize();

	$(window).resize(onResize);

	let currentMarker: LocationModel | undefined;

	const assetsUrl = (): string => {
		return window.location.hostname === 'localhost' ? '' : 'https://gta5-map.github.io/';
	};

	Handlebars.registerHelper('assetsUrl', assetsUrl);

	const timestampToSeconds = (stamp: string): number => {
		const parts = stamp.split(':');
		return (parseInt(parts[0], 10) * 60) + parseInt(parts[1], 10);
	};

	Handlebars.registerHelper('timestampToSeconds', timestampToSeconds);

	const Vent = _.extend({}, Backbone.Events);

	class LocationModel extends Backbone.Model<LocationAttributes> {
		initialize(): void {
			const lat = this.get('lat') || 0;
			const lng = this.get('lng') || 0;
			
			const marker = new google.maps.Marker({
				position: new google.maps.LatLng(lat, lng),
				icon: {
					url: assetsUrl() + 'icons/' + categories.getIcon(this.get('type') || ''),
					scaledSize: new google.maps.Size(32, 37),
				}
			});

			_.bindAll(this, 'markerClicked');
			google.maps.event.addListener(marker, 'click', this.markerClicked);

			this.set({ marker: marker });
		}

		markerClicked(): void {
			Vent.trigger('location:clicked', this);
		}

		removeHighlight(): void {
			const marker = this.get('marker');
			if (!marker) return;
			
			const icon = marker.getIcon();
			const url = typeof icon === 'string' ? icon : (icon as any)?.url || '';
			
			marker.setIcon({
				url: url,
				scaledSize: new google.maps.Size(22, 22)
			});
		}

		highlightMarker(): void {
			if (currentMarker === this) {
				Vent.trigger('location:clicked', this);
			} else {
				if (currentMarker) currentMarker.removeHighlight();
				mapView.closePopupLocation();
				currentMarker = this;
				
				const marker = this.get('marker');
				if (!marker) return;
				
				const icon = marker.getIcon();
				const url = typeof icon === 'string' ? icon : (icon as any)?.url || '';
				
				marker.setIcon({
					url: url,
					scaledSize: new google.maps.Size(32, 32)
				});
			}
		}
	}

	class LocationsCollection extends Backbone.Collection<LocationModel> {
		model = LocationModel;
		url = 'locations.json';
	}

	const locations = window.locations = new LocationsCollection();

	class CategoryModel extends Backbone.Model<CategoryAttributes> {}

	class CategoriesCollection extends Backbone.Collection<CategoryModel> {
		model = CategoryModel;

		getIcon(type: string): string {
			const o = this.findWhere({ name: type });
			if (o) {
				return o.get('icon') || 'blank.png';
			}
			return 'blank.png';
		}

		forView(): Array<{ name: string; types: CategoryAttributes[] }> {
			const g = this.groupBy('type');
			return _.map(g, (categories: CategoryModel[], type: string) => {
				return {
					name: type,
					types: _.map(categories, (category: CategoryModel) => category.toJSON())
				};
			});
		}
	}

	const categories = window.cats = new CategoriesCollection([
		{
			name: 'Glitches',
			icon: 'General/glitches.png',
			type: 'General',
			enabled: true
		},
		{
			name: 'Wall breaches',
			icon: 'General/wall-breach.png',
			type: 'General',
			enabled: true
		},
		{
			name: 'Vehicles',
			icon: 'General/cars.png',
			type: 'General',
			enabled: true
		}
	]);

	class CategoriesView extends Backbone.View {
		template!: HandlebarsTemplateDelegate;

		// Definir events como propiedad, no método
		events = {
			'change input': 'toggleLocations',
			'click .details': 'showDetails'
		};

		initialize(): void {
			this.template = Handlebars.compile($('#categoriesTemplate').html());
		}

		render(): this {
			this.$el.html(this.template({
				categories: categories.forView()
			}));
			$('#typeDetails').hide();
			return this;
		}

		toggleLocations(e: JQuery.ChangeEvent): void {
			const $e = $(e.currentTarget);
			const type = $e.val() as string;
			const showLocations = $e.is(':checked');
			const models = locations.where({ type: type });

			if (showLocations) {
				Vent.trigger('locations:visible', models);
			} else {
				Vent.trigger('locations:invisible', models);
			}
		}

		showDetails(e: JQuery.ClickEvent): void {
			e.preventDefault();
			const typeName = $(e.currentTarget).data('name') as string;
			this.$el.find(`input[value="${typeName}"]`).prop('checked', true).trigger('change');

			const type = categories.findWhere({ name: typeName });
			if (!type) return;

			const details = new CategoryDetailsView({
				el: '#typeDetails',
				model: type as any
			} as any);
			(details as any).categoryType = type;
			details.render();
		}
	}

	class CategoryDetailsView extends Backbone.View {
		template!: HandlebarsTemplateDelegate;
		categoryType!: CategoryModel;

		// Definir events como propiedad, no método
		events = {
			'click a.back': 'goBack',
			'click li': 'showMarker'
		};

		initialize(): void {
			this.template = Handlebars.compile($('#categoryDetailsTemplate').html());
		}

		goBack(e: JQuery.ClickEvent): void {
			e.preventDefault();
			this.$el.empty();
			this.off();
			$('#types').show();
		}

		showMarker(e: JQuery.ClickEvent): void {
			const location = locations.get($(e.currentTarget).data('id'));
			if (location && window.map) {
				location.highlightMarker();
				const marker = location.get('marker');
				if (marker) {
					window.map.panTo(marker.getPosition()!);
					window.map.setZoom(5);
				}
			}
		}

		render(): this {
			const name = this.categoryType.get('name') || '';
			const locs = locations.where({ type: name });
			this.$el.html(this.template({
				type: this.categoryType.toJSON(),
				locations: _.map(locs, (x: LocationModel) => {
					const d = x.toJSON();
					let displayName = name;
					if (name === 'Money') displayName = 'Hidden Package';
					if (d.title) {
						d.title = d.title.replace(displayName + ' ', '');
					}
					return d;
				})
			}));
			$('#types').hide();
			this.$el.show();
			return this;
		}
	}

	class MapView extends Backbone.View {
		mapType: string = 'Road';
		mapDetails: MapDetails = { 'Atlas': '#0fa8d2', 'Satellite': '#143d6b', 'Road': '#1862ad' };
		mapOptions!: google.maps.MapOptions;
		map!: google.maps.Map;
		popupTemplate!: HandlebarsTemplateDelegate;
		currentInfoWindow?: google.maps.InfoWindow;

		initialize(): void {
			this.mapOptions = {
				center: new google.maps.LatLng(66, -125),
				zoom: 4,
				disableDefaultUI: true,
				mapTypeControl: true,
				mapTypeControlOptions: { mapTypeIds: _.keys(this.mapDetails) },
				mapTypeId: this.mapType
			};

			_.bindAll(this, 'getTileImage', 'updateMapBackground');

			this.popupTemplate = Handlebars.compile($('#markerPopupTemplate2').html());

			this.listenTo(Vent, 'locations:visible', this.showLocations);
			this.listenTo(Vent, 'locations:invisible', this.hideLocations);
			this.listenTo(Vent, 'location:clicked', this.popupLocation);
		}

		render(): this {
			const updateCoordinationWindow = (markerobject: google.maps.Marker): void => {
				const infoWindow = new google.maps.InfoWindow();

				google.maps.event.addListener(markerobject, 'click', (evt: google.maps.MapMouseEvent) => {
					if (evt.latLng) {
						infoWindow.setOptions({
							content: `<p>Current Lat: ${evt.latLng.lat().toFixed(3)}<br>Current Lng: ${evt.latLng.lng().toFixed(3)}<br>Zoom Level: ${this.map.getZoom()}</p>`
						});
						infoWindow.open(this.map, markerobject);
					}
				});

				google.maps.event.addListener(markerobject, 'drag', (evt: google.maps.MapMouseEvent) => {
					if (evt.latLng) {
						infoWindow.setOptions({
							content: `<p>Current Lat: ${evt.latLng.lat().toFixed(3)}<br>Current Lng: ${evt.latLng.lng().toFixed(3)}<br>Zoom Level: ${this.map.getZoom()}</p>`
						});
					}
				});
			};

			this.map = window.map = new google.maps.Map(this.el as HTMLElement, this.mapOptions);

			this.initMapTypes(this.map, _.keys(this.mapDetails));

			google.maps.event.addListener(this.map, 'maptypeid_changed', this.updateMapBackground);

			google.maps.event.addDomListener(this.map, 'tilesloaded', () => {
				if ($('#mapControlWrap').length === 0) {
					$('div.gmnoprint').last().wrap('<div id="mapControlWrap" />');
				}
			});

			window.locs = [];
			google.maps.event.addListener(this.map, 'rightclick', (e: google.maps.MapMouseEvent) => {
				const marker = new google.maps.Marker({
					map: this.map,
					draggable: true,
					position: e.latLng
				});
				window.locs.push(marker);

				if (showCoordinations) {
					updateCoordinationWindow(marker);
				}
			});

			return this;
		}

		getMap(): google.maps.Map {
			return this.map;
		}

		initMapTypes(map: google.maps.Map, types: string[]): void {
			_.each(types, (type: string) => {
				const mapTypeOptions: google.maps.ImageMapTypeOptions = {
					maxZoom: 7,
					minZoom: 3,
					name: type,
					tileSize: new google.maps.Size(256, 256),
					getTileUrl: this.getTileImage
				};
				map.mapTypes.set(type, new google.maps.ImageMapType(mapTypeOptions));
			}, this);
		}

		updateMapBackground(): void {
			this.mapType = this.map.getMapTypeId() as string;
			this.$el.css({
				backgroundColor: this.mapDetails[this.mapType]
			});
		}

		getTileImage(rawCoordinates: google.maps.Point, zoomLevel: number): string | null {
			const coord = this.normalizeCoordinates(rawCoordinates, zoomLevel);
			if (!coord) {
				return null;
			}

			return assetsUrl() + 'tiles/' + this.mapType.toLowerCase() + '/' + zoomLevel + '-' + coord.x + '_' + coord.y + '.png';
		}

		normalizeCoordinates(coord: google.maps.Point, zoom: number): { x: number; y: number } | null {
			let y = coord.y;
			let x = coord.x;

			const tileRange = 1 << zoom;

			if (y < 0 || y >= tileRange) {
				return null;
			}

			if (x < 0 || x >= tileRange) {
				x = (x % tileRange + tileRange) % tileRange;
			}

			return { x, y };
		}

		showLocations(locations: LocationModel[]): void {
			_.each(locations, (location: LocationModel) => {
				const marker = location.get('marker');
				if (!marker) return;
				if (!marker.getMap()) {
					marker.setMap(this.map);
				}
				marker.setVisible(true);
			}, this);
		}

		hideLocations(locations: LocationModel[]): void {
			_.each(locations, (location: LocationModel) => {
				const marker = location.get('marker');
				if (marker) {
					marker.setVisible(false);
				}
			});
		}

		popupLocation(location: LocationModel, panTo?: boolean): void {
			const infoWindow = new google.maps.InfoWindow({
				content: this.popupTemplate(location.toJSON()),
			});

			// maxHeight no está soportado en InfoWindowOptions, lo removemos
			// Solo maxWidth está disponible

			if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
				infoWindow.setOptions({
					maxWidth: 180
				});
			}

			const marker = location.get('marker');
			if (marker) {
				infoWindow.open(this.map, marker);
			}

			this.closePopupLocation();
			this.currentInfoWindow = infoWindow;
		}

		closePopupLocation(): void {
			if (this.currentInfoWindow) {
				this.currentInfoWindow.close();
			}
		}
	}

	const mapView = new MapView({
		el: '#map'
	});

	const categoriesView = new CategoriesView({
		el: '#types'
	});

	locations.fetch().done(() => {
		mapView.render();
		categoriesView.render();

		categories.chain()
			.filter((c: CategoryModel) => c.get('enabled'))
			.map((c: CategoryModel) => c.get('name') || '')
			.map((name: string) => {
				return locations.where({ type: name });
			})
			.each((locs: LocationModel[]) => {
				Vent.trigger('locations:visible', locs);
			})
			.value();
	});

	$('#tour-prev, #tour-next').click(function(e: any) {
		e.preventDefault();
		const navTo = $((this as any)).text();
		const x = locations.findWhere({ title: navTo });
		if (x) Vent.trigger('location:clicked', x, true);
	});
});
