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

var PONG;
var BOARD;
var LEFT;
var RIGHT;
var CANVAS_WIDTH = 600;
var CANVAS_HEIGHT = 400;
var PADDLE_WIDTH = 20;
var PADDLE_HEIGHT = 100;
var FPS = 0;
var SECOND = 1.0;
var started = 0.0;
var tslf = 0.0;
var timer = 0.0;