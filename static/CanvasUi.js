function CanvasUi() {
	var canvas = document.createElement("canvas");
	canvas.width = window.innerWidth * 0.24;
	canvas.height = 100;
	canvas.style.position = "fixed";
	canvas.style.left = "38%";
	canvas.style.bottom = "0";

	document.getElementById("ui").appendChild(canvas);

	var ctx = canvas.getContext("2d");

	var canvasEnemy = document.createElement("canvas");
	canvasEnemy.width = window.innerWidth * 0.24;
	canvasEnemy.height = 80;
	canvasEnemy.style.position = "fixed";
	canvasEnemy.style.left = "38%";
	canvasEnemy.style.top = "0";

	document.getElementById("ui").appendChild(canvasEnemy);

	var ctxEnemy = canvasEnemy.getContext("2d");

	var livesMultiplier = lives;
	var enemyLivesMultiplier = enemyLives;

	healthBar();
	coins();

	enemyHealthBar();

	function healthBar() {
		ctx.beginPath();

		//rysowanie czerwonego paska zycia
		ctx.fillStyle = "#71C935";
		ctx.rect(0, canvas.height - 40, canvas.width / 20 * livesMultiplier, 30);
		ctx.fill();

		//obrys wokol tego paska
		ctx.strokeStyle = "black";
		ctx.rect(0, canvas.height - 40, canvas.width, 30);
		ctx.stroke();

		//ilosc zycia
		ctx.font = "20px arial";
		ctx.fillStyle = "white";
		ctx.fillText(lives, canvas.width / 2 - 10, canvas.height - 18);

		ctx.closePath();
	}

	this.substractLife = function() {
		var counter = 0;
		var interval = setInterval(function() {
			livesMultiplier -= 0.1;

			if (counter < 9) {
				ctx.clearRect(0, canvas.height - 45, canvas.width, 40);
				healthBar();
			} else {
				clearInterval(interval);
			}
			counter++;
		}, 80);
	}

	//pasek zycia przeciwnika
	function enemyHealthBar() {
		ctxEnemy.beginPath();

		//rysowanie czerwonego paska zycia
		ctxEnemy.fillStyle = "#D1044C";
		ctxEnemy.rect(0, 10, canvasEnemy.width / 20 * enemyLivesMultiplier, 30);
		ctxEnemy.fill();

		//obrys wokol tego paska
		ctxEnemy.strokeStyle = "black";
		ctxEnemy.rect(0, 10, canvasEnemy.width, 30);
		ctxEnemy.stroke();

		//ilosc zycia
		ctxEnemy.font = "20px arial";
		ctxEnemy.fillStyle = "white";
		ctxEnemy.fillText(enemyLives, canvasEnemy.width / 2 - 10, 32);

		if (enemyName != "") {
			ctxEnemy.font = "25px arial";
			ctxEnemy.textAlign = "center"; 
			ctxEnemy.fillStyle = "#DF182E";
			ctxEnemy.strokeStyle = "#90182E";
			ctxEnemy.lineWidth = 1;
			ctxEnemy.fillText(enemyName, canvasEnemy.width / 2, 60);
			ctxEnemy.strokeText(enemyName, canvasEnemy.width / 2, 60);
		}

		ctxEnemy.closePath();
	}

	this.substractEnemyLife = function() {
		var counter = 0;
		var interval = setInterval(function() {
			enemyLivesMultiplier -= 0.1;

			if (counter < 9) {
				ctxEnemy.clearRect(0, 0, canvasEnemy.width, canvasEnemy.height);
				enemyHealthBar();
			} else {
				clearInterval(interval);
			}
			counter++;
		}, 80);
	}

	this.updateEnemyHealthBar = function() {
		ctxEnemy.font = "25px arial";
		ctxEnemy.textAlign = "center"; 
		ctxEnemy.fillStyle = "#DF182E";
		ctxEnemy.strokeStyle = "#90182E";;
		ctxEnemy.lineWidth = 1;
		ctxEnemy.fillText(enemyName, canvasEnemy.width / 2, 60);
		ctxEnemy.strokeText(enemyName, canvasEnemy.width / 2, 60);
	}

	function coins() {
		ctx.beginPath();

		coin = new Image();
		coin.src = "textures/coin.png";
		coin.onload = function() {	//gdy obrazek jest zaladowany
			ctx.drawImage(coin, 0, canvas.height - 85);

			//ilosc golda
			ctx.font = "20px arial";
			ctx.fillStyle = "gold";
			ctx.fillText(goldNumber, 40, canvas.height - 62);
		}

		coinpsec = new Image();
		coinpsec.src = "textures/coinpsecond.png";
		coinpsec.onload = function() {	//gdy obrazek jest zaladowany
			ctx.drawImage(coinpsec, canvas.width - 35, canvas.height - 85);

			//ilosc golda
			ctx.font = "20px arial";
			ctx.fillStyle = "gold";
			ctx.fillText(goldPerSecond, canvas.width - 70, canvas.height - 62);
		}

		ctx.closePath();
	}

	this.updateCoins = function() {
		ctx.clearRect(0, canvas.height - 85, canvas.width, 40);
		coins();
	}
}