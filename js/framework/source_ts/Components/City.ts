import { Component } from "./Component";

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

