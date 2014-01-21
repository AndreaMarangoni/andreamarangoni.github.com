function Sprite(properties) {

	var params = {
		pos : [ 0, 0 ],
		vel : [ 0, 0 ],
		size : [ 0, 0 ],
		angle : 0,
		angle_vel : 0,
		image : null,
		info : null
	};

	params = $.extend({}, params, properties);

	var image = params.image;
	var pos = params.pos;
	var timer = 0.0;
	var age = 0;
	var info = params.info;
	var image_center = info.getCenter();
	var image_size = params.info.getSize();
	var radius = params.info.getRadius();
	var lifespan = params.info.getLifespan();
	var animated = params.info.getAnimated();
	var kind = params.info.getKind();
	var angle = params.angle;

	this.isAnimated = function() {
		return animated;
	};

	this.getAge = function() {
		return age;
	};

	this.getLifespan = function() {
		return lifespan;
	};

	this.getTimer = function() {
		return timer;
	};

	this.getPosition = function() {
		return pos;
	};

	this.getRadius = function() {
		return radius;
	};

	this.getKind = function() {
		return kind;
	};

	this.draw = function() {
		if (!animated) {
			drawImageRot(image, pos[0] - image_center[0], pos[1]
					- image_center[1], info.getSize()[0], info.getSize()[1],
					angle);
		}
	};

	this.update = function() {
		if (animated) {
			if (age <= lifespan) {
				ctx
						.drawImage(image, 0 + age * image_size[0], 0,
								image_size[1], image_size[1], pos[0]
										- image_center[0], pos[1]
										- image_center[1], image_size[1],
								image_size[1]);
				age = age + 1;
			}
		} else {
			angle = angle + params.angle_vel;
			for ( var i = 0; i < 2; ++i) {
				pos[i] = (pos[i] + params.vel[i]);
			}
			timer = timer + TIMER.getTslf();
			checkBoundaries(pos, params.info);
		}
	};

	this.checkCollision = function(other) {
		if ((dist(pos, other.getPosition()) < (radius + other.getRadius()))) {
			return true;
		}
		return false;
	};
};
