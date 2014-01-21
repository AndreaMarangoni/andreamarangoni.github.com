var Asteroids = function(params) {

	var SPLASH = "splash";
	var rocks = new Set();
	var numRock = 0;
	var explosions = new Set();
	var numExplosion = 0;
	var spawnTimer = 0.0;
	var score = 0;
	var lives = 3;
	var started = false;
	var paused = false;
	var ship = null;
	var immTimer = 0.0;
	var immortal = false;
	var recap = false;
	var recapTimer = 0.0;

	function recapScore() {
		if (recap) {
			ctx.font = "normal 40px Arial";
			ctx.fillStyle = "white";
			recapTimer = recapTimer + TIMER.getTslf();
			ctx.fillText(" Your Final Score is " + score,
					canvas.width / 2 - 200, canvas.height / 2);
			if (recapTimer >= RECAP) {
				recapTimer = 0.0;
				recap = false;
				reset();
			}
		}
	}

	function updateRocks() {
		process_sprite_group(rocks);
	}

	function drawSplash() {
		ctx.drawImage(IMAGES[SPLASH], canvas.width / 2
				- splashInfo.getCenter()[0], canvas.height / 2
				- splashInfo.getCenter()[1]);
	}

	function updateExplosions() {
		process_sprite_group(explosions);
	}

	function drawShield() {
		var centerX = ship.getPosition()[0];
		var centerY = ship.getPosition()[1];
		var radius = ship.getRadius();
		ctx.beginPath();
		ctx.arc(centerX, centerY, radius + 5, 0, 2 * Math.PI, false);
		ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
		ctx.fill();
	}

	function checkImmortality() {
		if (immortal) {
			drawShield();
			immTimer = immTimer + TIMER.getTslf();
			if (IMMORTALITY != -1 && immTimer >= IMMORTALITY) {
				immTimer = 0;
				immortal = false;
			}
		}
	}

	function resetShip() {
		immortal = true;
		ship = new Ship({
			pos : [ canvas.width / 2.0, canvas.height / 2.0 ],
			info : shipInfo
		});
	}

	function checkRockShipCollision() {
		var keys = rocks.keys();
		var hit = false;
		for ( var i = 0; i < keys.length && !hit; ++i) {
			var sprite = rocks.get(keys[i]);
			if (ship != null && ship != undefined
					&& sprite.checkCollision(ship)) {
				hit = true;
				score = score + HIT_BY_ROCK;
				var shipExplosion = new Sprite({
					pos : [ ship.getPosition()[0], ship.getPosition()[1] ],
					size : [ shipInfo.getSize()[0], shipInfo.getSize()[1] ],
					image : IMAGES[SHIP_EXPLOSION],
					info : explosionInfo
				});
				var explosion = new Sprite({
					pos : [ sprite.getPosition()[0], sprite.getPosition()[1] ],
					size : [ asteroidInfo.getSize()[0],
							asteroidInfo.getSize()[1] ],
					image : IMAGES[ROCK_EXPLOSION],
					info : explosionInfo
				});
				rocks.remove(keys[i]);
				explosions.add(numExplosion, explosion);
				numExplosion = numExplosion + 1;
				if (!immortal) {
					lives = lives - 1;
					explosions.add(numExplosion, shipExplosion);
					numExplosion = numExplosion + 1;
					delete ship;
					ship = null;
					resetShip();
				}
			}
		}
	}

	function checkRockMissilesCollision() {
		if (ship == null || ship == undefined) {
			return;
		}
		var hit = false;
		var rk = rocks.keys();
		var missiles = ship.getMissiles();
		var mk = missiles.keys();
		for ( var r = 0; r < rk.length && !hit; ++r) {
			var rock = rocks.get(rk[r]);
			for ( var m = 0; m < mk.length && !hit; ++m) {
				var missile = missiles.get(mk[m]);
				if (rock.checkCollision(missile)) {
					hit = true;
					var addToScore = 0;
					if (rock.getKind() == "rock") {
						addToScore = HIT_A_ROCK;
						createChild(rock);
					} else {
						addToScore = HIT_A_MINIROCK;
					}
					var explosion = new Sprite({
						pos : [ rock.getPosition()[0], rock.getPosition()[1] ],
						size : [ asteroidInfo.getSize()[0],
								asteroidInfo.getSize()[1] ],
						image : IMAGES[ROCK_EXPLOSION],
						info : explosionInfo
					});
					explosions.add(numExplosion, explosion);
					numExplosion = numExplosion + 1;
					rocks.remove(rk[r]);
					missiles.remove(mk[m]);
					score = score + addToScore;
				}
			}
		}
	}

	function checkCollisions() {
		checkRockShipCollision();
		checkRockMissilesCollision();
	}

	function createRandomRock() {
		if (rocks.keys().length >= MAX_ROCKS) {
			return;
		}
		var pos = [ randomInRange(0, canvas.width),
				randomInRange(0, canvas.height) ];
		while (ship != null && ship != undefined
				&& (dist(ship.getPosition(), pos) <= GAP)) {
			pos = [ randomInRange(0, canvas.width),
					randomInRange(0, canvas.height) ];
		}
		var vel = angleToVector(randomInRange(A_LO, A_UP));
		vel[0] *= SEQ.randomElement() * randomInRange(XLO, XUP);
		vel[1] *= SEQ.randomElement() * randomInRange(YLO, YUP);
		var rotateSpeed = randomInRange(S_LO, S_UP);
		var rock = new Sprite({
			pos : pos,
			vel : vel,
			size : asteroidInfo.getSize(),
			angle : 0,
			angle_vel : rotateSpeed,
			image : IMAGES[ROCK],
			info : asteroidInfo
		});
		rocks.add(numRock, rock);
		numRock = numRock + 1;
	}

	function createChild(rock) {
		for ( var i = 0; i < CHILDS; ++i) {
			var vel = angleToVector(randomInRange(A_LO, A_UP));
			vel[0] *= SEQ.randomElement() * randomInRange(XLO, XUP);
			vel[1] *= SEQ.randomElement() * randomInRange(YLO, YUP);
			var rotateSpeed = randomInRange(S_LO, S_UP);
			var mini_rock = new Sprite({
				pos : [ rock.getPosition()[0], rock.getPosition()[1] ],
				vel : vel,
				size : [ 35, 35 ],
				angle_vel : rotateSpeed,
				image : IMAGES[ROCK],
				info : miniAsteroidInfo
			});
			rocks.add(numRock, mini_rock);
			numRock = numRock + 1;
		}
	}

	function rockSpawner() {
		spawnTimer = spawnTimer + TIMER.getTslf();
		if (spawnTimer > SPAWN_TIME) {
			spawnTimer = 0.0;
			createRandomRock();
		}
	}

	function drawGui() {
		ctx.fillStyle = 'white';
		ctx.font = 'normal 20px Arial';
		ctx.fillText("Score " + score, canvas.width - 130, 40);
		ctx.fillText("Lives " + lives, 20, 40);
	}

	function checkLives() {
		if (lives == 0) {
			recap = true;
		}
	}

	return {
		getShip : function() {
			return ship;
		},
		init : function() {
			// CREATE THE ship
			ship = new Ship({
				pos : [ canvas.width / 2.0, canvas.height / 2.0 ],
				info : shipInfo
			});

			if (IMMORTALITY === -1) {
				immortal = true;
			}

		},
		start : function() {
			started = true;
		},
		reset : function() {
			reset();
		},
		setPause : function(value) {
			paused = value;
		},
		pause : function() {
			paused = !paused;
		},
		isStarted : function() {
			return started;
		},
		draw : function() {
			TIMER.update();
			/* Draw background */
			gtime = gtime + 1.0;
			wtime = (gtime / 4.0) % canvas.width - (canvas.width / 2.0);
			ctx.drawImage(IMAGES[NEBULA], 0, 0);
			ctx.drawImage(IMAGES[DEBRIS], 0, 0, canvas.width, CANVAS_HEIGHT,
					wtime - CANVAS_WIDTH / 2, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
			ctx.drawImage(IMAGES[DEBRIS], 0, 0, canvas.width, CANVAS_HEIGHT,
					wtime + CANVAS_WIDTH / 2, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

			ctx.fillStyle = 'white';
			ctx.font = 'normal 20px Arial';
			if (paused) {
				drawSplash();
				return;
			} else if (!started) {
				drawSplash();
				ctx.fillText(" R : new game ", canvas.width / 2.0 - 90,
						canvas.height / 2 + 75);
				ctx.fillText(" P : pause ", canvas.width / 2.0 - 90,
						canvas.height / 2 + 100);
				return;
			} else if(recap){
				recapScore();
				return;
			}

			checkCollisions();
			rockSpawner();
			checkLives();
			if (ship) {
				ship.draw();
				ship.update();
			}
			checkImmortality();
			updateRocks();
			updateExplosions();
			drawGui();
		}
	};
};

function reset() {
	delete ASTEROIDS;
	ASTEROIDS = null;
	delete TIMER;
	TIMER = null;
	init();
}

function init() {
	canvas = document.getElementById("canvas");
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;
	ctx = canvas.getContext('2d');

	// CREATE TIMER
	TIMER = new Timer();
	ASTEROIDS = new Asteroids();
	ASTEROIDS.init();
}

function run() {
	init();
	animate();
}

function animate() {
	requestAnimFrame(animate);
	draw();
}

function draw() {
	// clear canvas
	canvas.width = canvas.width;
	ASTEROIDS.draw();
}

function mouse() {
	console.log("click");
	ASTEROIDS.start();
	ASTEROIDS.setPause(false);
}

function keydown() {
	var x = event.which;
	if (window.event) {
		x = event.keyCode;
	}
	var ship = ASTEROIDS.getShip();
	if (!isNull(ship) && x == " ".charCodeAt(0)) {
		ship.shoot();
	}
	if (!isNull(ship) && x == "J".charCodeAt(0)) {
		ship.left();
	} else if (!isNull(ship) && x == "L".charCodeAt(0)) {
		ship.right();
	}
	if (!isNull(ship) && x == "I".charCodeAt(0)) {
		ship.accelerate();
	}
	if (ASTEROIDS.isStarted()) {
		if (x == "R".charCodeAt(0)) {
			ASTEROIDS.reset();
		} else if (x == "P".charCodeAt(0)) {
			ASTEROIDS.pause();
		}
	}
}

function keyup() {
	var x = event.which;
	if (window.event) {
		x = event.keyCode;
	}
	var ship = ASTEROIDS.getShip();
	if (!isNull(ship) && x == "J".charCodeAt(0)) {
		ship.stopRotate();
	} else if (!isNull(ship) && x == "L".charCodeAt(0)) {
		ship.stopRotate();
	}
	if (!isNull(ship) && x == "I".charCodeAt(0)) {
		ship.decelerate();
	}
}
