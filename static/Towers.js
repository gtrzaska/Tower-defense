function Towers() {
	var towersNames = ['weapon1', 'turret', 'cannon', 'excavator']
	towers = [];
	towersModels = [];
	enemyTowersModels = []
  
	document.addEventListener("mousedown", onMouseDown, false);  // postawienie wieży

	function onMouseDown(event) {
		var raycaster = new THREE.Raycaster(); // obiekt symulujący "rzucanie" promieni
		var mouseVector = new THREE.Vector2() // wektor (x,y) wykorzystany bedzie do określenie pozycji myszy na ekranie

		mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;

		raycaster.setFromCamera(mouseVector, camera);

		intersects = raycaster.intersectObjects(scene.children, true);
		if (intersects.length > 0) {
			if (intersects[0].object.name == "2") {
				var x = intersects[0].object.position.x;
				var z = intersects[0].object.position.z;
				
				if (z * side > -100 && x * side < 0) {	//wieza moze byc tylko przy bazie po jednej stronie
					if (gold - towers[towerType].cost >= 0 && isAlive) {
						intersects[0].object.name = "zabudowane"
						Board.substractGold(towers[towerType].cost);
						towersModels.push(createTower(towerType));

						if (towerType == 3) {
							goldPerSecond += 10;
						}
					}
				}
			}
		}
	}

	//tworzenie wiez ktore pozniej beda uzyte do klonowania
	towers.push(new Tower(0, 10, 250, 3, 100));
	towers.push(new Tower(1, 20, 200, 4, 150));
	towers.push(new Tower(2, 50, 150, 6, 200));
	towers.push(new Tower(3, 0, 0, 0, 200));
	
	var tnumber = 0
	// Dodanie wieży
	function TowerClone(mesh, x, y, z, damage, range, speed,type) {
		this.mesh = mesh;
		this.damage = damage; //ile zadaje obrazen
		this.range = range;	//zasieg wiezy
		this.speed = speed;	//szybkostrzelnosc
		this.time = 0;	//czas ktory ogranicza strzelanie

		var th = this;

		this.mesh.position.x = x;
		this.mesh.position.y = y;
        if (type = 3)
            this.mesh.position.z = z - 13;
		else
            this.mesh.position.z = z

		scene.add(mesh);

		this.addTime = function(delta) {
			th.time += delta;
		}

		this.canShoot = function() {
			if (th.time >= th.speed && damage != 0) {	//damage != 0 zapobiega sprawdzaniu mlyna dodajacego hajs
				return true;
			}

			return false;
		}

		return this;
	}

	function Tower(i, damage, range, speed, cost) {
		this.mesh;
		this.damage = damage; //ile zadaje obrazen
		this.range = range;	//zasieg wiezy
		this.speed = speed;	//szybkostrzelnosc
		this.cost = cost;

		var th = this;
		if (i != 3) {
			var loader = new THREE.JSONLoader();
			loader.load('Models/' + towersNames[i] + '.js', function (geom, mat) {
				geom.computeMorphNormals();

				mat = new THREE.MeshBasicMaterial({
					map: THREE.ImageUtils.loadTexture("textures/" + towersNames[i] + ".jpg"),
					morphTargets: true, //konieczne do animacji
					morphNormals: true, //konieczne animacji
					specular: 0xffffff,
					shininess: 60,
					shading: THREE.SmoothShading,
					vertexColors: THREE.FaceColors
				});
				th.mesh = new THREE.MorphAnimMesh(geom, mat);
				th.mesh.rotation.y = Math.PI / 2;
				th.mesh.position.x = 0;
				th.mesh.position.y = -1000;
				th.mesh.position.z = 0;
				th.mesh.scale.set(0.6, 0.6, 0.6);

				scene.add(th.mesh);
				tnumber++
			})
		}
	
		else {
			th.mesh = new THREE.Object3D();
			scene.add(th.mesh)
			var loader = new THREE.JSONLoader();
			loader.load('Models/excavator_b.js', function (geom, mat) {
				geom.computeMorphNormals();

				mat = new THREE.MeshBasicMaterial({
					map: THREE.ImageUtils.loadTexture("textures/excavator.jpg"),
					morphTargets: true, //konieczne do animacji
					morphNormals: true, //konieczne animacji
					specular: 0xffffff,
					shininess: 60,
					shading: THREE.SmoothShading,
					vertexColors: THREE.FaceColors
				});
				th.mesh1 = new THREE.MorphAnimMesh(geom, mat);

				th.mesh1.rotation.y = Math.PI / 2;
				th.mesh1.position.z = 10;

				th.mesh.add(th.mesh1);
			})

			loader.load('Models/excavator_t.js', function (geom, mat) {
				geom.computeMorphNormals();

				mat = new THREE.MeshBasicMaterial({
					map: THREE.ImageUtils.loadTexture("textures/excavator.jpg"),
					morphTargets: true, //konieczne do animacji
					morphNormals: true, //konieczne animacji
					specular: 0xffffff,
					shininess: 60,
					shading: THREE.SmoothShading,
					vertexColors: THREE.FaceColors
				});
				th.mesh2 = new THREE.MorphAnimMesh(geom, mat);

				th.mesh2.rotation.y = Math.PI / 2;
				th.mesh2.position.x = 0;
				th.mesh2.position.y = 10;
				th.mesh2.position.z =10;

				th.mesh.add(th.mesh2);
			})

			th.mesh.position.y = -1000;
			th.mesh.scale.set(0.2, 0.2, 0.2)
			tnumber++
		}
		

		return this;
	}

	function createTower(type) {	//tworzy sojusznicza wieze na pozycji raycastera
		var x = intersects[0].object.position.x;
		var y = intersects[0].object.position.y;
		var z = intersects[0].object.position.z;

		client.emit("towerAdded", {
			type: type,
			positionX: x,
			positionY: y,
			positionZ: z
		})

		return new TowerClone(towers[type].mesh.clone(), x, y, z, towers[type].damage, towers[type].range, towers[type].speed, type);
	}

	this.createTower = function(x, y, z, type) {	//tworzy wroga wieze na pozycji wyslanej z serwera
	    return new TowerClone(towers[type].mesh.clone(), x, y, z, towers[type].damage, towers[type].range, towers[type].speed, type);
	}

	//Stworzenie pocisku , ruch w animatescene
	var bulletNumber = 0
	this.bullets = function(x, y, z, j) {
		bulletMesh[bulletNumber] = bMesh.clone();
		bulletMesh[bulletNumber].position.y = y + 10;
		bulletMesh[bulletNumber].position.z = z;
		bulletMesh[bulletNumber].position.x = x;

		scene.add(bulletMesh[bulletNumber]);
		bulletTarget[bulletNumber] = [bulletNumber,j]
		bulletNumber++
	}
}

function Bullet(towerPosition, targetPosition) {
	this.mesh = bMesh.clone();
	this.mesh.position.set(towerPosition.x, towerPosition.y, towerPosition.z);
	this.canBeDeleted = false;

	var distanceX = targetPosition.x - towerPosition.x;	//dystans w x jaki music przeleciec
	var distanceZ = targetPosition.z - towerPosition.z;

	var counter = 0;

	var th = this;

	scene.add(this.mesh);

	this.move = function() {
		th.mesh.position.x += (distanceX * 0.1);	// razy 0.1 czyli pokona ten dystans w 10 obiegow gry => gdy counter == 10 to pocisk jest usuwany
		th.mesh.position.z += (distanceZ * 0.1);

		counter++;

		if (counter >= 10) {
			scene.remove(th.mesh);
			th.canBeDeleted = true;
		}
	}
}