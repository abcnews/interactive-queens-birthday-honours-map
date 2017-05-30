module.exports = {
	dev: {
		options: {
			style: "expanded"
		},
		files: {
			"build/styles/index.css": ["src/styles/index.scss","bower_components/leaflet.markercluster/dist/MarkerCluster.css","bower_components/leaflet.markercluster/dist/MarkerCluster.Default.css"]
		}
	},

	prod: {
		options: {
			style: "compressed"
		},
		files: {
			"build/styles/index.css": ["src/styles/index.scss","bower_components/leaflet.markercluster/dist/MarkerCluster.css","bower_components/leaflet.markercluster/dist/MarkerCluster.Default.css"]
		}
	}

};
