
function setFps(value) {
	document.getElementById("fps").innerHTML = "Fps: " + value;
}

function Timer(){
	var SECOND = 1.0;
	
	var properties = {
		fFps : 0.0,
		started : new Date().getTime(),
		tslf : 0.0,
		timer : 0.0,
		now : 0.0
	};
	
	this.getTslf = function(){
		return properties.tslf;
	};
	
	this.getFps = function(){
		return properties.fFps;
	};
	
	this.update = function(){
		properties.fFps = properties.fFps + 1.0;
		properties.now = new Date().getTime();
		properties.tslf = (properties.now - properties.started) / 1000;
		properties.timer = properties.timer + properties.tslf;
		properties.started = properties.now;
		if (properties.timer >= SECOND) {
			setFps(properties.fFps);
			properties.fFps = 0.0;
			properties.timer = 0.0;
		}
	};	
}