module.exports = {
	contentftp: {
		credentials: ".abc-credentials",
		targetName: "contentftp",
		target: "/www/res/sites/news-projects/interactive-queens-birthday-honours-map/",
		files: [{
			expand: true,
			cwd: 'build/',
			src: ["**/*"]
		}]
	}
};
