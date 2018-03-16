//mapa
var map = L.map('map', {
  center: [40.4142671347, -3.6938271523],
  zoom: 13
});
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

var icc = L.tileLayer.wms("https://idem.madrid.org/geoidem/UsoDelSuelo/SIGI_MA_VEGETACION_1982/wms?", {
  layers: 'SIGI_MA_VEGETACION_1982',
  format: 'image/png',
  transparent: true,
  attribution: "USO DEL SUELO"
});

1
2
3
4
	var source = L.WMS.source("https://idem.madrid.org/geoidem/UsoDelSuelo/SIGI_MA_VEGETACION_1982/wms?", {
   		  opacity: 0.5,
	});
	source.getLayer("SIGI_MA_VEGETACION_1982").addTo(map);


var parques = L.geoJson(parquesjson, {
  onEachFeature: function(feature, layer) {
    layer.bindPopup(feature.properties.arb_observ);
  }
}).addTo(map);

var estiloCirculosNaranja = {
  radius: 8,
  fillColor: "#ff7800",
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
  "Suelo": icc,
  "Parques": parques
};

L.control.layers(baseMaps, overlays).addTo(map);

var drawControl = new L.Control.Draw({
  edit: {
    featureGroup: capaEdicion
  }
});
map.addControl(drawControl);
