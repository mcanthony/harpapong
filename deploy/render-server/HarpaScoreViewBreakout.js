var ArtnetPixelMapper = require("./ArtnetPixelMapper.js").ArtnetPixelMapper;
var Canvas = require("canvas");
var winston = require("winston");

var GoalEffect = require("./effects/GoalEffect.js");
var WaitEffect = require("./effects/WaitEffect.js");
var SleepEffect = require("./effects/SleepEffect.js");

var tX = 0;
var tY = 0;

var NUM_LIVES_MAX = 10;

var HarpaGameView = function(ip, patchdata, width, height){

	this.width = width;
	this.height = height;
	this.pixelmapper = new ArtnetPixelMapper(ip);
	this.pixelmapper.setup(this.width, this.height, patchdata);

	this.canvas = new Canvas(this.width, this.height);
	this.ctx = this.canvas.getContext("2d");
	this.ctx.antialias = "none";
	this.ctx.font = "2pt Arial";

	this.goalEffect = new GoalEffect(this.ctx, this.width, this.height);

	this.waitEffect = new WaitEffect(this.ctx, this.width, this.height);
	this.currentMode = "blackout";

	this.sleepEffect = new SleepEffect(this.ctx, this.width, this.height);

	this.screensaverCanvas = new Canvas(this.width, this.height);
	this.screensaverCtx = this.screensaverCanvas.getContext("2d");

};

var p = HarpaGameView.prototype;


p.render = function(game, mode){

	if (mode != this.currentMode){
		winston.info("Score View changed mode to " + mode);

		switch(mode){

			case "goal":

			break;
			case "wait":

			break;
			case "game":

			break;
		}
	}
	this.currentMode = mode;

	this.canvas.width = 0;
	this.canvas.height = 0;

	this.canvas.width = this.width;
	this.canvas.height = this.height;

	//this.ctx.clearRect(0,0,this.width, this.height);

	//this.ctx.fillStyle = "black";
	//this.ctx.fillRect(0,0,35, 12);

	//mode = "game";

	switch(mode){

		case "test":

			this.ctx.strokeStyle = "green";
			this.ctx.lineWidth = 1;
			this.ctx.moveTo(0,tY);
			this.ctx.lineTo(this.width,tY);
			tY++;
			if (tY > this.height) tY = 0;
			this.ctx.stroke();

		break;

		case "scoreTest":
			
			

		break;

		case "goal":

			this.goalEffect.render();

		case "game":

			// draw scores for A
			// 
			// 
			var startX = 2;
			//var startX = 5;
			var startY = 0;
			//var startY = 0;
		

			for (var i =0; i < NUM_LIVES_MAX; i++){
				if ( i < game.lives.a)
					this.ctx.fillStyle = "white";
				else 
					this.ctx.fillStyle = "green";

				this.ctx.fillRect(startX + (i * 3), startY, 2, 1);

			}

			for (var i =0; i < NUM_LIVES_MAX; i++){
				if ( i < game.lives.b)
					this.ctx.fillStyle = "white";
				else 
					this.ctx.fillStyle = "green";

				this.ctx.fillRect(startX + (i * 3) + 2, startY + 2, 2, 1);

			}


		break;

		case "wait":

			this.waitEffect.render();

		break;

		case "sleep":

			this.sleepEffect.render();

		break;

		case "screensaver":

			this.ctx.drawImage(this.screensaverCanvas,0,0);

		break;

		case "blackout":
			// do nothing
			
		break;

	}

	// get image data and send to pixelmapper
	var imgData = this.ctx.getImageData(0,0,this.width, this.height).data;

	
	var x, y = 0;
	var index = 0;
	for (var i = 0; i < imgData.length; i+=4){

		y = Math.floor( (i / 4) / this.width );
		x = (i / 4) % this.width;
		
		this.pixelmapper.setPixel(x, y, imgData[i], imgData[i+1], imgData[i+2]);
		
	}
	

	this.pixelmapper.render();

}

// utility methods for testing

p.blackout = function() {
	this.pixelmapper.setAllTo(0,0,0,true);
};

p.blind = function() {
	this.pixelmapper.setAllTo(255,255,255,true);
}

module.exports = HarpaGameView;