function fadeColor(from, to, callback, duration, framesPerSecond){
	function doTimeout(color, frame){
		setTimeout(function (){
			callback(color);
		}, (duration * 1000 / framesPerSecond) * frame);
	}

	duration = duration || 1;
	framesPerSecond = framesPerSecond || 15 * duration;

	var frame = 1;
	var r, g, b;

	doTimeout('rgb(' + from.r + ',' + from.g + ',' + from.b + ')', 0);

	while(frame < framesPerSecond + 1){
		r = Math.ceil(from.r * (framesPerSecond - frame)/framesPerSecond + to.r * frame/framesPerSecond);
		g = Math.ceil(from.g * (framesPerSecond - frame)/framesPerSecond + to.g * frame/framesPerSecond);
		b = Math.ceil(from.b * (framesPerSecond - frame)/framesPerSecond + to.b * frame/framesPerSecond);

		doTimeout('rgb(' + r + ',' + g + ',' + b + ')', frame++);
	}
}