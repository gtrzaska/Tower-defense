function Net() {
	this.play = function() {
		$.ajax({
			url: "192.168.0.3",
			data: {},	//ewentualnie jakis nick czy cos takiego
			type: "POST",
			success: function(data) {
				if (data <= 2) {
					side = data;

					menu = false;
					Board = new Board()
					Camera = new Camera()
					Models = new Models()
					setTimeout(function () {  // mapa pojawia się z opóźnieniem aby nie było widać jak sie ładuje
						scene.remove(menuMesh)
						$("#menu").remove();
						$("#main").css("visibility", "visible")
						$("#interfaces").css("visibility", "visible")
					}, 200);

					if (side == 2) {
						camera.position.z = -700;	//drugi gracz patrzy z drugiej strony
						camera.lookAt(scene.position);

						side = -1;	//zeby potem przy wszelkich pozycjach wystarczylo przemnozyc przez side i przy pierwszym graczu nie robi to roznicy bo mnozy sie *1 a przy drugim daja odwrotna wartosc
						client.emit("isTwoPlayers", {});	//wysyla info ze drugi gracz sie podlaczyl
					} else {	//wlacza interval oczekujacy na drugiego gracza
						div = createDivAtCenter();

						document.body.appendChild(div);

						var dots = 0;

						intervalListener = setInterval(function() {
							div.innerHTML = "Waiting for the second player";

							for (i = 0; i < dots % 4; i++) {
								div.innerHTML = div.innerHTML + ".";
							}
							dots++;
						}, 500);
					}
				} else {
					canRender = true;
					side = 0;	//gdy side == 0 to znaczy ze jest juz dwoch graczy
					alert("Już jest dwóch graczy");
				}
			},
			error: function (xhr, status, error) {
				console.log("Error przy wybieraniu strony gry " + error.message);
			}
		})
	}

	client.on("twoPlayers", function(data) {	//funkcja ktora rozpoczyna gre po odliczeniu do trzech
		client.emit("name", {"name": name});	//wysyla nick

		if (side == 1) {	//usuwanie diva ktory pokazywal info o oczekiwaniu na drugiego gracza
			document.body.removeChild(div);
			clearInterval(intervalListener);
		}

		var seconds = 3;

		div = createDivAtCenter();
		div.innerHTML = seconds;

		document.body.appendChild(div);

		var interval = setInterval(function() {
			seconds--;
			if (seconds > 0) {
				div.innerHTML = seconds;
			} else if (seconds == 0) {
				div.innerHTML = "Start!";
			} else {
				clearInterval(interval);
				document.body.removeChild(div);
				isAlive = true;
			}
		}, 1000)
	})

	client.on("enemyName", function(data) {
		enemyName = data.name;
		canvasUi.updateEnemyHealthBar();
	})

	client.on("stats", function(data) {
		var stats = document.getElementById("stats");
		wins = data.wins;
		loses = data.loses;
		stats.innerHTML = "Wins: " + wins + "<br /> Loses: " + loses;
	})

	client.on("addSoldier", function(data) {
		enemySoldiersModels.push(new SoldierClone(soldiers[data.type].mesh.clone(), soldiers[data.type].health, soldiers[data.type].speed, soldiersAmount, soldiers[data.type].cost));
		enemySoldiersModels[enemySoldiersModels.length - 1].mesh.position.set(data.positionX, data.positionY, data.positionZ);	//pozycja
		if (side == -1) {
			enemySoldiersModels[enemySoldiersModels.length - 1].mesh.rotation.y = Math.PI;
		} else {
			enemySoldiersModels[enemySoldiersModels.length - 1].mesh.rotation.y = Math.PI * 2;
		}
		enemySoldiersModels[enemySoldiersModels.length - 1].moveX *= -1;

		soldiersAmount++;
	})

	client.on("addTower", function(data) {
		Towers.createTower(data.positionX, data.positionY, data.positionZ, data.type);
	})

	client.on("addBullet", function(data) {
		bullets.push(new Bullet(new THREE.Vector3(data.meshPositionX, 0, data.meshPositionZ), new THREE.Vector3(data.targetPositionX, 0, data.targetPositionZ)));
		if (soldiersModels[data.soldierNumber].death(data.damage)) {	//przy strzale zadaje obrazenia i sprwadza czy zolnierz umarl
			scene.remove(soldiersModels[data.soldierNumber].mesh);
			soldiersModels.splice(data.soldierNumber, 1);
		}
	})

	client.on("substractLife", function(data) {
		enemyLives--;
		canvasUi.substractEnemyLife();
	})

	client.on("win", function(data) {
		if (Math.abs(side) == 1) {	//na wypadek gdyby wiecej graczy chcialo sie dostac do gry to bez tego ifa tez by dostali komunikat
			canRender = false;
			isAlive = false;
			div = createDivAtCenter();
			div.innerHTML = "VICTORY!!!";

			document.body.appendChild(div);

			client.emit("win", {"name": name, "wins": wins});
		}
	})

	function createDivAtCenter() {
		var div = document.createElement("div");
		div.style.position = "absolute";
		div.style.top = "50%";
		div.style.left = "50%";
		div.style.transform = "translate(-50%, -50%)";
		div.style.width = "auto";
		div.style.color = "white";
		div.style.fontSize = "50px";

		return div;
	}
}