/*!
 * news-interactive-qbh
 *
 * @version 1.0.0
 * @author Simon Elvery <elvery.simon@abc.net.au>
 */


var fs, domready, map, maps, geo, data, markers, css, insertCss, bounds, start;

// requirements
domready = require('domready');


function wrangleData() {
	
	$.when(
		$.getJSON($('#qbh-map').data('wrangle')),
		geo.fetchLocationsData()
	).then(function(d, geoData){
		
		data = d[0];

		// add the markers
		if (data && data.length) {

			_.each(data, function(recipient, index) {

				ABC.News.GeoLookup.searchLocations(recipient[2]).then(function(locations){

					if (recipient[2].length === 4 && locations.length) {
						recipient[5] = [locations[0].lat,locations[0].lng];
					} else {
						if (recipient[2].length <= 4) {
							recipient[5] = 'unavailable';
						} else {
							recipient[5] = 'overseas';
						}
					}



					if (index === data.length-1) {
						console.log(JSON.stringify(data));			
					}
					
				});
			});
		}
	});
}

/**
 * Wait for domready
 */
function init(){

	// local cache a couple of things (in top scope)
	maps = ABC.News.maps;
	geo = ABC.News.GeoLookup;

	wrangleData();
}

domready(init);