

var dataCityNames = [ firstPartCityName, secondPartCityName, thirdPatrCityName ];
var dataNpcNames = [ firstPartName, secondPartName, thirdPartNameMale, thirdPartNameFemale ];
var dataNpsSurnames = [ firstPartSurname, secondPartSurname, thirdPartSurname ];

var graphics = new Graphics( 128 );
var entityRoot = new EntityRoot();
var ground = new GroundMap( 100, 100 );

var player;

initLogic();
createGraphics();


function createGraphics(){

	graphics.createGraphics( mapWidth, mapHeight, ground.logicGrid );
}

function initLogic(){
	var params = { 
		"Forest": [50, 15, 10, 1, 1, 20],
		"Rocks": [50, 8, 5, 1, 1, 12],
		"Water": [2, 8],
		"Swamp": [12, 3, 3],
		"Sand": [4, 6],
		"River": ["Water", 0, false, 3, 1, 1, 4, 2],
		"City": [null, 16, 2, 8]
	};
	ground.generateBiomMap( "Earth", params );
	ground.createCityEntities( entityRoot, [null, dataCityNames]);
	ground.generateRoadFromCityToCity(1);

}

function createPlayer(){

	player = entityRoot.createEntity( "Player" );
	var component = player.createComponent( "Name" );
	component.init( dataNpcNames, dataNpsSurnames );
	component.generateName(0);
	component.generateSurname();
	player.addComponent( component );
	component = player.createComponent( "GridPosition" );
	component.changePosition( 0, 0 );
	player.addComponent( component );
	component = player.createComponent( "Move" );
	component.init( 128, 100, 100, 64, 0, 0 );
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

