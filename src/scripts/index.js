/*!
 * news-interactive-qbh
 *
 * @version 1.0.0
 * @author Simon Elvery <elvery.simon@abc.net.au>
 */


var map, maps, geo, data, markers, bounds, start;


// map starting point
start = {
	lat: -27.6989,
	lng: 133.8829,
	zoom: 3
};

// local cache a couple of things (in top scope)
maps = ABC.News.maps;
geo = ABC.News.GeoLookup;

$.when(
	loadMap('qbh-map', start.lat, start.lng, start.zoom)
).then(function(m){

	var unavailable, overseas;

	require('../../bower_components/leaflet.markercluster/dist/leaflet.markercluster.js');

	bounds = [];

	// put objects in top scope
	map = m;
	data = require('../data/geocoded.json');

	// initialise some vars
	markers = [];
	unavailable = '';
	overseas = '';

	// add the markers
	if (data && data.length) {

		_.each(data, function(recipient, index) {
			if (_.isArray(recipient[5])) {
				markers.push(addMarker(recipient));
				bounds.push(recipient[5]);
			} else {
				if (recipient[5] === 'overseas') {
					overseas += '<li>' + recipient[1] + ' ' + recipient[0] + ' ' + recipient[3] + ' (' + recipient[2] + ')</li>';
				} else {
					unavailable += '<li>' + recipient[1] + ' ' + recipient[0] + ' ' + recipient[3] + '</li>';
				}
			}
		});

		// map.fitBounds(bounds);
		$locationUnavailable = $('#qbh-location-unavailable').append('<ul>'+unavailable+'</ul>');
		$locationOverseas = $('#qbh-location-overseas').append('<ul>'+overseas+'</ul>');

		var m = new L.MarkerClusterGroup({
			showCoverageOnHover: false,
			spiderfyDistanceMultiplier: 2,
			maxClusterRadius: 30,
			iconCreateFunction: function (cluster) {
				var childCount = cluster.getChildCount();
				var c = ' marker-cluster-';

				if (childCount < 10) {
					c += 'small';
				} else if (childCount < 100) {
					c += 'medium';
				} else {
					c += 'large';
				}

				return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(30, 30) });
			}
		});

		m.addLayers(markers)
		map.addLayer(m);
	}
});


/**
 * Add a geocoded postcode marker to the map
 */
function addMarker(recipient) {

	var text = '<table><tr><th>Name: </th><td>' + recipient[1] + ' ' + recipient[0] + '</td></tr>' +
			'<tr><th>Award: </th><td>' + recipient[3] + '</td></tr>' +
			'<tr><th>Postcode: </th><td>' + recipient[2] + '</td></tr></table>';
	return L.marker(recipient[5], {
		icon: L.divIcon({
			iconSize: [40,40],
			html: '<div><span>' + recipient[3] + '</span></div>',
			className: 'honour-icon honour-type-' + recipient[3].toLowerCase()
		})
	})
	.bindPopup(text).openPopup();
}

/**
* Loads the Map API
* @returns {object} returns a promise
*/
function loadMapAPI() {
	var deferred = new jQuery.Deferred();

	$('head').append('<link id="leafletCss" href="http://www.abc.net.au/res/sites/news/styles/vendor/leaflet/0.7.3/leaflet.css" rel="stylesheet" />');
	if (typeof L !== 'object' || typeof L.map !== 'object') {
		$.getScript('http://www.abc.net.au/res/sites/news/scripts/vendor/leaflet/0.7.3/leaflet.js').then(function() {
			deferred.resolve();
		});
	} else {
		deferred.resolve();
	}

	return deferred;
}

/**
 * Loads a map into an element.
 * Checks that the Map API is loaded and if it's not, it loads the API first.
 * @param {object} element an element to inject the map into
 * @param {int} lat The latitude of the centre
 * @param {int} lng The longitude of the centre
 * @param {int} zoom The default zoom level
 * @param {array} [markers] An array of markers to put on the map
 * @returns {object} returns a promise
 */
function loadMap(element, lat, lng, zoom, markers) {
	var map,
		deferred,
		mapMarker;

	deferred = new jQuery.Deferred();

	loadMapAPI().then(function() {
		// create the map
		map = L.map(element).setView([lat, lng], zoom);

		// remove the leaflet attribution
		map.attributionControl.setPrefix('');

		// add the tile layer
		L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg', {
			attribution: '&copy; OpenStreetMap. Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">',
			maxZoom: 12
		}).addTo(map);

		// add the markers
		if (markers && markers.length) {
			_.each(markers, function(marker) {
				addMarker(map, marker.lat, marker.lng);
			});
		}

		// resolve with the map object
		deferred.resolve(map);

	});

	return deferred;
}
