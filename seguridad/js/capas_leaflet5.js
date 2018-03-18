//mapa
var map = L.map('map', {
            zoomControl:true, maxZoom:28, minZoom:1
        }).fitBounds([[36.8062374102,-2.48343278606],[36.8742845291,-2.38929241106]]);
//mapa de referencia
var osmAttrib='Map data &copy; OpenStreetMap contributors';
//Plugin magic goes here! Note that you cannot use the same layer object again, as that will confuse the two map controls
var osm2 = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {minZoom: 0, maxZoom: 13, attribution: osmAttrib });
var miniMap = new L.Control.MiniMap(osm2, { toggleDisplay: true }).addTo(map);
//carga de capas
   var style = {color:'red', opacity: 1.0, fillOpacity: 1.0, weight: 2, clickable: false};
L.Control.FileLayerLoad.LABEL = '<i class="fa fa-folder-open"></i>';
L.Control.fileLayerLoad({
    fitBounds: true,
    layerOptions: {style: style,
                   pointToLayer: function (data, latlng) {
                      return L.circleMarker(latlng, {style: style});
                   }},
}).addTo(map);
//capas
var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap' +
    '</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">' +
    'CC-BY-SA</a>'
}).addTo(map);

var paint = L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>,' +
    ' under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>.' +
    ' Data by <a href="http://openstreetmap.org">OpenStreetMap</a>,' +
    ' under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
});

var icc = L.tileLayer.wms("http://www.ideandalucia.es/wms/mta10v_2007?", {
  layers: 'Edificacion',
  format: 'image/png',
  transparent: true,
  attribution: "Mapa topografico"
});
 var osmGeocoder = new L.Control.OSMGeocoder({
            collapsed: false,
            position: 'topright',
            text: 'Search',
        });
        osmGeocoder.addTo(map);




var parques = L.geoJson(parquesjson, {
  onEachFeature: function(feature, layer) {
    layer.bindPopup(feature.properties.name);
  }
}).addTo(map);

var estiloCirculosNaranja = {
  radius: 4,
  fillColor: "#006400",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};

var bibliotecas = L.geoJson(null, {
  pointToLayer: function(feature, latlng) {
    return L.circleMarker(latlng, estiloCirculosNaranja);
  }
});

omnivore.kml('datos/bibliotecas.kml', null, bibliotecas).addTo(map);

var capaEdicion = new L.FeatureGroup().addTo(map);
map.on('draw:created', function(evento) {
  var layer = evento.layer;
  capaEdicion.addLayer(layer);
});


//controles
 // add location control to global name space for testing only

lc = L.control.locate({
    strings: {
        title: "Me muestra donde estoy yo¡"
    }
}).addTo(map);


L.control.scale({
  position: 'bottomright',
  imperial: false
}).addTo(map);

var baseMaps = {
  "Base de OpenStreetMap": osm,
  "Acuarela": paint,
 
		"PNOA Máx. Actualidad": Spain_PNOA_Ortoimagen
		
};

var overlays = {
  "Mapa topografico": icc,
  "Parques": parques
};

			var select = L.countrySelect().addTo(map);

select.on('change', function(e){
	if(e.feature === undefined){ //No action when the first item ("Country") is selected
		return;
	}
	var country = L.geoJson(e.feature);
	if (this.previousCountry != null){
		map.removeLayer(this.previousCountry);
	}
	this.previousCountry = country;

	map.addLayer(country);
	map.fitBounds(country.getBounds());
	
});
			

L.control.layers(baseMaps, overlays).addTo(map);

var drawControl = new L.Control.Draw({
  edit: {
    featureGroup: capaEdicion
  }
});
map.addControl(drawControl);
