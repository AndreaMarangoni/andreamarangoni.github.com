function loadImages(sources, callback) {
	for ( var src in sources) {
		IMAGES[src] = new Image();
		IMAGES[src].onload = function() {
		};
		IMAGES[src].src = sources[src];
	}
}