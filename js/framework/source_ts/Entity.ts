import { GridCoordinates } from "./GridCoordinates";
import { Component, Name, Type, City, GridPosition, Move, Draw } from "./Components";

export class Entity {

	private components:Array<any>;

	constructor( name, id, index ){
		this.components = new Array();
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

	public addComponent(component):void{
		var index = this.checkComponentInComponents(component);
		component.changeParent( this ); // меняем родителя, если вдруг по каким-то причинам компонент создала другая Entity.
		if (index == 0){
			this.components.push(component);
		}else{
			this.components[index] = component;
		}
	}

	public removeComponent( componentName ):any{
		var component;
		var index = -1;
		for( var i = 0; i < this.components.length; i++ ){
			var curComponent = this.components[i].componentName;
			if( curComponent == componentName ){
				component = this.components[i];
				index = i;
				break;
			}
		}

		this.components.splice( index, 1 );
		return component;
	}

	public getComponent(componentName):any{
		for (var i = 0; i < this.components.length; i++){
			if (this.components[i].componentName == componentName)
				return this.components[i];
		}
		return null;
	}

	private checkComponentInComponents(component):number{
		var newComponentName = component.componentName;
		for (var i = 0; i < this.components.length; i++){
			if (this.components[i].componentName == newComponentName)
				return i;		
		}

		return 0;
	}

	public update(dx):void{
		for (var i = 0; i < this.components.length; i++){
			this.components[i].update(dx);
		}
	}
}