class GroundMap{
	public width:number;
	public height:number;
	public size:number;
	public logicGrid:Array<any>;

	private cityCoordinatesArray:Array<any>;

	constructor( width, height ){
		this.width = width;
		this.height = height;
		this.size = width*height;
		this.logicGrid = new Array();
		this.cityCoordinatesArray = new Array();
	}

	public generateBiomMap( primaryGroundBiom, params ):void{ //{ "Earth" : [amount, width, height, offset, step, maxWidth]...}

		// генерируем все параметры в определенном порядке
		var obj = { "Earth": [], "Sand": [], "Forest": [], "Water": [], "Lava": [], "Swamp": [], "Rocks": [], "River": [], "City": [] };

		this.fillLogicGrid( primaryGroundBiom );

		for( var key in params ){
			if( !( obj[key] === undefined ) )
				obj[key] = params[key];				
		}

		for( var prop in obj ){
			var params = obj[prop];
			if( params.length > 0 )
				this.generateGroundMapObjects( prop, params );
		}

	}

	private fillLogicGrid(type):void{
		var coverType;
		var pointType;
		var movementRatio;

		if( type == "Earth" ){
			coverType = 4;
			pointType = 1;
			movementRatio = 0.8;
		}
		else if( type == "Sand" ){
			coverType = 5;
			pointType = 1;
			movementRatio = 0.6;
		}
		else if( type == "Water" ){

		}
		else if( type == "Lava" ){

		}
		else if( type == "Oil" ){

		}
		else{
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

	public generateCities( args ):void{
		var cityType = args[0];
		var cityAmount = args[1] || Math.min(Math.round(this.width/5), Math.round(this.height/5)); // default;
		var safeZone = args[2] || 2; //default;
		var minRadius = args[3] || Math.round((this.width+this.height)/(2*cityAmount)); //default
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
				var newCoords = new GridCoordinates( pointX, pointY );
				temporaryArrayForCheckCoords.push( newCoords );
				var gridId = pointY*this.height + pointX;
				this.logicGrid[gridId].coverType = 9;
				this.logicGrid[gridId].pointType = 2;
				this.logicGrid[gridId].movementRatio = 1;
			}else{
				i--;
			}

		}

		this.cityCoordinatesArray = temporaryArrayForCheckCoords;
	}

	//angular -  будет ли река поворачивать на 90 градусов ( true; false); type - 0 - simple river, 1 - river with lake, 2 - river with solid;
	private generateRiver( args ){ //  type, angular, width, offset, step, maxWidth, minWidth

		var type = args[0];
		var liquidType = args[1] || 0; //simple river default;
		var liquidAngulatChanse = args[2] || false; // no chanse on default;
		var liquidWidth = args[3] || Math.round(this.width*0.05); //max 5%;
		var liquidOffset = args[4] || 1; //max 1;
		var liquidStep = args[5] || 1; //max 1;
		var liquidMaxWidth = args[6] || (liquidWidth + 5) // max +5;
		var liquidMinWidth = args[7] || 2;// 0 - river can be underground;

		var pointType;
		var coverType;
		var movementRatio;

		if( type == "Water" ){
			coverType = 1;
			movementRatio = 0.4;
			pointType = 0;
		}
		else if( type == "Lava" ){
			coverType = 2;
			movementRatio = 0;
			pointType = 0;
		}
		else if( type == "Oil" ){
			coverType = 0;
			movementRatio = 0.2;
			pointType = 0;
		}

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
					point.pointType = pointType; // water
					point.movementRatio = movementRatio;
					point.coverType = coverType // water;

				}
			}
		}
	}

	// generating with WIDTH, so height is static; 
	//offset - есть ли смещение влево или вправо и на сколько, step - на сколько сильно может уменьшаться или увеличиваться объект с каждой последующей Y  координатой;
	private generateGroundMapObjects(type, args){ //amount, width, height, offset, step, maxWidth
		if( type == "River" ){
			this.generateRiver( args );
			return;
		}
		else if( type == "City" ){
			this.generateCities( args );
			return;
		}

		var pointType;
		var movementRatio;
		var coverType;
		if (type == "Water"){
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

		var liquidAmount = args[0] || 1; // max 1
		var liquidWidth = args[1] || Math.round(this.width/10) // max 10%
		var liquidHeight = args[2] || Math.round(this.height/10) // max 10%
		var liquidOffset = args[3] || 1; //max 1;
		var liquidStep = args[4] || 1; //max 1;
		var liquidMaxWidth = args[5] || (liquidWidth + 5); // max +5;
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
	public generateRoadFromCityToCity( amount ){
		var roadAmount = amount || 2; //2 max;
		var distanceArray = null;

		for (var j = 0; j < this.cityCoordinatesArray.length; j++){
			var city = this.cityCoordinatesArray[j];
			distanceArray = this.calculateDistanceFromCity( city );
			if (distanceArray != null){
				for (var i = 0; i < roadAmount; i++){
					this.createRoadFromCityToCity(city, distanceArray);
				}
			}
		}		
	}

	private createRoadFromCityToCity(city, citiesArray){
		var newCity = null;
		var newCityPosition = null;
		var newCityName = null;
		var currentCity = city.getComponent( 'City' );
		var currentCityName = city.getComponent( 'Name' ).surname;
		var currentCityPosition = city.getComponent( 'GridPosition' ).position;

		for( var k = 0; k < citiesArray.length; k++ ){
			var tempCityName = citiesArray[k].getComponent( 'Name' ).surname;
			var tempCity = citiesArray[k].getComponent( 'City' );
			if (tempCityName != currentCityName && !tempCity.checkRoadToCity(currentCityName)){
				newCity = tempCity;
				newCityPosition = citiesArray[k].getComponent( 'GridPosition' ).position;
				newCityName = citiesArray[k].getComponent( 'Name' ).surname;
				if( k > 0 ){
					var previousCityName = citiesArray[k-1].getComponent( 'Name' ).surname;
					if( !tempCity.checkRoadToCity( previousCityName ) )
						break;
				}
			}
		}

		if (newCity == null)
			return;

		var pointX = currentCityPosition.x;
		var pointY = currentCityPosition.y;
		var toPointX = newCityPosition.x;
		var toPointY = newCityPosition.y;

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
				currentCity.addRoadToCity(newCityName);
				newCity.roadAmount ++;
				newCity.addRoadToCity(currentCityName);
				break; 
			}

		}


	}

	private calculateDistanceFromCity( city ):Array<any>{ //return Array of numbers;
		var dsArray = new Array();
		var temporary = new Array();
		var result = new Array();

		var pointX = city.getComponent( "GridPosition" ).position.x;
		var pointY = city.getComponent( "GridPosition" ).position.y;

		//собираем информацию о дистанции до города со всех городов.
		for (var i = 0 ; i < this.cityCoordinatesArray.length; i++){
			var newCity = this.cityCoordinatesArray[i];
			var newCityName = newCity.getComponent( 'Name' ).surname;
			//
			var newPointX = newCity.getComponent( "GridPosition" ).position.x;
			var newPointY = newCity.getComponent( "GridPosition" ).position.y;

			var difX = Math.abs(pointX - newPointX);
			var difY = Math.abs(pointX - newPointX);
			var dif = Math.round(Math.sqrt(difX*difX + difY*difY));

			dsArray.push( dif ); // пушим дистанцию
		}

		temporary = dsArray.slice(); // copy;

		temporary.sort(function(a,b){ return a-b; }); // сортируем.

		//делаем отправной массив с ссылками на города. но в порядке от самых ближайших городов до самых дальних.
		for (var j = 0; j <dsArray.length; j++){
			var searchNum = temporary[j];
			var index = dsArray.indexOf(searchNum);
			result.push(this.cityCoordinatesArray[index]);
		}

		return result;

	}

	public createCityEntities( entityRoot, namesArray ){

		for( var i = 0; i < this.cityCoordinatesArray.length; i++ ){
			var coordinates = this.cityCoordinatesArray[i];
			var newCity = entityRoot.createEntity( "City" );
			var component = newCity.createComponent( "City" );
			newCity.addComponent( component );

			component = newCity.createComponent( "Name" );
			component.init( namesArray[0], namesArray[1] );
			component.generateSurname();
			newCity.addComponent( component );

			component = newCity.createComponent( "GridPosition" );
			component.changePosition( coordinates.x, coordinates.y );
			component.gridId = this.height*coordinates.y + coordinates.x;
			newCity.addComponent( component );
			//заменяем внутри массива значение с простыми координатами на ссылку, полученную в результате создания Entity. Это необходмо для работы функции прокладки дороги.
			this.cityCoordinatesArray[i] = newCity;
		}		
	}
}