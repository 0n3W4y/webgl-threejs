

var tileSizeGraphics = 128; //128 tilesize;
var mapWidth = 100;
var mapHeight = 100;

var dataCityNames = [ firstPartCityName, secondPartCityName, thirdPatrCityName ];
var dataNpcNames = [ firstPartName, secondPartName, thirdPartNameMale, thirdPartNameFemale ];
var dataNpsSurnames = [ firstPartSurname, secondPartSurname, thirdPartSurname ];

var graphics = new Graphics( tileSizeGraphics );
var entityRoot = new EntityRoot();
var ground = new GroundMap( mapWidth, mapHeight );

initLogic();
createGraphics();


function createGraphics(){

	graphics.createGraphics( mapWidth, mapHeight, ground.logicGrid );
}

function initLogic(){
	var params = { "Forest": [50, 15, 10, 1, 1, 20], "Rocks": [50, 8, 5, 1, 1, 12], "Water": [2, 8], "Swamp": [6, 2], "Sand": [4, 6], "River": ["Water", 0, false, 3, 1, 1, 4, 2], "City": [null, 16, 2, 8] };
	ground.generateBiomMap( "Earth", params );
	ground.createCityEntities( entityRoot, [null, dataCityNames]);
	ground.generateRoadFromCityToCity(1);

}

function createPlayer(){
	var player = new Entity( "0", "Player" );
	var component = player.createComponent( "Name" );
	component.init( namesArray, surnamesArray );
	player.addComponent( component );
}

/*
for (var i = 0 ; i < mapHeight; i ++){
	var string = "|";
	for (var j = 0; j < mapWidth; j++){
		var id = i*mapHeight + j;
		var point = ground.logicGrid[id];
		string += point.coverType + "|";
	}

	console.log(string);
}
*/

function update(dx){

}

