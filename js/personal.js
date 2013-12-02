$(document).ready(function() {
	var SIZE = 14;
	var WIDTH = 3;
	var HEIGHT = 2;

	function tile() {
		var li = $("i[class^=favicon");
		var left = 0;
		var top = 0;
		for ( var i = 0; i < HEIGHT; ++i) {
			for ( var j = 0; j < WIDTH; ++j) {
				var curr = li.eq(j + WIDTH * i);
				var y = left - SIZE * j;
				var x = top - SIZE * i;
				curr.css("background-position", y + "px " + x + "px");
			}
		}
	}
	tile();
});
