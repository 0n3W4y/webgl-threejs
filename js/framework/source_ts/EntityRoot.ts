import { Entity } from "./Entity";

export class EntityRoot{

	public entitiesArray:Array<any>;

	constructor(){
		this.entitiesArray = new Array();
	}

	public createEntity( type ):any{
		var entity;
		var name;
		var id = this.createId();

		if( type == "Player" ){
			name = "Player";
		}
		else if( type == "City" ){
			name = "City";
		}
		else if( type == "Mob" ){
			name = 'Mob';
		}
		else if( type == "NPC" ){
			name = "NPC";
		}

		var index = this.entitiesArray.length;
		entity = new Entity( name, id, index );
		this.entitiesArray.push( entity );

		return entity;
	}

	public removeEntity( id ):any{
		var index = -1;
		var result = null;
		for( var i = 0; i < this.entitiesArray.length; i++ ){
			var entity = this.entitiesArray[i];
			if( entity.getComponent( 'Type' ).entityId == id ){
				result = entity;
				index = i;
				break;
			}
		}

		this.entitiesArray.splice( index, 1 );

		return result;
	}

	public getEntityById( id ):any{
		for( var i = 0; i < this.entitiesArray.length; i++ ){
			var entityId = this.entitiesArray[i].getComponent( "Type" ).entityId;
			if ( entityId == id )
				return this.entitiesArray[i];
		}

		return null;
	}

	private createId(){
		var id = "0";
		return id;
	}

}