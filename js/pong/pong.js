var Pong = function(params) {

	var SPEEDUP = 10;
	var pause = false;

	function spawnBall() {
		BALL.setPosition([ CANVAS_WIDTH / 2.0, CANVAS_HEIGHT / 2.0 ]);
		BALL.setHSpeed(getRandomInt(120, 240) / 60.0);
		BALL.setVSpeed(-getRandomInt(60, 180) / 60.0);
		var Vdirection = getRandomInt(0, 1);
		var Hdirection = getRandomInt(0, 1);
		if (Vdirection) {
			BALL.setHSpeed(-BALL.getHSpeed());
		}
		if (Hdirection) {
			BALL.setVSpeed(-BALL.getVSpeed());
		}
	}

	function checkWinner() {
		var winner = false, hit = false;
		if (BALL.getX() - BALL.getRadius() < PADDLE_WIDTH ) { // left side
			if (BALL.getY() >= LEFT.getY()
					&& BALL.getY() <= LEFT.getY() + LEFT.getHeight()) {
				hit = true;
				BALL.setHSpeed(-BALL.getHSpeed());
			} else {
				winner = true;
				BOARD.scoreRight();
			}
		} else if (BALL.getX() + BALL.getRadius() > CANVAS_WIDTH - PADDLE_WIDTH) { // right side
			if (BALL.getY() >= RIGHT.getY()
					&& BALL.getY() <= RIGHT.getY() + RIGHT.getHeight()) {
				hit = true;
				BALL.setHSpeed(-BALL.getHSpeed());
			} else {
				winner = true;
				BOARD.scoreLeft();
			}
		}
		if (winner) {
			spawnBall();
		} else if (hit) {
			speedUpBall(SPEEDUP);
		}
	}

	function speedUpBall(perc) {
		var h = BALL.getHSpeed() / 100.0 * perc;
		var v = BALL.getVSpeed() / 100.0 * perc;
		BALL.setHSpeed(BALL.getHSpeed() + h);
		BALL.setVSpeed(BALL.getVSpeed() + v);
	}

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function drawPause() {
		ctx.font = '40pt Calibri';
		ctx.fillStyle = 'white';
		ctx.fillText('Game Paused', CANVAS_WIDTH / 2.0 - 135,
				CANVAS_HEIGHT / 2.0);
	}

	return {
		init : function() {
			BOARD = new BoardGame(CANVAS_WIDTH, CANVAS_HEIGHT);
			LEFT = new Paddle(0, CANVAS_HEIGHT / 2.0 - PADDLE_HEIGHT / 2.0);
			RIGHT = new Paddle(CANVAS_WIDTH - PADDLE_WIDTH, CANVAS_HEIGHT / 2.0
					- PADDLE_HEIGHT / 2.0);
			BALL = new Ball(20.0);
		},
		reset : function() {
			BOARD.resetScores();
			LEFT.setPosition([ 0, CANVAS_HEIGHT / 2.0 - PADDLE_HEIGHT / 2.0 ]);
			RIGHT.setPosition([ CANVAS_WIDTH - PADDLE_WIDTH,
					CANVAS_HEIGHT / 2.0 - PADDLE_HEIGHT / 2.0 ]);
			spawnBall();
		},
		pause : function() {
			pause = !pause;
		},
		isPaused : function(){
			return pause;
		},
		draw : function() {
			checkWinner();
			if (!pause) {
				BALL.draw();
				LEFT.draw();
				RIGHT.draw();
			} else {
				drawPause();
			}
			BOARD.draw();
		}
	};
};

function start(){
	PONG.reset();
	if(PONG.isPaused()){
		PONG.pause();
	}
}

function reset() {
	PONG.reset();
}

function pause() {
	PONG.pause();
}

function init() {
	canvas = document.getElementById("canvas");
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;
	ctx = canvas.getContext('2d');
	started = new Date().getTime();
	PONG = new Pong();
	PONG.init();
}

function run() {
	init();
	animate();
}

function animate() {
	requestAnimFrame(animate);
	draw();
}

function setFps(value) {
	document.getElementById("fps").innerHTML = "Fps: " + value;
}

function timing() {
	FPS = FPS + 1;
	now = new Date().getTime();
	tslf = (now - started) / 1000;
	timer = timer + tslf;
	started = now;
	if (timer >= SECOND) {
		setFps(FPS);
		FPS = 0.0;
		timer = 0.0;
	}
}

var timer = 0.0;

function draw() {
	// clear canvas
	canvas.width = canvas.width;
	timing();
	PONG.draw();
}

function keydown() {
	var x = event.which;
	if (window.event) {
		x = event.keyCode;
	}
	if (x == "W".charCodeAt(0)) {
		LEFT.moveUP();
	} else if (x == "S".charCodeAt(0)) {
		LEFT.moveDOWN();
	} else if (x == "O".charCodeAt(0)) {
		RIGHT.moveUP();
	} else if (x == "K".charCodeAt(0)) {
		RIGHT.moveDOWN();
	} else if (x == "R".charCodeAt(0)) {
		PONG.reset();
	} else if (x == "P".charCodeAt(0)) {
		PONG.pause();
	}
}

function keyup() {
	var x = event.which;
	if (window.event) {
		x = event.keyCode;
	}
	if (x == "W".charCodeAt(0) || x == "S".charCodeAt(0)) {
		LEFT.stop();
	} else if (x == "O".charCodeAt(0) || x == "K".charCodeAt(0)) {
		RIGHT.stop();
	}
}
