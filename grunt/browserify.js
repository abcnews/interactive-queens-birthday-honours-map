module.exports = {
	"options": {
		"transform": ["brfs"]
	},
	"dev": {
		"options": {
			"browserifyOptions": {
				"debug": true
			}
		},
		"files": {
			"build/scripts/index.js": ["src/scripts/index.js"]
		}
	},
	"prod": {
		"files": {
			"build/scripts/index.js": ["src/scripts/index.js"]
		}
	}
};
