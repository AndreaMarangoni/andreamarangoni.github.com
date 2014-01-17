function loadImages(sources, callback) {
	var loadedImages = 0;
	var numImages = 0;
	// get num of sources
	for ( var src in sources) {
		numImages++;
	}
	for ( var src in sources) {
		IMAGES[src] = new Image();
		IMAGES[src].onload = function() {
			if (++loadedImages >= numImages) {
				callback(IMAGES);
			}
		};
		IMAGES[src].src = sources[src];
	}
}