function Board() {
	Towers = new Towers();
	planeMesh = []
	soldiersModels = [];
	enemySoldiersModels = [];
	soldiersAmount = 0;
	bulletMesh = []
	bulletTarget = []
	bullets = [];
	var delta
	var clock = new THREE.Clock();
	var goldTime = 0;	//zmienna przechowujaca czas pomiedzy kolejnym dodawanie golda

	function init() {

		//mapa 3- baza , 2.4.5.6.7-miejsce do budowy wież, 1- ścieżka , 0 - trawa, -1 - woda ,  -2 - krzak , -3 - drzewo, -4 inny krzok
		map = [
			[0, 0, 0, 0, 0, -3, 0, 0, 0, 0, 0, -3, 0, 0, -2, 0],
			[0, -2, 0, 0, 0, 0, 0, 2,2, 2, 2, 2, 2, 0, 0, 0],
			[0, 0, 0, 0, 0, -3, 0, 2, 7, 1, 1, 5, 2, 0, 0, -3],
			[0, -3, 0, 0, 0, 0, 0, 2, 1, 2, 2, 1, 2, -3, 0, 0],
			[0, -2, 0, 2, 2, 2, 2, 2, 1, 2, 2, 1, 2, -2, 0, 0],
			[0, 0, 0, 2, 7, 1, 1, 1, 6, 2, 2, 1, 2, 2, 2, 0],
			[-3, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 7, 1, 5, 2, -2],
			[0, 2, 7, 1, 6, 2, 0, -3, 0, 0, 2, 2, 2, 1, 2, 0],
			[0, 2, 1, 2, 2, 2, -3, -1, -1, 0, 0, 0, 2, 1, 2, 0],
			[0, 2, 1, 2, 0, 0, -1, -1, -1, -1, 0, 0, 0, 3, 0, 0],
			[0, 0, 3, 0, 0, -1, -1, -1, -1, -2, 0, 0, 2, 1, 2, 0],
			[0, 2, 1, 2, 0, 0, -1, -1, -1, 0, 2, 2, 2, 1, 2, 0],
			[-3, 2, 1, 2, 2, 2, -2, 0, -3, 0, 2, 5, 1, 4, 2, 0],
			[0, 2, 6, 1, 4, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 0],
			[0, 2, 2, 2, 1, 2, 2, 5, 1, 1, 1, 4, 2, 0, 0, -3],
			[-3, 0, 0, 2, 1, 2, 2, 1, 2, 2, 2, 2, 2, 0, 0, -3],
			[0, 0, 0, 2, 1, 2, 2, 1, 2, -2, 0, 0, -3, 0, 0, 0],
			[0, -2, 0, 2, 6, 1, 1, 4, 2, 0, 0, 0, 0, 0, 0, 0],
			[0, -3, 0, 2, 2, 2, 2, 2, 2, 0, -2, 0, 0, -2, 0, 0],
			[0, 0, 0, 0, 0, 0, -3, 0, 0, -3, 0, 0, -3, 0, 0, 0],
	  	];
		var p = 0

		plant = ['plant1','banana'] //Rośliny
		 
	//	scene = new THREE.Scene();
	//	var axis = new THREE.AxisHelper(1000)
	//	scene.add(axis)
/*
		camera = new THREE.PerspectiveCamera(
			45, 
			4 / 3,
			0.1, 
			10000 
		);
		renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor(0xffffff);
*/
	    // Tworzenie pocisku którego potem sie ędzie klonować
		Skybox = new Skybox()
		bulletGeometry = new THREE.SphereGeometry(5, 10, 5)
		bulletMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
		bMesh = new THREE.Mesh(bulletGeometry, bulletMaterial);
		bMesh.position.y = -500;
		scene.add(bMesh);


		// Tworzenie planszy
		var planeGeometry = new THREE.PlaneBufferGeometry(50, 50, 1, 1);

		planeMaterial = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture("textures/grass.jpg"), side: THREE.DoubleSide});
		grass = new THREE.Mesh(planeGeometry, planeMaterial);
		grass.rotateX(Math.PI / 2);
		scene.add(grass);

		planeMaterial = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture("textures/ground.jpg"), side: THREE.DoubleSide});
		ground = new THREE.Mesh(planeGeometry, planeMaterial);
		ground.rotateX(Math.PI / 2);
		scene.add(ground);

		planeMaterial = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture("textures/stone.jpg"), side: THREE.DoubleSide});
		stone = new THREE.Mesh(planeGeometry, planeMaterial);
		stone.rotateX(Math.PI / 2);
		scene.add(stone);

		planeMaterial = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture("textures/castle.png"), side: THREE.DoubleSide});
		castle = new THREE.Mesh(planeGeometry, planeMaterial);
		castle.rotateX(Math.PI / 2);
		scene.add(castle);

		planeMaterial = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture("textures/lake.jpg"), side: THREE.DoubleSide});
		lake = new THREE.Mesh(planeGeometry, planeMaterial);
		lake.rotateX(Math.PI / 2);
		scene.add(lake);

		plant1 = new Plant(0);
		banana = new Plant(1);

		for (i = 0; i < 20; i++) {
			for (j = 0; j < 16; j++) {

				if (map[i][j] == 0 || map[i][j] == -2 || map[i][j] == -3)
					planeMesh.push(grass.clone());
				else if (map[i][j] == 1 || map[i][j] == 4 || map[i][j] == 5 || map[i][j] == 6 || map[i][j] == 7)
					planeMesh.push(ground.clone());
				else if (map[i][j] == 2 )
					planeMesh.push(stone.clone());
				else if (map[i][j] == 3)
					planeMesh.push(castle.clone());
				else if (map[i][j] == -1)
					planeMesh.push(lake.clone());

				planeMesh[p].name = map[i][j]

			//	planeMesh[p].rotateX(Math.PI / 2);
				planeMesh[p].position.x = (i - 9.5) * 50
				planeMesh[p].position.z = (j - 7.5) * 50
				scene.add(planeMesh[p]);

			   p++
			}
		}
	 
		document.getElementById("main").appendChild(renderer.domElement);

		camera.position.x = 0;
		camera.position.y = 600;
		camera.position.z = 770;

		function animateScene() {
		    camera.lookAt(scene.position);
			if (canRender) {	//gra toczy sie jedynie jesli gracz zyje
				delta = clock.getDelta();

				goldTime += delta;
				if (goldTime >= 1) {
					goldTime = 0;
					addGold(goldPerSecond);
				}


				requestAnimationFrame(animateScene);
				renderer.render(scene, camera);
				
				for (i = 0; i < soldiersModels.length; i++) {
					soldiersModels[i].mesh.updateAnimation(delta * 100);
				}
				for (i = 0; i < enemySoldiersModels.length; i++) {
					enemySoldiersModels[i].mesh.updateAnimation(delta * 100);
				}

				if (towersModels.length > 0 && enemySoldiersModels.length > 0) {
					//czy pocisk zawiera sie w rangu wiezy
					for (i = 0; i < towersModels.length; i++) {
						towersModels[i].addTime(delta);

						if (towersModels[i].canShoot()) {
							for (j = 0; j < enemySoldiersModels.length; j++) {
								if (enemySoldiersModels[j].mesh.position.distanceTo(towersModels[i].mesh.position) < towersModels[i].range) {
									//towersModels.bullets(towersModels[i].mesh.position.x, towersModels[i].mesh.position.y, towersModels[i].mesh.position.z, j)
									bullets.push(new Bullet(towersModels[i].mesh.position, enemySoldiersModels[j].mesh.position));

									client.emit("bulletAdded", {
										damage: towersModels[i].damage,
										soldierNumber: j,
										meshPositionX: towersModels[i].mesh.position.x,
										meshPositionZ: towersModels[i].mesh.position.z,
										targetPositionX: enemySoldiersModels[j].mesh.position.x,
										targetPositionZ: enemySoldiersModels[j].mesh.position.z
									})

									towersModels[i].time = 0;	//w momencie gdy strzela zegar sie zeruje i musi czekac na kolejny strzal
									
									if (enemySoldiersModels[j].death(towersModels[i].damage)) {	//przy strzale zadaje obrazenia i sprwadza czy zolnierz umarl
										console.log(enemySoldiersModels[j].cost / 2)
										addGold(enemySoldiersModels[j].cost / 2);	//gdy wroga jednostka jest zabita gracz dostaje 1/2 jej kosztu
										scene.remove(enemySoldiersModels[j].mesh);
										enemySoldiersModels.splice(j, 1);
									}

									break;	//jesli moze strzelic w jakiegokolwiek zolnierza nie trzeba sprawdzac dalej
								}
							}
						}
					}
				}

				//ruch pociskow
				for (i = 0; i < bullets.length; i++) {
					bullets[i].move();

					if (bullets[i].canBeDeleted) {
						bullets.splice(i, 1);
					}
				}

				moveSoldiers();
			}
		}


		animateScene();
	}

	init()

	// Tworzenie roślin
	function Plant(type) {
		this.mesh;

		var th = this;

		var loader = new THREE.JSONLoader();
		loader.load('Models/' + plant[type] + '.js', function (geom, mat) {
			geom.computeMorphNormals();
			mat = new THREE.MeshBasicMaterial({
				map: THREE.ImageUtils.loadTexture("textures/" + plant[type] + ".png"),
				specular: 0xffffff,
				shininess: 60,
				shading: THREE.SmoothShading,
				vertexColors: THREE.FaceColors
			});

			th.mesh = new THREE.MorphAnimMesh(geom, mat);
			th.mesh.name = plant[type];
			th.mesh.position.x = 50;
			th.mesh.position.y = -1000;
			th.mesh.position.z = 300;

			if (type == 2)
				th.mesh.scale.set(0.7, 1, 0.7);
			else 
				th.mesh.scale.set(1, 2, 1);
			
			if (type == plant.length - 1) {	//czyli moment gdy zaladuje sie ostatnia roslina do pamieci wtedy tworzy klony wszystkich roslin
				createPlants();
			}

			scene.add(th.mesh);
		})

		return this;
	}   

	function addPlantClone(mesh, x, y, z) {
		mesh.position.y = y;
		mesh.position.z = z;
		mesh.position.x = x;

		scene.add(mesh);
	}
	function addCastle(x,y,z) {
	    var loader = new THREE.ColladaLoader();
	    var container = new THREE.Object3D();
	   
	    var material1 = new THREE.MeshBasicMaterial({  map: THREE.ImageUtils.loadTexture('textures/tent.jpg') });
	   /* var material2 = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('textures/texture1.jpg') });
	     var material3 = new THREE.MeshBasicMaterial({  map: THREE.ImageUtils.loadTexture('textures/texture2.png') });
	    var material4 = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('textures/texture3.png') });
	    var material5 = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('textures/texture4.png') });
        */
	        loader.load(
                "Models/tent.xml",
                // gdy załadowany
                function (collada) {
                    model = collada.scene;

                    tent_exterior = model.getObjectByName("tent_exterior", true)
                    tent_exterior.children[0].material = material1
             /*       mesh2 = model.getObjectByName("mesh2", true)
                    mesh2.children[0].material = material2
                    mesh2 = model.getObjectByName("mesh2", true)
                    mesh2.children[0].material = material2
                    mesh2 = model.getObjectByName("mesh2", true)
                    mesh2.children[0].material = material2
                    mesh2 = model.getObjectByName("mesh2", true)
                    mesh2.children[0].material = material2
                 */

                    model.traverse(function (child) {
                        if (child instanceof THREE.Mesh) {
                            console.log("mesh " + child.name);
                         //   child.material.map = THREE.ImageUtils.loadTexture("textures/tent.jpg");
                         //   child.material.needsUpdate = true;

                            container.add(model);
                            scene.add(container);
                        }
                    });
                    model.position.set(x, y - 2, z)
                    model.scale.set(5,5.5,5);
                      model.rotation.x = -90 * Math.PI / 180
                    // for (i = 0; i < 5; i++)
                    // for (j = 0; j < 3; j++) {
                    // var clone = model.clone();
                    //  clone.position.set(-150- 170*j, 0,-300 + 170*i)
                    // scene.add(clone)
                    //  }
                },

                function (e) {
                    console.log("model " + e.loaded + "-" + e.total);
                }
            );
	    
	   
	}

	function createPlants() {
		var p = 0;

		for (i = 0; i < 20; i++) {
			for (j = 0; j < 16; j++) {
				if(map[i][j] == -2)
					addPlantClone(plant1.mesh.clone(), planeMesh[p].position.x, planeMesh[p].position.y, planeMesh[p].position.z);
				else if (map[i][j] == -3)
					addPlantClone(banana.mesh.clone(), planeMesh[p].position.x, planeMesh[p].position.y, planeMesh[p].position.z);
				//else if (map[i][j] == 3)
				  //  addCastle(planeMesh[p].position.x, planeMesh[p].position.y, planeMesh[p].position.z);
				p++;
			}
		}
	}

	//Poruszanie się jednostek
	function moveSoldiers() { 
		if (soldiersModels.length >= 1) {
			for (i = 0; i < soldiersModels.length; i++) {
				soldiersModels[i].mesh.position.x += soldiersModels[i].moveX;
				soldiersModels[i].mesh.position.z += soldiersModels[i].moveZ;

				for (j = 0; j < 320; j++) {
					if (soldiersModels[i].mesh.position.distanceTo(planeMesh[j].position) < 23) {
						if (planeMesh[j].name == '4') {
							soldiersModels[i].mesh.rotation.y = Math.PI / -2;

							soldiersModels[i].move(0, -3);
						} else if (planeMesh[j].name == '5') {
							soldiersModels[i].mesh.rotation.y = Math.PI;

							soldiersModels[i].move(3, 0);
						} else if (planeMesh[j].name == '6') {
							soldiersModels[i].mesh.rotation.y = 0;

							soldiersModels[i].move(-3, 0);
						} else if (planeMesh[j].name == '7') {
							soldiersModels[i].mesh.rotation.y = Math.PI / 2;

							soldiersModels[i].move(0, 3);
						} else if (planeMesh[j].name == '3') {	//wejscei na zamek
							scene.remove(scene.getObjectByName(soldiersModels[i].mesh.name));
							soldiersModels.splice(i, 1);
						}
					}
				}
			}
		}

		//wrogie jednostki
		if (enemySoldiersModels.length >= 1) {
			for (i = 0; i < enemySoldiersModels.length; i++) {
				enemySoldiersModels[i].mesh.position.x += enemySoldiersModels[i].moveX;
				enemySoldiersModels[i].mesh.position.z += enemySoldiersModels[i].moveZ;

				for (j = 0; j < 320; j++) {
					if (enemySoldiersModels[i].mesh.position.distanceTo(planeMesh[j].position) < 23) {
						if (planeMesh[j].name == '4') {
							enemySoldiersModels[i].mesh.rotation.y = Math.PI / -2;

							enemySoldiersModels[i].move(0, -3);
						} else if (planeMesh[j].name == '5') {
							enemySoldiersModels[i].mesh.rotation.y = Math.PI;

							enemySoldiersModels[i].move(3, 0);
						} else if (planeMesh[j].name == '6') {
							enemySoldiersModels[i].mesh.rotation.y = 0;

							enemySoldiersModels[i].move(-3, 0);
						} else if (planeMesh[j].name == '7') {
							enemySoldiersModels[i].mesh.rotation.y = Math.PI / 2;

							enemySoldiersModels[i].move(0, 3);
						} else if (planeMesh[j].name == '3') {
							//odejmowanie zyc gdy wroga jednostka wejdzie na zamek
							lives--;
							if (enemySoldiersModels[i].cost == 300) {	//syfiasto to zrobilem ale to poprostu sprawdza czy jednostka to fatso
								lives--;
								lives--;
								client.emit("lifeLost", {});
								client.emit("lifeLost", {});
								canvasUi.substractLife();
								canvasUi.substractLife();
							}

							scene.remove(scene.getObjectByName(enemySoldiersModels[i].mesh.name));
							enemySoldiersModels.splice(i, 1);

							if (lives > 0) {
								client.emit("lifeLost", {});
								canvasUi.substractLife();
							} else {	//przegrana
								canRender = false;
								isAlive = false;
								client.emit("defeat", {});
								client.emit("loss", {"name": name, "loses": loses});

								var div = document.createElement("div");
								div.style.position = "absolute";
								div.style.top = "50%";
								div.style.left = "50%";
								div.style.transform = "translate(-50%, -50%)";
								div.style.width = "auto";
								div.style.color = "white";
								div.style.fontSize = "50px";
								div.innerHTML = "DEFEAT!!!";
								
								document.body.appendChild(div);
							}
						}
					}
				}
			}
		}
	}

	function addGold(g) {	//zajebisty efekt ktory nie dodaje od razu calego golda tylko po troche 
		if (isAlive) {
			//console.log(gold + " " + goldNumber)
			gold += g;
			var counter = 0;
			var interval = setInterval(function() {
				if (counter < 5) {
					goldNumber += g / 5;
					counter++;
				} else {
					clearInterval(interval);
				}
				canvasUi.updateCoins();
			}, 150)
		}
	}

	this.substractGold = function(g) {
		//console.log(gold + " " + goldNumber)
		gold -= g;
		var counter = 0;
		var interval = setInterval(function() {
			if (counter < 5) {
				goldNumber -= g / 5;
				counter++;
			} else {
				clearInterval(interval);
			}
			canvasUi.updateCoins();
		}, 150)
	}
}
