import { Component } from "./Component";

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
