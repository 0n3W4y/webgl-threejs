import { Component } from "./Component";

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

