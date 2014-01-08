function Ball(rad) {

	var properties = {
		radius : rad,
		pos : [ CANVAS_WIDTH / 2.0, CANVAS_HEIGHT / 2.0 ],
		speed : [ 0.0, 0.0 ]
	};

	this.getRadius = function() {
		return properties.radius;
	};

	this.setPosition = function(position) {
		properties.pos = $.extend(true, {}, position);
	};

	this.getPosition = function() {
		return properties.pos;
	};

	function getSpeed() {
		return properties.speed;
	}

	this.getHSpeed = function() {
		return getSpeed()[0];
	};

	this.getVSpeed = function() {
		return getSpeed()[1];
	};

	this.setHSpeed = function(val) {
		getSpeed()[0] = val;
	};

	this.setVSpeed = function(val) {
		getSpeed()[1] = val;
	};

	this.getX = function() {
		return this.getPosition()[0];
	};

	this.getY = function() {
		return this.getPosition()[1];
	};

	function update() {
		properties.pos[0] += properties.speed[0];
		properties.pos[1] += properties.speed[1];
	}

	function checkWallCollisions() {
		var x = properties.pos[0];
		var y = properties.pos[1];
		var radius = properties.radius;
		if (y - radius < 0 || y + radius > CANVAS_HEIGHT) { // top & bottom
			properties.speed[1] = -properties.speed[1];
		} else if (x - radius < 0 || x + radius > CANVAS_WIDTH) { // left
			properties.speed[0] = -properties.speed[0];
		}
	}

	this.draw = function() {
		ctx.arc(this.getX(), this.getY(), this.getRadius(), 0, 2 * Math.PI,
				false);
		ctx.fillStyle = 'white';
		ctx.fill();
		update();
		checkWallCollisions();
	};
};