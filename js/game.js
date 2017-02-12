

var tileSizeGraphics = 128; //128 tilesize;
var mapWidth = 100;
var mapHeight = 100;

var graphics;

var ground;


initLogic();
createGraphics();


function createGraphics(){

	graphics = new Graphics(tileSizeGraphics);
	graphics.init();
	graphics.createGraphics( mapWidth, mapHeight, ground.logicGrid );
}

function initLogic(){
	var dataNames = [firstPartCityName, secondPartCityName, thirdPatrCityName];
	ground = new GroundMap( mapWidth, mapHeight, dataNames );
	ground.fillLogicGrid( "Earth" );
	ground.generateGroundMapObjects( "Forest", 50, 15, 10, 1, 1, 20 );
	ground.generateGroundMapObjects( "Rocks", 50, 8, 5, 1, 1, 12 );
	ground.generateGroundMapObjects( "Lake", 2, 8 );
	ground.generateGroundMapObjects( "Swamp", 6, 2 );
	ground.generateGroundMapObjects( "Sand", 4, 6 );
	ground.generateGroundMapObjects( "Lava", 1, 10 );
	ground.generateRiver( 0, false, 3, 1, 1, 4, 2 );
	ground.generateCities( null, 16, 2, 8 );
	ground.generateRoadFromCityToCity(1);

}

/*
for (var i = 0 ; i < gridSizeHeight; i ++){
	var string = "|";
	for (var j = 0; j < gridSizeWidth; j++){
		var id = i*gridSizeHeight + j;
		var point = gridArray[id];
		string += point.coverType + "|";
	}

	console.log(string);
}
*/

function update(dx){

}

