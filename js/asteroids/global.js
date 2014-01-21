// requestAnim shim layer by Paul Irish
window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame
			|| window.mozRequestAnimationFrame || window.oRequestAnimationFrame
			|| window.msRequestAnimationFrame
			|| function(/* function */callback, /* DOMElement */element) {
				window.setTimeout(callback, 1000 / 60);
			};
})();

var canvas, ctx;

var ASTEROIDS;
var ROCK;
var TIMER;
var CANVAS_WIDTH = 640;
var CANVAS_HEIGHT = 480;
var IMAGES = {};
var gtime = 0.0;
var wtime = 0.0;
var center;
var size;

var A_LO = 0.0;
var A_UP = 2.1 * Math.PI;
var SEQ = [ -1, 1 ];
var XUP = 0.5;
var XLO = 1.5;
var YUP = 0.5;
var YLO = 1.5;
var S_LO = -4;
var S_UP = 4;

// # art assets created by Kim Lathrop, may be freely re-used in non-commercial

var path = "/img/asteroids/";

var debrisImage = {
	debrisblue1 : path + "debris1_blue.png",
	debrisblue2 : path + "debris2_blue.png",
	debrisblue3 : path + "debris3_blue.png",
	debrisblue0 : path + "debris4_blue.png",
	debrisbrown1 : path + "debris1_brown.png",
	debrisbrown2 : path + "debris2_brown.png",
	debrisbrown3 : path + "debris3_brown.png",
	debrisbrown0 : path + "debris4_brown.png",
	debrisblend : path + "debris_blend.png"
};
// nebula images - nebula_brown.png, nebula_blue.png
var nebulaImage = {
	nebulablue : path + "nebula_blue.f2013.png",
	nebulabrown : path + "nebula_brown.png"
};
// # splash image
var splashImage = {
	splash : path + "splash.png"
};
// # ship image
var shipImage = {
	ship : path + "ship.png",
	shipThrust : path + "ship_thrust.png"
};

// # missile image - shot1.png, shot2.png, shot3.png
var missileImage = {
	missile : path + "shot1.png"
};
// # asteroid images - asteroid_blue.png, asteroid_brown.png, asteroid_blend.png
var asteroidImage = {
	asteroidblue : path + "asteroid_blue.png",
	asteroidbrown : path + "asteroid_brown.png",
	asteroidblend : path + "asteroid_blend.png"
};
// # animated explosion - explosion_orange.png, explosion_blue.png,
// explosion_blue2.png, explosion_alpha.png
var explosionImage = {
	explosionorange : path + "explosion_orange.png",
	explosionblue : path + "explosion_blue.png",
	explosionblue2 : path + "explosion_blue2.png",
	explosionalpha : path + "explosion_alpha.png"
};

var di = {
	center : [ 320, 240 ],
	size : [ 640, 480 ]
};

var ni = {
	center : [ 400, 300 ],
	size : [ 800, 600 ]
};

var shi = {
	center : [ 200, 150 ],
	size : [ 400, 300 ]
};

var si = {
	center : [ 45, 45 ],
	size : [ 90, 90 ],
	kind : "ship",
	radius : 35
};

var mi = {
	center : [ 5, 5 ],
	size : [ 10, 10 ],
	kind : "missile",
	radius : 10,
	lifespan : 1.0,
	animated : false
};

var ai = {
	center : [ 45, 45 ],
	size : [ 90, 90 ],
	kind : "rock",
	radius : 40,
	lifespan : "Nan",
	animated : false
};

var ei = {
	center : [ 64, 64 ],
	size : [ 128, 128 ],
	kind : "explosion",
	radius : 17,
	lifespan : 24,
	animated : true
};

var mini = {
	center : [ 17.5, 17.5 ],
	size : [ 35, 35 ],
	kind : "mini-rock",
	radius : 10,
	lifespan : "Nan",
	animated : false
};

var debrisInfo = new ImageInfo(di);
var nebulaInfo = new ImageInfo(ni);
var splashInfo = new ImageInfo(shi);
var shipInfo = new ImageInfo(si);
var missileInfo = new ImageInfo(mi);
var asteroidInfo = new ImageInfo(ai);
var explosionInfo = new ImageInfo(ei);
var miniAsteroidInfo = new ImageInfo(mini);

// LOAD IMAGES
loadImages(debrisImage, function() {
});
loadImages(nebulaImage, function() {
});
loadImages(splashImage, function() {
});
loadImages(shipImage, function() {
});
loadImages(missileImage, function() {
});
loadImages(explosionImage, function() {
});
loadImages(asteroidImage, function() {
});
// GLOBAL FUNCTION

function angleToVector(ang) {
	return [ Math.cos(ang), Math.sin(ang) ];
}

function dist(p, q) {
	return Math.sqrt(Math.pow((p[0] - q[0]), 2) + Math.pow((p[1] - q[1]), 2));
}

function randomInRange(min, max) {
	return Math.random() < 0.5 ? ((1 - Math.random()) * (max - min) + min)
			: (Math.random() * (max - min) + min);
}

function process_sprite_group(group) {
	var keys = group.keys();
	for ( var i = 0; i < keys.length; ++i) {
		var sprite = group.get(keys[i]);
		sprite.update();
		sprite.draw();
		if (sprite.isAnimated() && sprite.getAge() > sprite.getLifespan()) {
			group.remove(keys[i]);
		}
	}
}

function checkBoundaries(pos, info) {
	if (pos[0] >= canvas.width) {
		pos[0] = 0;
	} else if (pos[0] <= -info.getCenter()[0]) {
		pos[0] = canvas.width - info.getCenter()[0];
	}
	if (pos[1] >= canvas.height) {
		pos[1] = 0;
	} else if (pos[1] <= -info.getCenter()[1]) {
		pos[1] = canvas.height - info.getCenter()[1];
	}
}

Array.prototype.randomElement = function() {
	return this[Math.floor(Math.random() * this.length)];
};

function drawImageRot(img, x, y, width, height, deg) {
	// Convert degrees to radian
	var rad = deg * Math.PI / 180;
	// Set the origin to the center of the image
	ctx.translate(x + width / 2, y + height / 2);
	// Rotate the canvas around the origin
	ctx.rotate(rad);
	// draw the image
	ctx.drawImage(img, width / 2 * (-1), height / 2 * (-1), width, height);
	// reset the canvas
	ctx.rotate(rad * (-1));
	ctx.translate((x + width / 2) * (-1), (y + height / 2) * (-1));
}

function isNull(obj) {
	return ((obj == null) || (obj == undefined));
}