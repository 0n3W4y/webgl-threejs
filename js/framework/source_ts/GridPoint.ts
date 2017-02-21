export class GridPoint {

	public gridId: number;
	public pointType: number; // 0-liquid, 1 - flat, 2 - cubic;
	public coverType: number; // 0 - free ; 1 - water; 2 - lava; 3 - swamp; 4 - earth; 5 - sand; 6 - road; 7 - forest; 8 - rocks; 9 - city;
	public effectType: number; // 0 - nothing, 1 - fire, 2 - wet, 3 - snow, 4- blood;
	public movementRatio: number; // 1- normal. 2- superfast - 0.1 - minimum speed;
	public graphicIndex:number; // index need for graphics;
	public gridCoords: any; // coordinates where this tile in grid;

	constructor (id, point, cover, effect, speed, newIndex, coords){
		this.gridId = id;
		this.pointType = point;
		this.coverType = cover;
		this.effectType = effect;
		this.movementRatio = speed;
		this.graphicIndex = newIndex;
		this.gridCoords = coords;
	}
}