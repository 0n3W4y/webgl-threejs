import { GridCoordinates } from "./GridCoordinates";
import { Component } from "./Components/Component";
import { Name } from "./Components/Name";
import { Type } from "./Components/Type";
import { City } from "./Components/City";
import { GridPosition } from "./Components/GridPosition";
import { Move } from "./Components/Move";
import { Draw } from "./Components/Draw";

export class Entity {

	private components:any;

	constructor( name, id, index ){
		this.components = new Object();
		this.init( name, id, index );
	}

	private init( name, id, index ){
		// создаем компомнент Type;
		var component = this.createComponent( 'Type' );
		component.init( name, id, index );
		this.addComponent( component );
	}

	public createComponent( componentName ):any{
		var component;
		if( componentName == "City" )
			component = new City( this );
		else if( componentName == "Name" )
			component = new Name( this );
		else if( componentName == "Type")
			component = new Type( this );
		else if( componentName == "GridPosition" )
			component = new GridPosition( this );
		else if( componentName == "Move" )
			component = new Move( this );
		else if( componentName == "Draw" )
			component = new Draw( this );
		else if( componentName == "Type" )
			component = new Type( this );
		else{
			console.log( "Not found component with name: " + componentName + "; Error in Entity/createComponent");
			return null;
		}
		return component;
	}

	public addComponent( component ):void{
		this.components[component.componentName] = component;
	}

	public removeComponent( componentName ):any{
		var component = this.components[componentName];
		delete this.components[componentName];
		return component;
	}

	public getComponent( componentName ):any{
		if( !( this.components[componentName] === undefined ) )
			return this.components[componentName];
		else
			return null;
	}

	public update( dx ):void{
		for( var key in this.components ){
			this.components[key].update( dx );
		}
	}
}