function Soldier(model, texture, health, speed, cost) {	//klasa do zaladowania nowego modelu
	this.mesh;
	this.health = health;
	this.speed = speed;
	this.cost = cost;

	var th = this;

	this.animations = [];

	var loader = new THREE.JSONLoader();
	loader.load(model, function (geometry, material) {
		geometry.computeMorphNormals();

		material = new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture(texture),
			morphTargets: true, //konieczne do animacji
			morphNormals: true, //konieczne animacji
			specular: 0xffffff,
			shininess: 60,
			shading: THREE.SmoothShading,
			vertexColors: THREE.FaceColors
		});
		th.mesh = new THREE.MorphAnimMesh(geometry, material);
		th.mesh.position.x = 50;
		th.mesh.position.y = -1000;
		th.mesh.position.z = 300;
		if (model == "Models/Fatso.js")
		    th.mesh.scale.set(1, 1, 1);
		else
		    th.mesh.scale.set(1.2, 1.2, 1.2);

		//Animacja
		th.mesh.parseAnimations();
		for (var key in th.mesh.geometry.animations) {
			if (key === 'length' || !th.mesh.geometry.animations.hasOwnProperty(key))
				continue;

			if (key != undefined) {
				th.animations.push(key);
			}
		}

		th.mesh.playAnimation(th.animations[1], 500);
		console.log(texture + " " + th.animations)

		scene.add(th.mesh);
	})

	return this;
}

function SoldierClone(mesh, health, speed, number, cost, soldierType) {	//klasa do sklonowanego modelu
	this.moveX = 3 * speed * side;
	this.moveZ = 0;
	this.mesh = mesh;
	this.health = health;
	this.speed = speed;
	this.cost = cost;	//tutaj koszt jest jedynie w celach zeby go pobrac przy zabiciu go przez przeciwnika

	var th = this;

	this.mesh.name = "soldier" + number;	//kazda jednostka ma swoj unikatowy numer zeby ja mozna usunac ze sceny
	this.mesh.position.x = 20 * side;
	if (soldierType != 2)
	    this.mesh.position.y = 20;
	else
	    this.mesh.position.y = 5;
	this.mesh.position.z = 275 * side;

	if (side == 1) {
		th.mesh.rotation.y = Math.PI;
	}

	this.mesh.parseAnimations();
	for (var key in th.mesh.geometry.animations) {
		if (key === 'length' || !th.mesh.geometry.animations.hasOwnProperty(key))
			continue;
		animations.push(key);
	}

	this.mesh.playAnimation(animations[1], 50);

	scene.add(this.mesh);

	this.move = function(moveX, moveZ) {
		th.moveX = moveX * th.speed;
		th.moveZ = moveZ * th.speed;
	}

	this.death = function(damage) {
		th.health -= damage;

		if (th.health <= 0) {
			console.log("umar na smierc");
			return true;
		}

		return false;
	}

	return this;
}