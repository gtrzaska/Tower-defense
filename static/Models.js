function Models() {
	animations = []
	soldiers = [];
	soldierType = 0;


	soldiers.push(new Soldier("Models/Blade.js", "textures/Blade.jpg", 100, 0.33, 200));
	soldiers.push(new Soldier("Models/skeleton.js", "textures/skeleton.jpg", 50, 0.7, 150));
	soldiers.push(new Soldier("Models/Fatso.js", "textures/fatso.jpg", 700, 0.1, 300));
	soldiers.push(new Soldier("Models/Demon.js", "textures/demon.jpg", 200, 0.25, 250));


	this.addModel = function(type) {
		soldierType = type;

		if (gold - soldiers[soldierType].cost >= 0 && isAlive) {
			Board.substractGold(soldiers[soldierType].cost);
			console.log(soldiersAmount)
			soldiersModels.push(new SoldierClone(soldiers[soldierType].mesh.clone(), soldiers[soldierType].health, soldiers[soldierType].speed, soldiersAmount, soldiers[soldierType].cost, soldierType));

			client.emit("soldierAdded", {//wysyla ostatniego zolnierza na serwer
				type: soldierType,
				positionX: soldiersModels[soldiersModels.length - 1].mesh.position.x,
				positionY: soldiersModels[soldiersModels.length - 1].mesh.position.y,
				positionZ: soldiersModels[soldiersModels.length - 1].mesh.position.z
			})

			soldiersAmount++;
		}
	}
}