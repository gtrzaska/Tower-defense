function Menu() {

	menu = true
	scene = new THREE.Scene();
	obj = new THREE.Object3D();
	obj.position.set(0,20,-100)
	scene.add(obj)
	camera = new THREE.PerspectiveCamera(
		45, // kąt patrzenia kamery (FOV - field of view)
		4 / 3, // proporcje widoku
		0.1, // min renderowana odległość
		10000 // max renderowana odległość
	);
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0xffffff);
	renderer.setSize(window.innerWidth, window.innerHeight);

	menuGeometry = new THREE.IcosahedronGeometry(90, 6)
	menuMaterial = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('textures/menu.png'), side: THREE.DoubleSide, wireframe: false });
	menuMesh = new THREE.Mesh(menuGeometry, menuMaterial);
	// mesh.scale.set(1, 1, 1);

	scene.add(menuMesh);

	document.getElementById("menu").appendChild(renderer.domElement);

	camera.position.x = 0;
	camera.position.y = 20;
	camera.position.z = 80;

	

	function animateScene1() {
		if (menu) {
		
			camera.lookAt(obj.position);
			menuMesh.rotation.y += 0.0017;
			requestAnimationFrame(animateScene1);
			renderer.render(scene, camera);
		}
	}

	animateScene1();


	this.start = function() {
		var playersName = document.getElementById("playersName");

		if (playersName.value != "" && playersName.value.toLowerCase().charCodeAt(0) >= 97 && playersName.value.toLowerCase().charCodeAt(0) <= 122) {	//nie mozna zaczac gry nie podajac nicka
			name = playersName.value;
			Net.play();
		} else {
			playersName.classList.add("red");
			playersName.placeholder = "Field required!";

			setTimeout(function() {	
				playersName.classList.remove("red");
				playersName.placeholder = "Write your name";
			}, 2500)
		}
	}
}

