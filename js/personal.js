$(document).ready(function() {
	var SIZE = 14;
	var WIDTH = 4;
	var HEIGHT = 2;

	function tiled_favicon() {
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

	function stripTrailingSlash(str) {
		if (str.substr(-1) == '/') {
			return str.substr(0, str.length - 1);
		}
		return str;
	}

	var url = window.location.pathname;
	var activePage = stripTrailingSlash(url);

	$('.nav li a').each(function() {
		var currentPage = stripTrailingSlash($(this).attr('href'));
		if (activePage == currentPage) {
			$(this).parent().addClass('active');
		}
	});

	tiled_favicon();
});
