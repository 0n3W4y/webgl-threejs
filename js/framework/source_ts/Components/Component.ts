export class Component {
	public componentName:string;

	protected parent:any;

	constructor( newName, parent ){
		this.componentName = newName;
		this.parent = parent;
	}

	public update( dx ):void{

	}
}