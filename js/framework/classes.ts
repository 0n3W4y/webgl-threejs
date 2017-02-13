declare var THREE: any;
declare var Detector: any;
declare var Stats: any;

class GridPoint {

	public gridId: number;
	public pointType: number; // 0-liquid, 1 - flat, 2 - cubic;
	public coverType: number; // 0 - free ; 1 - water; 2 - lava; 3 - swamp; 4 - earth; 5 - sand; 6 - road; 7 - forest; 8 - rocks; 9 - city;
	public effectType: number; // 0 - nothing, 1 - fire, 2 - wet, 3 - snow, 4- blood;
	public movementRatio: number; // 1- normal. 2- superfast - 0.1 - minimum speed;
	public graphicIndex:number; // index need for graphics;
	public gridCoords: any; // coordinates where this tile in grid;

	constructor (id, point, cover, effect, speed, newIndex, coords){
		this.gridId = id;
		this.pointType = point;
		this.coverType = cover;
		this.effectType = effect;
		this.movementRatio = speed;
		this.graphicIndex = newIndex;
		this.gridCoords = coords;
	}
}

class GridCoordinates {
	//grid coords;
	public x:number;
	public y:number;

	constructor (newX, newY){
		this.x = newX;
		this.y = newY;
	}

}

class GroundMap{
	public width:number;
	public height:number;
	public size:number;
	public logicGrid:Array<any>;
	public citiesArray:Array<any>;

	private dataCityNames:Array<any>;

	constructor(width, height, dataNames){
		this.width = width;
		this.height = height;
		this.size = width*height;
		this.logicGrid = new Array();
		this.citiesArray = new Array();
		this.dataCityNames = dataNames;
	}

	public fillLogicGrid(type):void{
		var coverType;
		var pointType;
		var movementRatio;

		if( type == "Earth" ){
			coverType = 4;
			pointType = 1;
			movementRatio = 0.8;
		}else if( type == "Sand" ){
			coverType = 5;
			pointType = 1;
			movementRatio = 0.6;
		}else{
			//default earth
			coverType = 4;
			pointType = 1;
			movementRatio = 0.8;
		}

		for (var y = 0; y < this.height; y++){
			for (var x = 0; x < this.width; x++){
				var gridId = y*this.height + x;
				var coords = new GridCoordinates(x, y);
				var newGridPoint = new GridPoint(gridId, pointType, coverType, 0, movementRatio, 0, coords); //earth;
				this.logicGrid.push(newGridPoint);
			}
		}
	}

	public generateCities(type, amount, safeZoneNum, minRad):void{
		var cityAmount = amount || Math.min(Math.round(this.width/5), Math.round(this.height/5)); // default;
		var safeZone = safeZoneNum || 2; //default;
		var minRadius = minRad || Math.round((this.width+this.height)/(2*amount)); //default
		var temporaryArrayForCheckCoords = new Array();
		for (var i = 0; i < cityAmount; i++){
			var pointX = Math.floor(Math.random()*(this.width - safeZone*2) + safeZone);
			var pointY = Math.floor(Math.random()*(this.height - safeZone*2) + safeZone);
			var check = true;
			//проверяем, есть ли по близости город, в пределах минимального радиуса.
			for (var j = 0; j < temporaryArrayForCheckCoords.length; j++){
				var cityX = temporaryArrayForCheckCoords[j].x;
				var cityY = temporaryArrayForCheckCoords[j].y;

				var difX = Math.abs(cityX - pointX);
				var difY = Math.abs(cityY - pointY);

				var coordDif = Math.round(Math.sqrt(difX*difX + difY*difY));

				if (coordDif <= minRadius)
					check = false;
			}

			if (check){
				var newCoords = new GridCoordinates(pointX, pointY);
				temporaryArrayForCheckCoords.push(newCoords);
				var gridId = pointY*this.height + pointX;
				this.logicGrid[gridId].coverType = 9;
				this.logicGrid[gridId].pointType = 2;
				this.logicGrid[gridId].movementRatio = 1;
				var newCity = new Entity("0", "City");
				var component = newCity.createComponent("City");
				var cityName = this.generateCityName();
				component.name = cityName;
				component.gridCoordinates = newCoords;
				component.gridId = gridId;
				newCity.addComponent(component);
				this.citiesArray.push(newCity);
			}else{
				i--;
			}

		}
	}

	//angular -  будет ли река поворачивать на 90 градусов ( true; false); type - 0 - simple river, 1 - river with lake, 2 - river with solid;
	public generateRiver(type, angular, width, offset, step, maxWidth, minWidth){
		var liquidWidth = width || Math.round(this.width*0.05); //max 5%;
		var liquidAngulatChanse = angular || false; // no chanse on default;
		var liquidType = type || 0; //simple river default;
		var liquidOffset = offset || 1; //max 1;
		var liquidStep = step || 1; //max 1;
		var liquidMaxWidth = maxWidth || (liquidWidth + 5) // max +5;
		var liquidMinWidth = minWidth || 0;// 0 - river can be underground;

		var startingPointY = Math.floor(Math.random()*(this.height/2 + 1)); // max start on half of grid on Y;
		var startingPointX = Math.floor(Math.random()*(this.width - liquidWidth + 1));
		var liquidHeight;

		if (liquidType == 0)
		{
			startingPointY = 0;
			liquidHeight = this.height;
		} 

		var liquidCurrentWidth = liquidWidth;
		var nextPointX = startingPointX;

		// no angular, no lakes and solids, right now only simple RiverL

		for (var j = 0; j < liquidHeight; j++){

			if (j != 0){
				var liquidCurrentStep = Math.floor(Math.random()*(liquidStep*2 + 1) -liquidStep); 
				var liquidDirectionOffset = Math.floor(Math.random()*(liquidOffset*2 + 1) -liquidOffset); // -1 left, 0 - center, +1 - right;
				liquidCurrentWidth = liquidCurrentWidth + liquidCurrentStep;
				nextPointX += liquidDirectionOffset;
				if (liquidCurrentWidth > liquidMaxWidth)
					liquidCurrentWidth = liquidMaxWidth;
				else if (liquidCurrentWidth < liquidMinWidth)
					liquidCurrentWidth = liquidMinWidth;
				else if (liquidCurrentWidth == 1)
					nextPointX -= liquidDirectionOffset;

			}

			for (var k = 0; k < liquidCurrentWidth; k++){
				var gridIndex = (startingPointY + j) * this.height + (nextPointX + k);

				//проверяем, принадлежит ли наш индекс строке Y, на которой мы хотим разместить часть объекта;
				if (gridIndex >= (startingPointY + j) * this.height && gridIndex < (startingPointY + j + 1) * this.height){
					var point = this.logicGrid[gridIndex];
					point.pointType = 0; // water
					point.movementRatio = 0.4;
					point.coverType = 1 // water;

				}
			}
		}
	}

	// generating with WIDTH, so height is static; 
	//offset - есть ли смещение влево или вправо и на сколько, step - на сколько сильно может уменьшаться или увеличиваться объект с каждой последующей Y  координатой;
	public generateGroundMapObjects(type, amount, width, height, offset, step, maxWidth){

		var pointType;
		var movementRatio;
		var coverType;
		if (type == "Lake"){
			pointType = 0;
			movementRatio = 0.4;
			coverType = 1;
		}else if (type == "Rocks"){
			pointType = 2;
			movementRatio = 0.2;
			coverType = 8;
		}else if (type == "Forest"){
			pointType = 2;
			movementRatio = 0.7;
			coverType = 7;
		}else if( type == "Swamp" ){
			pointType = 1;
			movementRatio = 0.5;
			coverType = 3;
		}else if( type == "Earth" ){
			pointType = 1;
			movementRatio = 0.8;
			coverType = 4;
		}else if( type == "Sand" ){
			pointType = 1;
			movementRatio = 0.5;
			coverType = 5;
		}else if( type == "Lava" ){
			pointType = 0;
			movementRatio = 0;
			coverType = 2;
		}else if( type == "Oil" ){
			pointType = 0;
			movementRatio = 0;
			coverType = 0;
		}

		var liquidAmount = amount || 1; // max 1
		var liquidWidth = width || Math.round(this.width/10) // max 10%
		var liquidHeight = height || Math.round(this.height/10) // max 10%
		var liquidOffset = offset || 1; //max 1;
		var liquidStep = step || 1; //max 1;
		var liquidMaxWidth = maxWidth || (liquidWidth + 5); // max +5;
		var liquidMinWidth = 1; //default;

		for (var i = 0; i < liquidAmount; i++)
		{
			// для того, что бы вписать объект, что бы он не выходил за границы, сделаю стартовые точки с учетом длинны и ширины объекта.
			var startingPointY = Math.floor(Math.random()*(this.height - liquidHeight + 1));
			var startingPointX = Math.floor(Math.random()*(this.width - liquidWidth + 1));
			var liquidCurrentWidth = liquidWidth;
			var nextPointX = startingPointX;

			for (var j = 0; j < liquidHeight; j++){

				if (j != 0){
					var liquidCurrentStep = Math.floor(Math.random()*(liquidStep*2 + 1) -liquidStep); 
					var liquidDirectionOffset = Math.floor(Math.random()*(liquidOffset*2 + 1) -liquidOffset); // -1 left, 0 - center, +1 - right;
					liquidCurrentWidth = liquidCurrentWidth + liquidCurrentStep;
					nextPointX = nextPointX + liquidDirectionOffset;
					if (liquidCurrentWidth > liquidMaxWidth)
						liquidCurrentWidth = liquidMaxWidth;
					else if(liquidCurrentWidth == 1)
						nextPointX -= liquidDirectionOffset;

				}
				

				for (var k = 0; k < liquidCurrentWidth; k++){
					var gridIndex = (startingPointY + j) * this.height + (nextPointX + k);
					//проверяем, принадлежит ли наш индекс строке Y, на которой мы хотим разместить часть объекта;
					if (gridIndex >= (startingPointY + j) * this.height && gridIndex < (startingPointY + j + 1) * this.height){
						var point = this.logicGrid[gridIndex];
						point.pointType = pointType;
						point.movementRatio = movementRatio;
						point.coverType = coverType;

					}
				}
			}
		}
	}

	//amount - количество дорог идущих от 1 города ( максимум );
	public generateRoadFromCityToCity(amount){
		var roadAmount = amount || 2; //2 max;

		for ( var i = 0; i < this.logicGrid.length; i++){
			var point = this.logicGrid[i];
			var distanceArray = null;
			if ( point.coverType == 9){ //city 
				for (var j = 0; j < this.citiesArray.length; j++){
					var city = this.citiesArray[j];
					if ( city.getComponent('City').gridId == i){
						distanceArray = this.calculateDistanceFromCity(city);
						break;
					}

				}
			}

			if (distanceArray != null){
				for (var j = 0; j < roadAmount; j++){
					this.createRoadFromCityToCity(city, distanceArray);
				}
			}
		}
	}

	private createRoadFromCityToCity(city, citiesArray){
		var newCity = null;
		var currentCity = city.getComponent('City');

		for( var k = 0; k < citiesArray.length; k++ ){
			var tempCity = citiesArray[k].getComponent('City');
			if (tempCity.name != currentCity.name && !tempCity.checkRoadToCity(currentCity.name)){
				newCity = tempCity;
				if( k > 1 ){
					var previousCity = citiesArray[k-1].getComponent('City');
					if( !newCity.checkRoadToCity(previousCity.name) )
						break;
				}
			}
		}

		if (newCity == null)
			return;


		var pointX = currentCity.gridCoordinates.x;
		var pointY = currentCity.gridCoordinates.y;
		var toPointX = newCity.gridCoordinates.x;
		var toPointY = newCity.gridCoordinates.y;

		var nextPointX = pointX;
		var nextPointY = pointY;

		while(true){

			var difX = nextPointX - toPointX;
			var difY = nextPointY - toPointY;

			var directionX = 0
			var directionY = 0

			if (difX < 0)
				directionX = 1;
			else if (difX > 0)
				directionX = -1;

			if (difY < 0)
				directionY = 1;
			else if (difY > 0)
				directionY = -1;


			if (Math.abs(difX) > Math.abs(difY)){
				if (difX != 0){
					nextPointX += directionX;
					var gridIndex = nextPointY*this.height + nextPointX;
					var point = this.logicGrid[gridIndex];

					if (point.coverType != 9){
						point.pointType = 1; // flat tile;
						point.coverType = 6; // road
						point.movementRatio = 1; // normal
					}
				
				}
			}else{
				if (difY != 0){
					nextPointY += directionY;
					var gridIndex = nextPointY*this.height + nextPointX;
					var point = this.logicGrid[gridIndex];

					if (point.coverType != 9){
						point.pointType = 1; // flat tile;
						point.coverType = 6; // road
						point.movementRatio = 1; // normal
					}
				}
			}
			
			//exit from endless loop;
			if (difX == 0 && difY == 0){
				currentCity.roadAmount ++;
				currentCity.addRoadToCity(newCity.name);
				newCity.roadAmount ++;
				newCity.addRoadToCity(currentCity.name);
				break; 
			}

		}


	}

	private calculateDistanceFromCity(city):Array<any>{ //return Array of numbers;
		var dsArray = new Array();
		var temporary = new Array();
		var result = new Array();

		var pointX = city.getComponent("City").gridCoordinates.x;
		var pointY = city.getComponent("City").gridCoordinates.y;

		//собираем информацию о дистанции до города со всех городов.
		for (var i = 0 ; i < this.citiesArray.length; i++){
			var newCity = this.citiesArray[i];
			var newCityName = newCity.getComponent('City').name;
			var newPointX = newCity.getComponent("City").gridCoordinates.x;
			var newPointY = newCity.getComponent("City").gridCoordinates.y;

			var difX = Math.abs(pointX - newPointX);
			var difY = Math.abs(pointX - newPointX);
			var dif = Math.round(Math.sqrt(difX*difX + difY*difY));

			dsArray.push(dif); // пушим дистанцию
		}

		temporary = dsArray.slice(); // copy;

		temporary.sort(function(a,b){ return a-b;}); // сортируем.

		//делаем отправной массив с ссылками на города. но в порядке от самых ближайших городов до самых дальних.
		for (var j = 0; j <dsArray.length; j++){
			var searchNum = temporary[j];
			var index = dsArray.indexOf(searchNum);
			result.push(this.citiesArray[index]);
		}

		return result;

	}
	private generateCityName():string{ //return string
		var fname = Math.floor(Math.random()*this.dataCityNames[0].length);
		var sname = Math.floor(Math.random()*this.dataCityNames[1].length);
		var tname = Math.floor(Math.random()*this.dataCityNames[2].length);

		var name = this.dataCityNames[0][fname] + this.dataCityNames[1][sname] + this.dataCityNames[2][tname];
		return name;
	}


}

class Graphics {
	public camera:any;
	public scene:any;
	public renderer:any;
	public stats:any;
	public container:any;
	public grid:any;

	public directionalLight:any;
	public hemiLight:any;
	public spotLight:any;

	public tileSize:number;

	public firstGroundLayer:any;
	public secondGroundLayer:any;

	constructor(tileSize){
		this.tileSize = tileSize;
	}

	public init():void{
		//primary DOM element;
		this.container = document.getElementById( 'canvas' );

		//scene
		this.scene = new THREE.Scene();

		//camera
		this.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -5000, 10000 ); //-500, 1000
		this.camera.position.set(200,100,200);
		this.camera.lookAt( new THREE.Vector3(0,0,0) );

		//renderer
		if (Detector.webgl) {
			this.renderer = new THREE.WebGLRenderer( { antialias: false } );
		} else {
			this.renderer = new THREE.CanvasRenderer();
			this.renderer.setPixelRatio( window.devicePixelRatio );
		}

		this.renderer.setClearColor( 0x999999 );
		this.renderer.setSize( window.innerWidth - 10, window.innerHeight - 10 );
		this.renderer.sortObjects = false;
		//this.renderer.shadowMapEnabled = true;
		
		this.container.appendChild( this.renderer.domElement );

		this.stats = new Stats();
		this.container.appendChild( this.stats.dom );
	}

	public showHideGrid( visibility ){
		if( visibility == "Show" )
			this.scene.add( this.grid );
		else
			this.scene.remove( this.grid );
	}

	public createGraphics( mapWidth, mapHeight, gridArray ){
		this.createGraphicGridLines( mapWidth, mapHeight );
		this.createLight();
		this.firstGroundLayer = this.createGroundLayerGraphics( 'images/atlas_ground.png', mapWidth, mapHeight, gridArray );
		this.scene.add( this.firstGroundLayer );
		this.secondGroundLayer = this.createSecondGroundLayerGraphics( 'images/atlas_ground_2.png', mapWidth, mapHeight, gridArray );
		this.scene.add( this.secondGroundLayer );

	}

	private createSecondGroundLayerGraphics( tex, mapWidth, mapHeight, gridArray ){
		var treeTileSize = this.tileSize/2; // 64
		var treesInPoint = Math.round(Math.sqrt(treeTileSize)); //8
		var stepTree = Math.floor(this.tileSize / Math.sqrt(treesInPoint));
		var loader = new THREE.TextureLoader();
		var texture = loader.load( tex );
		var material = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture , shininess: 0, transparent: true, opacity: 1} );
		var trees = new Array();
		var mountains = new Array();
		
		//trees
		trees.push( [new THREE.Vector2(0, .75), new THREE.Vector2(.125, .75), new THREE.Vector2(.125, .875), new THREE.Vector2(0, .875)] );
		trees.push( [new THREE.Vector2(.125, .75), new THREE.Vector2(.25, .75), new THREE.Vector2(.25, .875), new THREE.Vector2(.125, .875)] );
		trees.push( [new THREE.Vector2(.25, .75), new THREE.Vector2(.375, .75), new THREE.Vector2(.375, .875), new THREE.Vector2(.25, .875)] );
		trees.push( [new THREE.Vector2(.375, .75), new THREE.Vector2(.5, .75), new THREE.Vector2(.5, .875), new THREE.Vector2(.375, .875)] );
		trees.push( [new THREE.Vector2(.5, .75), new THREE.Vector2(.625, .75), new THREE.Vector2(.625, .875), new THREE.Vector2(.5, .875)] );
		trees.push( [new THREE.Vector2(.625, .75), new THREE.Vector2(.75, .75), new THREE.Vector2(.75, .875), new THREE.Vector2(.625, .875)] );
		trees.push( [new THREE.Vector2(0, .625), new THREE.Vector2(.125, .625), new THREE.Vector2(.125, .75), new THREE.Vector2(0, .75)] );
		trees.push( [new THREE.Vector2(.125, .625), new THREE.Vector2(.25, .625), new THREE.Vector2(.25, .75), new THREE.Vector2(.125, .75)] );
		trees.push( [new THREE.Vector2(.25, .625), new THREE.Vector2(.375, .625), new THREE.Vector2(.375, .75), new THREE.Vector2(.25, .75)] );
		trees.push( [new THREE.Vector2(.375, .625), new THREE.Vector2(.5, .625), new THREE.Vector2(.5, .75), new THREE.Vector2(.375, .75)] );
		//mountains
		mountains.push( [new THREE.Vector2(0, .5), new THREE.Vector2(.125, .5), new THREE.Vector2(.125, .625), new THREE.Vector2(0, .625)] );
		mountains.push( [new THREE.Vector2(.125, .5), new THREE.Vector2(.25, .5), new THREE.Vector2(.25, .625), new THREE.Vector2(.125, .625)] );
		mountains.push( [new THREE.Vector2(.25, .5), new THREE.Vector2(.375, .5), new THREE.Vector2(.375, .625), new THREE.Vector2(.25, .625)] );
		mountains.push( [new THREE.Vector2(.375, .5), new THREE.Vector2(.5, .5), new THREE.Vector2(.5, .625), new THREE.Vector2(.375, .625)] );
		mountains.push( [new THREE.Vector2(.5, .5), new THREE.Vector2(.625, .5), new THREE.Vector2(.625, .625), new THREE.Vector2(.5, .625)] );
		mountains.push( [new THREE.Vector2(.625, .5), new THREE.Vector2(.75, .5), new THREE.Vector2(.75, .625), new THREE.Vector2(.625, .625)] );
		mountains.push( [new THREE.Vector2(.75, .5), new THREE.Vector2(.875, .5), new THREE.Vector2(.875, .625), new THREE.Vector2(.75, .625)] );

		mountains.push( [new THREE.Vector2(0, .375), new THREE.Vector2(.125, .375), new THREE.Vector2(.125, .5), new THREE.Vector2(0, .5)] );
		mountains.push( [new THREE.Vector2(.125, .375), new THREE.Vector2(.25, .375), new THREE.Vector2(.25, .5), new THREE.Vector2(.125, .5)] );
		mountains.push( [new THREE.Vector2(.25, .375), new THREE.Vector2(.375, .375), new THREE.Vector2(.375, .5), new THREE.Vector2(.25, .5)] );
		mountains.push( [new THREE.Vector2(.375, .375), new THREE.Vector2(.5, .375), new THREE.Vector2(.5, .5), new THREE.Vector2(.375, .5)] );
		mountains.push( [new THREE.Vector2(.5, .375), new THREE.Vector2(.625, .375), new THREE.Vector2(.625, .5), new THREE.Vector2(.5, .5)] );
		mountains.push( [new THREE.Vector2(.625, .375), new THREE.Vector2(.75, .375), new THREE.Vector2(.75, .5), new THREE.Vector2(.625, .5)] );
		mountains.push( [new THREE.Vector2(.75, .5), new THREE.Vector2(.875, .5), new THREE.Vector2(.875, .625), new THREE.Vector2(.75, .625)] );
		
		mountains.push( [new THREE.Vector2(0, .25), new THREE.Vector2(.125, .25), new THREE.Vector2(.125, .375), new THREE.Vector2(0, .375)] );
		mountains.push( [new THREE.Vector2(.125, .25), new THREE.Vector2(.25, .25), new THREE.Vector2(.25, .375), new THREE.Vector2(.125, .375)] );
		mountains.push( [new THREE.Vector2(.25, .25), new THREE.Vector2(.375, .25), new THREE.Vector2(.375, .375), new THREE.Vector2(.25, .375)] );
		mountains.push( [new THREE.Vector2(.375, .25), new THREE.Vector2(.5, .25), new THREE.Vector2(.5, .375), new THREE.Vector2(.375, .375)] );
		mountains.push( [new THREE.Vector2(.5, .25), new THREE.Vector2(.625, .25), new THREE.Vector2(.625, .375), new THREE.Vector2(.5, .375)] );
		mountains.push( [new THREE.Vector2(.625, .25), new THREE.Vector2(.75, .25), new THREE.Vector2(.75, .375), new THREE.Vector2(.625, .375)] );
		mountains.push( [new THREE.Vector2(.75, .25), new THREE.Vector2(.875, .25), new THREE.Vector2(.875, .375), new THREE.Vector2(.75, .375)] );
		//city
		var city = [new THREE.Vector2(0, .875), new THREE.Vector2(.125, .875), new THREE.Vector2(.125, 1), new THREE.Vector2(0, 1)];

		var meshArray = new Array(); 

		var sizeWithStepHeight = (this.tileSize*mapHeight)/2;
		var sizeWithStepWidth = (this.tileSize*mapWidth)/2;
		var y = -sizeWithStepHeight;

		for ( var i = 0 ; i < mapHeight; i++ ){
			var x = -sizeWithStepWidth;

			for ( var j = 0; j < mapWidth; j++ ){
				var pointId = i*mapHeight + j;
				var point = gridArray[pointId];
				var mesh;

				if( point.coverType == 7 ){
					//create forest ( trees );
					for( var k = -treeTileSize; k <= treeTileSize; k += stepTree ){
						for( var l = -treeTileSize; l <= treeTileSize; l += stepTree ){
							var num = Math.random();
							if( num <= 0.5){
								//create tree;
								var rnum = Math.floor(Math.random()*(trees.length));
								var newTreeGeometry = trees[rnum];
								var planeGeometry = new THREE.PlaneGeometry( this.tileSize/2, this.tileSize/2, 1 );
								planeGeometry.faceVertexUvs[0] = [];
								planeGeometry.faceVertexUvs[0][0] = [ newTreeGeometry[0], newTreeGeometry[1], newTreeGeometry[3] ];
								planeGeometry.faceVertexUvs[0][1] = [ newTreeGeometry[1], newTreeGeometry[2], newTreeGeometry[3] ];
								mesh = new THREE.Mesh( planeGeometry, material );
								mesh.rotateY(0.7584);
								mesh.rotateZ(1.5708);
								mesh.position.set(x + k - 4, treeTileSize/2, y + l - 4);
								meshArray.push( mesh );
							}
						}
					}								
				}
				else if( point.coverType == 8 ){
					//create rocks
					var rnum = Math.floor(Math.random()*(mountains.length));
					var newRockGeometry = mountains[rnum];
					var planeGeometry = new THREE.PlaneGeometry( this.tileSize, this.tileSize, 1 );
					planeGeometry.faceVertexUvs[0] = [];
					planeGeometry.faceVertexUvs[0][0] = [ newRockGeometry[0], newRockGeometry[1], newRockGeometry[3] ];
					planeGeometry.faceVertexUvs[0][1] = [ newRockGeometry[1], newRockGeometry[2], newRockGeometry[3] ];
					mesh = new THREE.Mesh( planeGeometry, material );
					mesh.rotateY(0.7584);
					mesh.rotateZ(1.5708);
					mesh.position.set( x + this.tileSize/2, this.tileSize/2, y + this.tileSize/2 );
					meshArray.push( mesh );
				}
				else if( point.coverType == 9 ){
					//create city
					var planeGeometry = new THREE.PlaneGeometry( this.tileSize, this.tileSize, 1 );
					planeGeometry.faceVertexUvs[0] = [];
					planeGeometry.faceVertexUvs[0][0] = [ city[0], city[1], city[3] ];
					planeGeometry.faceVertexUvs[0][1] = [ city[1], city[2], city[3] ];
					mesh = new THREE.Mesh( planeGeometry, material );
					mesh.rotateY(0.7584);
					mesh.rotateZ(1.5708);
					mesh.position.set( x + this.tileSize/2, this.tileSize/2, y + this.tileSize/2 );
					meshArray.push( mesh );
				}

				x += this.tileSize;
			}

			y += this.tileSize;
		}

		var geometry = this.megreMeshes( meshArray );
		var newMesh = new THREE.Mesh( geometry, material);
		//newMesh.castShadow = true;
		return newMesh;
	}

	private createGroundLayerGraphics( newTexture, gridSizeHeight, gridSizeWidth, gridArray ){

		var solidArray = new Array();
		var liquidArray = new Array();

		var planeGeometry; //ground tile;
		var textureLoader = new THREE.TextureLoader();
		var tex = textureLoader.load( newTexture );

		var solidMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff , map:tex, shininess: 0, side: THREE.DoubleSide } );
		var liquidMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff , map:tex, shininess: 25 } );

		var sand = [new THREE.Vector2(.01, .76), new THREE.Vector2(.24, .76), new THREE.Vector2(.24, .99), new THREE.Vector2(.01, .99)];
		var road = [new THREE.Vector2(.26, .76), new THREE.Vector2(.49, .76), new THREE.Vector2(.49, .99), new THREE.Vector2(.26, .99)];
		var rock = [new THREE.Vector2(.51, .76), new THREE.Vector2(.74, .76), new THREE.Vector2(.74, .99), new THREE.Vector2(.51, .99)];
		var lava = [new THREE.Vector2(.76, .76), new THREE.Vector2(.99, .76), new THREE.Vector2(.99, .99), new THREE.Vector2(.76, .99)];
		var earth = [new THREE.Vector2(.01, .51), new THREE.Vector2(.24, .51), new THREE.Vector2(.24, .74), new THREE.Vector2(.01, .74)];
		var water = [new THREE.Vector2(.26, .51), new THREE.Vector2(.49, .51), new THREE.Vector2(.49, .74), new THREE.Vector2(.26, .74)];
		var swamp = [new THREE.Vector2(.51, .51), new THREE.Vector2(.74, .51), new THREE.Vector2(.74, .74), new THREE.Vector2(.51, .74)];
		var oil = [new THREE.Vector2(.76, .51), new THREE.Vector2(.99, .51), new THREE.Vector2(.99, .74), new THREE.Vector2(.76, .74)];
		var city = [new THREE.Vector2(.01, .26), new THREE.Vector2(.24, .26), new THREE.Vector2(.24, .49), new THREE.Vector2(.01, .49)];
		var forest = [new THREE.Vector2(.26, .26), new THREE.Vector2(.49, .26), new THREE.Vector2(.49, .49), new THREE.Vector2(.26, .49)];

		var mesh;
		var sizeWithStepHeight = (this.tileSize*gridSizeHeight)/2;
		var sizeWithStepWidth = (this.tileSize*gridSizeWidth)/2;
		var y = -sizeWithStepHeight;
		 // 0 - free ; 1 - water; 2 - lava; 3 - swamp; 4 - earth; 5 - sand; 6 - road; 7 - forest; 8 - rocks; 9 - city;
		for ( var i = 0 ; i < gridSizeHeight; i++ ){
			var x = -sizeWithStepWidth;

			for ( var j = 0; j < gridSizeWidth; j++ ){
				var pointId = i*gridSizeHeight + j;
				var point = gridArray[pointId];
				planeGeometry = new THREE.PlaneGeometry( this.tileSize, this.tileSize, 1 );

				if( point.coverType == 0 ){
					//create free; now it's oil;
					planeGeometry.faceVertexUvs[0] = [];
					planeGeometry.faceVertexUvs[0][0] = [ oil[0], oil[1], oil[3] ];
					planeGeometry.faceVertexUvs[0][1] = [ oil[1], oil[2], oil[3] ];
					mesh = new THREE.Mesh( planeGeometry, liquidMaterial );
					mesh.rotateX(-1.5708);
					mesh.position.set(x, 0, y);
					liquidArray.push( mesh );
				}
				else if( point.coverType == 1 ){
					//create water;
					planeGeometry.faceVertexUvs[0] = [];
					planeGeometry.faceVertexUvs[0][0] = [ water[0], water[1], water[3] ];
					planeGeometry.faceVertexUvs[0][1] = [ water[1], water[2], water[3] ];
					mesh = new THREE.Mesh( planeGeometry, liquidMaterial );
					mesh.rotateX(-1.5708);
					mesh.position.set(x, 0, y);
					liquidArray.push( mesh );
				}
				else if( point.coverType == 2 ){
					//create lava;
					planeGeometry.faceVertexUvs[0] = [];
					planeGeometry.faceVertexUvs[0][0] = [ lava[0], lava[1], lava[3] ];
					planeGeometry.faceVertexUvs[0][1] = [ lava[1], lava[2], lava[3] ];
					mesh = new THREE.Mesh( planeGeometry, solidMaterial );
					mesh.rotateX(-1.5708);
					mesh.position.set(x, 0, y);
					solidArray.push( mesh );
				}
				else if( point.coverType == 3 ){
					//create swamp;
					planeGeometry.faceVertexUvs[0] = [];
					planeGeometry.faceVertexUvs[0][0] = [ swamp[0], swamp[1], swamp[3] ];
					planeGeometry.faceVertexUvs[0][1] = [ swamp[1], swamp[2], swamp[3] ];
					mesh = new THREE.Mesh( planeGeometry, solidMaterial );
					mesh.rotateX(-1.5708);
					mesh.position.set(x, 0, y);
					solidArray.push( mesh );
				}
				else if( point.coverType == 4 ){
					//create earth;
					planeGeometry.faceVertexUvs[0] = [];
					planeGeometry.faceVertexUvs[0][0] = [ earth[0], earth[1], earth[3] ];
					planeGeometry.faceVertexUvs[0][1] = [ earth[1], earth[2], earth[3] ];
					mesh = new THREE.Mesh( planeGeometry, solidMaterial );
					mesh.rotateX(-1.5708);
					mesh.position.set(x, 0, y);
					solidArray.push( mesh );
				}
				else if( point.coverType == 5 ){
					//create sand;
					planeGeometry.faceVertexUvs[0] = [];
					planeGeometry.faceVertexUvs[0][0] = [ sand[0], sand[1], sand[3] ];
					planeGeometry.faceVertexUvs[0][1] = [ sand[1], sand[2], sand[3] ];
					mesh = new THREE.Mesh( planeGeometry, solidMaterial );
					mesh.rotateX(-1.5708);
					mesh.position.set(x, 0, y);
					solidArray.push( mesh );
				}
				else if( point.coverType == 6 ){
					//create road;
					planeGeometry.faceVertexUvs[0] = [];
					planeGeometry.faceVertexUvs[0][0] = [ road[0], road[1], road[3] ];
					planeGeometry.faceVertexUvs[0][1] = [ road[1], road[2], road[3] ];
					mesh = new THREE.Mesh( planeGeometry, solidMaterial );
					mesh.rotateX(-1.5708);
					mesh.position.set(x, 0, y);
					solidArray.push( mesh );
				}
				else if( point.coverType == 7 ){
					//create forest
					planeGeometry.faceVertexUvs[0] = [];
					planeGeometry.faceVertexUvs[0][0] = [ forest[0], forest[1], forest[3] ];
					planeGeometry.faceVertexUvs[0][1] = [ forest[1], forest[2], forest[3] ];
					mesh = new THREE.Mesh( planeGeometry, solidMaterial );
					mesh.rotateX(-1.5708);
					mesh.position.set(x, 0, y);
					solidArray.push( mesh );
				}
				else if( point.coverType == 8 ){
					//create rock
					planeGeometry.faceVertexUvs[0] = [];
					planeGeometry.faceVertexUvs[0][0] = [ rock[0], rock[1], rock[3] ];
					planeGeometry.faceVertexUvs[0][1] = [ rock[1], rock[2], rock[3] ];
					mesh = new THREE.Mesh( planeGeometry, solidMaterial );
					mesh.rotateX(-1.5708);
					mesh.position.set(x, 0, y);
					solidArray.push( mesh );
				}
				else if( point.coverType == 9 ){
					//create city;
					planeGeometry.faceVertexUvs[0] = [];
					planeGeometry.faceVertexUvs[0][0] = [ city[0], city[1], city[3] ];
					planeGeometry.faceVertexUvs[0][1] = [ city[1], city[2], city[3] ];
					mesh = new THREE.Mesh( planeGeometry, solidMaterial );
					mesh.rotateX(-1.5708);
					mesh.position.set(x, 0, y);
					solidArray.push( mesh );
				}

				x += this.tileSize;
			}
			y += this.tileSize;
		}

		//merge meshes to 1 global mesh;
		var solidGeometry = this.megreMeshes( solidArray );
		var liquidGeometry  = this.megreMeshes( liquidArray );		

		var solidMesh = new THREE.Mesh( solidGeometry, solidMaterial );
		//earthMesh.receiveShadow = true;
		var liquidMesh = new THREE.Mesh( liquidGeometry, liquidMaterial );

		var group = new THREE.Group();

		group.add( solidMesh );
		group.add( liquidMesh );

		return group;		
	}

	private createLight(){
		//ambientLight;
		//var ambientLight = new THREE.AmbientLight( 0x404040 );
		//scene.add( ambientLight );
		
		this.hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffdf, 0.6 );
		this.hemiLight.position.set(0, 500, 0);
		this.scene.add( this.hemiLight );

		//direction light;
		this.directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
		this.directionalLight.position.set( 0, 0.75, 0 ).normalize();
		this.scene.add( this.directionalLight );
		//var targetObject = new THREE.Object3D();
		//scene.add(targetObject);
		//directionalLight.target = targetObject;

		//spot light
		this.spotLight = new THREE.SpotLight( 0xfffffd, 0.25, 0, 1.05, 1, 1 ); //color, intensity, distance, angle, penumbra, decay
		this.spotLight.position.set( 10000, 10000, 10000 );
		//spotLight.castShadow = true;
		//spotLight.shadow.mapSize.width = 1024;
		//spotLight.shadow.mapSize.height = 1024;
		//spotLight.shadow.camera.near = 500;
		//spotLight.shadow.camera.far = 4000;
		//spotLight.shadow.camera.fov = 30;
		this.scene.add( this.spotLight );
	}

	// Grid
	private createGraphicGridLines( gridSizeHeight, gridSizeWidth):void{
		var geometry = new THREE.Geometry();
		var sizeWithStepHeight = (this.tileSize*gridSizeHeight)/2;
		var sizeWithStepWidth = (this.tileSize*gridSizeWidth)/2;

		for (var y = -sizeWithStepHeight; y <= sizeWithStepHeight; y += this.tileSize){
			for (var x = -sizeWithStepWidth; x <= sizeWithStepWidth; x += this.tileSize){
				geometry.vertices.push( new THREE.Vector3( x, 0, -y ) );
				geometry.vertices.push( new THREE.Vector3(   x, 0, y ) );
				geometry.vertices.push( new THREE.Vector3( -y, 0, x ) );
				geometry.vertices.push( new THREE.Vector3( y, 0,   x ) );
			}
		}

		var material = new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 0.2 } );
		this.grid = new THREE.LineSegments( geometry, material );
		this.grid.position.x -= this.tileSize/2;
		this.grid.position.z -= this.tileSize/2;
		this.scene.add( this.grid );
	}

	private megreMeshes( arrayOfMeshes ):any{
		var geometry = new THREE.Geometry();
		for ( var i = 0; i < arrayOfMeshes.length; i++ ){
			arrayOfMeshes[i].updateMatrix();
			geometry.merge( arrayOfMeshes[i].geometry, arrayOfMeshes[i].matrix );
		}
		return geometry;
	}
}

class Entity {

	public name:string;
	public id:string;

	private components:Array<any>;

	constructor (newId:string, newName:string){
		this.name = newName;
		this.id = newId;
		this.components = new Array();
	}

	public addComponent(component):void{
		var index = this.checkComponentInComponents(component);
		if (index == 0){
			this.components.push(component);
		}else{
			this.components[index] = component;
		}
	}

	public removeComponent(component):void{
		console.log("i removed component");
	}

	public getComponent(componentName):any{
		for (var i = 0; i < this.components.length; i++){
			if (this.components[i].componentName == componentName)
				return this.components[i];
		}
		return null;
	}

	public createComponent(componentName):any{
		var component;
		if (componentName == "City"){
			component = new City("noname", "0");
		}

		return component;
	}

	private checkComponentInComponents(component):number{
		var newComponentName = component.componentName;
		for (var i = 0; i < this.components.length; i++){
			if (this.components[i].componentName == newComponentName)
				return i;		
		}

		return 0;
	}

	public update(dx):void{
		for (var i = 0; i < this.components.length; i++){
			this.components[i].update(dx);
		}
	}


}

class Component {
	public id:string;
	public componentName:string;

	constructor (newName, newId){
		this.id = newId;
		this.componentName = newName;
	}

	public update(dx){

	}
}

class City extends Component {

	public name:string;
	public roadAmount:number;
	public roadToCities:Array<string>; // контейнер для генератора, что бы понять, что город соединен с другим городом и дополнительная дорога не нужна;
	public gridCoordinates:any;
	public gridId:number;

	constructor (newName, id){
		super("City", id);
		this.name = newName;
		this.roadAmount = 0;
		this.roadToCities = new Array();
	}

	public update(dx){

	}

	public checkRoadToCity(cityName):boolean{
		for (var i = 0 ; i < this.roadToCities.length; i++){
			if (cityName == this.roadToCities[i])
				return true;
		}

		return false;
	}

	public addRoadToCity(cityName):void{
		this.roadToCities.push(cityName);
	}
}
/*
class Name extends Component{
	public name:string;
	public surname:string;

	constructor(){

	}

	private generateNpcName(type, race, sex){ //return string;
		var fname = Math.floor(Math.random()*firstPartName.length);
		var sname = Math.floor(Math.random()*secondPartName.length);
		var tname;
		if (sex == 0){ // 0 - man;
			tname = thirdPartNameMale[Math.floor(Math.random()*thirdPartNameMale.length)];
		}else{
			tname = thirdPartNameFemale[Math.floor(Math.random()*thirdPartNameFemale.length)];
		}

		var name = firstPartName[fname] + secondPartName[sname] + tname;
		return name;
		
	}

	private generateNpcSurname(type, race){ //return string
		var fname = Math.floor(Math.random()*firstPartSurname.length);
		var sname = Math.floor(Math.random()*secondPartSurname.length);
		var tname = Math.floor(Math.random()*thirdPartSurname.length);

		var name = firstPartSurname[fname] + secondPartSurname[sname] + thirdPartSurname[tname];
		return name;	
	}

}
*/