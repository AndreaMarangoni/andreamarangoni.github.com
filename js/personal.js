$( document ).ready(function() {
    var SIZE = 14;
    var WIDTH = 3;
    var HEIGHT = 2;
    
    function tile(){
        var li = $("i[class^=fav-");
        var left  = 0;
        var top  = 0;
        for(var i=0;i < HEIGHT; ++i){
            for(var j= 0; j < WIDTH;++j){
            	console.log(left," ", top);
                li.eq(i * WIDTH + j).css('background-position-x', left);
                li.eq(i * WIDTH + j).css('background-position-y', top);
                left -= j * SIZE;
            	top -= i * SIZE;
            }
        }
    }
    
});
