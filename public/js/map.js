var h = $(window).height(), offsetTop = 175
var w = $(window).width()
if (w < 760) {
	offsetTop = 50;
	$('body').css('padding-left', 0)
	$('body').css('padding-right', 0)

}

$(window).load(function() {

	$(window).resize(function() {
		var h = $(window).height(), offsetTop = 175
		var w = $(window).width()
		if (w < 760) {
			offsetTop = 50;
		}

		$('#map').css('height', (h - offsetTop));
		// $('#map-canvas').css('width', (w - offsetLeft));
		// $('#map-canvas').css('top', mapOffsetTop);
		// $('#dashboard').css('height', h - 60)
	}).resize();
	// if ($.browser.msie && parseInt($.browser.version, 10) === 8) {
	// $('.navbar-extra').hide();
	// }
	// var w = $(window).width(), offsetLeft = 345;
	//var h = $(window).height(), offsetTop = 100

	$('#map').css('height', (h - offsetTop))
});

$(document).ready(function() {

	var map = new L.Map('map', {
		center : new L.LatLng(33.755, -84.39),
		zoom : 15
	});
	//var osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
	var googleStreet = new L.Google('ROADMAP')
	var googleHybrid = new L.Google('HYBRID')
	map.addLayer(googleHybrid);
	map.addControl(new L.Control.Layers({
		'Google Satelite' : googleHybrid,
		'Google Street' : googleStreet
	}, {}));

	function onEachFeature(feature, layer) {
		// console.log(layer)
		// if (feature.properties.icon != undefined) {
		// layer.setIcon.layer.setIcon(new L.Icon({
		// iconUrl : feature.properties.icon
		// }))
		// }

		var html = '<b>' + feature.properties.Name + '</b>'
		if (feature.properties.Description.length > 0) {
			html += '<br>' + feature.properties.Description
		}
		layer.bindPopup(html);

		// layer.on({
		// click : updateInfo
		// });
	}

	function updateInfo(e) {
		console.log(e.target)
	}


	L.geoJson(points, {

		onEachFeature : onEachFeature
		// style : function(feature) {
		// return {
		// color : feature.properties.color
		// };
		// },
		// onEachFeature : function(feature, layer) {
		// layer.bindPopup(feature.properties.description);
		// }
	}).addTo(map);

})