function Ship(properties) {

	var ANGLE = 9.0;
	var ACC = 0.1;
	var DEC = 0.005;
	var MISSILE_SPEED = 5.0;
	var MAX_MISSILES = 10;

	var params = {
		pos : [ 0, 0 ],
		vel : [ 0, 0 ],
		angle : 0.0,
		info : null
	};

	params = $.extend({}, params, properties);

	var pos = params['pos'];
	var image = IMAGES['ship'];
	var acc = [ 0.0, 0.0 ];
	var thrust = false;
	var velAngle = 0.0;
	var missiles = new Set();
	var num_missile = 0;
	var radius = params.info.getRadius();
	var info = params.info;

	function checkImages() {
		if (thrust) {
			return IMAGES['shipThrust'];
		}
		return IMAGES['ship'];
	}

	function limitAngularSpeed() {
		if (velAngle > 10.0) {
			velAngle = 5.0;
		} else if (velAngle < -10.0) {
			velAngle = -5.0;
		}
	}

	function checkMissiles() {
		var keys = missiles.keys();
		for ( var i = 0; i < keys.length; ++i) {
			var missile = missiles.get(keys[i]);
			if (missile.getTimer() >= missile.getLifespan()) {
				missiles.remove(keys[i]);
			}
		}
	}

	this.getMissiles = function() {
		return missiles;
	};

	this.left = function() {
		velAngle -= ANGLE;
	};

	this.right = function() {
		velAngle += ANGLE;
	};

	this.stopRotate = function() {
		velAngle = 0.0;
	};

	this.getPosition = function() {
		return params.pos;
	};

	this.getRadius = function() {
		return radius;
	};

	this.accelerate = function() {
		thrust = true;
	};

	this.decelerate = function() {
		thrust = false;
	};

	this.isThrusting = function() {
		return thrust;
	};

	this.shoot = function() {
		if (missiles.keys().length >= MAX_MISSILES) {
			num_missile = 0;
			return;
		}
		var components = angleToVector(params.angle * Math.PI / 180.0);
		var pos = [ 0.0, 0.0 ];
		var vel = [ 0.0, 0.0 ];

		for ( var i = 0; i < 2; ++i) {
			pos[i] = params.pos[i] + (params.info.getCenter()[i] * components[i]);
			vel[i] = params.vel[i] + components[i] * MISSILE_SPEED;
		}
		var sprite = {
			pos : pos,
			vel : vel,
			size : missileInfo.getSize(),
			image : IMAGES['missile'],
			info : missileInfo
		};
		var missile = new Sprite(sprite);
		missiles.add(num_missile, missile);
		num_missile = num_missile + 1;
	};

	this.draw = function() {
		var img = checkImages();
	    drawImageRot(img,pos[0]-info.getCenter()[0],pos[1]-info.getCenter()[1], image.width,
		 image.height, params.angle);
		process_sprite_group(missiles);
	};

	this.update = function() {
		params.angle = params.angle + velAngle;
		limitAngularSpeed();
		if (thrust) {
			acc = angleToVector(params.angle * Math.PI / 180);
			for ( var i = 0; i < 2; ++i) {
				acc[i] *= ACC;
				params.vel[i] += acc[i];
			}
		}
		for ( var i = 0; i < 2; ++i) {
			params.vel[i] *= (1 - DEC);
			params.pos[i] = (params.pos[i] + params.vel[i]);
		}
		checkBoundaries(params.pos, params.info);
		checkMissiles();
	};
};

