import { Component } from "./Component";

export class Move extends Component{

	public x:number;
	public y:number;

	private halfTileSize:number;
	private gridTileSize:number;
	private gridHeight:number;
	private gridWidth:number;
	private gridStepWidth:number;
	private gridStepHeight:number;

	constructor( parent ){
		super( "Move", parent );
	}

	public init( gridTileSize, gridWidth, gridHeight, tileSize, x, y ):void{
		this.halfTileSize = tileSize/2;
		this.gridTileSize = gridTileSize;
		this.gridWidth = gridWidth;
		this.gridHeight = gridHeight;
		this.gridStepHeight = -(gridTileSize*gridHeight)/2
		this.gridStepWidth = -(gridTileSize*gridWidth)/2
		this.x = this.gridStepWidth + x * gridTileSize;
		this.y = this.gridStepHeight + y * gridTileSize;
	}

	public move( x, y ):void{
		this.x += x;
		this.y += y;

		this.gridMove();

	}

	private gridMove():void{
		var gridX = Math.floor( (this.x + this.gridStepWidth)/this.gridTileSize );
		var gridY = Math.floor( (this.y + this.gridStepHeight)/this.gridTileSize );


		var component = this.parent.getComponent( "GridPosition" );
		component.position.x = gridX;
		component.position.y = gridY;
	}
}

