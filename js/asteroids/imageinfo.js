
function ImageInfo(properties){
	
	var params = {
		center : [0,0],
		size : [0, 0],
		kind : "None",
		radius : 0.0,
		lifespan : "Nan",
		animated : false
	};
	
	params = $.extend({}, params, properties);
	
	
	this.getCenter = function(){
        return params['center'];
	};

	this.getSize = function(){
        return params['size'];
	};

    this.getRadius = function(){
    	return params['radius'];
    };

    this.getLifespan = function(){
    	return params['lifespan'];
    };

    this.getAnimated = function(){
    	return params['animated'];
    };
    
    this.getKind = function(){
    	return params['kind'];
    };
};