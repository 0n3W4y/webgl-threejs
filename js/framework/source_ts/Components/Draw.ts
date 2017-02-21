import { Component } from "./Component";

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