function Paddle(posX, posY) {

	var properties = {
		width : PADDLE_WIDTH,
		height : PADDLE_HEIGHT,
		pos : [ posX, posY ],
		speed : 0.0
	};

	var SPEED = 4.0;
	var prec_pos = [ properties.pos[0], properties.pos[1] ];

	this.setSpeed = function(speed) {
		properties.speed = speed;
	};

	this.setPosition = function(position) {
		properties.pos = $.extend(true, {}, position);
	};

	this.getWidth = function() {
		return properties.width;
	};

	this.getHeight = function() {
		return properties.height;
	};

	this.getPosition = function() {
		return properties.pos;
	};

	this.getX = function() {
		return this.getPosition()[0];
	};

	this.getY = function() {
		return this.getPosition()[1];
	};

	this.moveUP = function() {
		properties.speed = -SPEED;
	};

	this.moveDOWN = function() {
		properties.speed = SPEED;
	};

	this.getSpeed = function() {
		return properties.speed;
	};

	this.stop = function() {
		properties.speed = 0.0;
	};

	function update() {
		prec_pos = [ properties.pos[0], properties.pos[1] ];
		properties.pos[1] += properties.speed;
	}

	function checkMargins() {
		var y = properties.pos[1];
		if (y < 0 || y + PADDLE_HEIGHT > CANVAS_HEIGHT) {
			properties.pos[1] = prec_pos[1];
		}
	}

	this.draw = function() {
		update();
		checkMargins();
		ctx.fillStyle = 'white';
		ctx.fillRect(this.getX(), this.getY(), this.getWidth(), this
				.getHeight());
	};
};