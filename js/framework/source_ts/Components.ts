import { GridCoordinates } from "./GridCoordinates";

export class Component {
	public componentName:string;

	protected parent:any;

	constructor( newName, parent ){
		this.componentName = newName;
		this.parent = parent;
	}

	public update( dx ):void{

	}

	public changeParent( newParent ):void{
		this.parent = newParent;
	}
}

export class City extends Component {

	public roadAmount:number;
	public roadToCities:Array<string>; // контейнер для генератора, что бы понять, что город соединен с другим городом и дополнительная дорога не нужна;

	constructor( parent ){
		super("City", parent);
		this.roadAmount = 0;
		this.roadToCities = new Array();
	}

	public checkRoadToCity( cityName ):boolean{
		for (var i = 0 ; i < this.roadToCities.length; i++){
			if (cityName == this.roadToCities[i])
				return true;
		}

		return false;
	}

	public addRoadToCity( cityName ):void{
		this.roadToCities.push( cityName );
	}
}

export class Name extends Component{
	public name:string;
	public surname:string;

	private namesArray:Array<any>;
	private surnamesArray:Array<any>;

	constructor( parent ){
		super("Name", parent );
	}

	public init( namesArray, surnamesArray ){
		this.namesArray = namesArray;
		this.surnamesArray = surnamesArray;
	}

	public generateName( sex ):void{
		var firstPartName = this.namesArray[0];
		var secondPartName = this.namesArray[1];
		var thirdPartNameMale = this.namesArray[2];
		var thirdPartNameFemale = this.namesArray[3];

		var fname = Math.floor(Math.random()*firstPartName.length);
		var sname = Math.floor(Math.random()*secondPartName.length);
		var tname;
		if (sex == 0){ // 0 - man;
			tname = thirdPartNameMale[Math.floor(Math.random()*thirdPartNameMale.length)];
		}else{
			tname = thirdPartNameFemale[Math.floor(Math.random()*thirdPartNameFemale.length)];
		}

		this.name = firstPartName[fname] + secondPartName[sname] + tname;
		
	}

	private generateSurname():void{ 
		var firstPartSurname = this.surnamesArray[0];
		var secondPartSurname = this.surnamesArray[1];
		var thirdPartSurname = this.surnamesArray[2];

		var fname = Math.floor(Math.random()*firstPartSurname.length);
		var sname = Math.floor(Math.random()*secondPartSurname.length);
		var tname = Math.floor(Math.random()*thirdPartSurname.length);

		this.surname = firstPartSurname[fname] + secondPartSurname[sname] + thirdPartSurname[tname];
			
	}

}

export class Move extends Component{

	public x:number;
	public y:number;

	private halfTileSize:number;
	private gridTileSize:number;

	constructor( parent ){
		super( "Move", parent );
	}

	public init( gridTileSize, tileSize, x, y ):void{
		this.halfTileSize = tileSize/2;
		this.gridTileSize = gridTileSize;
		this.x = x;
		this.y = y;
	}

	public move( x, y ):void{
		this.x += x;
		this.y += y;

		this.gridMove();

	}

	private gridMove():void{
		var gridX = Math.floor( this.x/this.gridTileSize + this.halfTileSize );
		var gridY = Math.floor( this.y/this.gridTileSize + this.halfTileSize );

		var component = this.parent.getComponent( "GridPosition" );
		component.position.x = gridX;
		component.position.y = gridY;
	}
}

export class Draw extends Component{

	public graphicIndex:number;
	public tileSize:number;

	constructor( parent ){
		super( "Draw", parent );
	}

	public init( tileSize ):void{
		this.tileSize = tileSize;
	}
}

export class GridPosition extends Component{

	public position:any;
	public gridId:number;

	constructor( parent ){
		super( "GridPosition", parent );
		this.position = new GridCoordinates( 0, 0 );
	}

	public changePosition( x, y ){
		this.position.x = x;
		this.position.y = y;
	}
}

export class Type extends Component{

	public entityName:string;
	public entityId:string;
	public arrayIndex:number;

	constructor( parent ){
		super( "Type", parent );		
	}

	public init( name, entityId, arrayIndex ){
		this.entityName = name;
		this.entityId = entityId;
		this.arrayIndex = arrayIndex;
	}
}
