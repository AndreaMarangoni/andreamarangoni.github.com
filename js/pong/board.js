function BoardGame(w, h) {

	var properties = {
		width : w,
		height : h,
		left_score : 0,
		right_score : 0
	};

	var center = [ properties.width / 2.0, properties.height / 2.0 ];
	var leftMargin = 20;
	var rightMargin = properties.width - leftMargin;
	var leftScorePosition = [ center[0] / 2.0, 100 ];
	var rightScorePosition = [ center[0] + leftScorePosition[0], 100 ];

	this.getWidth = function() {
		return properties.width;
	};

	this.getHeight = function() {
		return properties.height;
	};

	this.scoreLeft = function() {
		properties.left_score += 1;
	};

	this.scoreRight = function() {
		properties.right_score += 1;
	};

	this.getLeftScore = function() {
		return properties.left_score;
	};

	this.getRightScore = function() {
		return properties.right_score;
	};

	this.resetScores = function() {
		properties.left_score = properties.right_score = 0;
	};

	this.draw = function() {
		ctx.beginPath();
		ctx.lineWidth = 1.5;
		ctx.strokeStyle = 'white';
		ctx.fillStyle = 'white';

		/* Left Line */
		ctx.moveTo(leftMargin, 0);
		ctx.lineTo(leftMargin, properties.height);
		ctx.stroke();

		/* Central line */
		ctx.moveTo(center[0], 0);
		ctx.lineTo(center[0], properties.height);
		ctx.stroke();

		/* Right Line */
		ctx.moveTo(rightMargin, 0);
		ctx.lineTo(rightMargin, properties.height);
		ctx.stroke();

		/* Left Score */
		ctx.font = "30pt Arial";
		ctx.fillText(String(properties.left_score), leftScorePosition[0],
				leftScorePosition[1]);

		/* Right Score */
		ctx.font = "30pt Arial";
		ctx.fillText(properties.right_score, rightScorePosition[0],
				rightScorePosition[1]);
	};
};