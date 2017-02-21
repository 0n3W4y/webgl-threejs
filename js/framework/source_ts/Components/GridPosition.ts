import { Component } from "./Component";
import { GridCoordinates } from "../GridCoordinates";

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