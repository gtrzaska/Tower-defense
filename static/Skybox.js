function Skybox() {
    var planeMaterial = new THREE.MeshBasicMaterial({
        shininess: 50,
        side: THREE.DoubleSide,
        map: THREE.ImageUtils.loadTexture("textures/grass.jpg"),
    });
    var geometry = new THREE.PlaneBufferGeometry(1700, 1700);;
   var  Planemesh = new THREE.Mesh(geometry, planeMaterial);
    Planemesh.rotateX(Math.PI / 2);
    Planemesh.material.map.repeat.set(26, 26); //gęstość powtarzania
    Planemesh.material.map.wrapS = Planemesh.material.map.wrapT = THREE.RepeatWrapping; //
    Planemesh.position.set(0, -5, 0)
    scene.add(Planemesh);
    

    
    var materials = [];

    materials.push(new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: THREE.ImageUtils.loadTexture('textures/negx.jpg') }));
    materials.push(new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: THREE.ImageUtils.loadTexture('textures/posx.jpg') }));
    materials.push(new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: THREE.ImageUtils.loadTexture('textures/posy.jpg') }));
    materials.push(new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: THREE.ImageUtils.loadTexture('textures/negy.jpg') }));
    materials.push(new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: THREE.ImageUtils.loadTexture('textures/negz.jpg') }));
    materials.push(new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: THREE.ImageUtils.loadTexture('textures/posz.jpg') }));


    matSky = new THREE.MeshFaceMaterial(materials);

    geoSky = new THREE.BoxGeometry(1700, 1300, 1700, 1, 1, 1);
    meshSky = new THREE.Mesh(geoSky, matSky);
    meshSky.position.set(0, 620, 0)

    scene.add(meshSky);

}