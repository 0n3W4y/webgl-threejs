//event listeners

window.addEventListener( 'resize', onWindowResize, false );
document.addEventListener( 'wheel', onDocumentMouseWheel, false );
document.addEventListener( 'mousedown', onDocumentMouseDown, false );

//move scene on mouse click and drop;
var targetMoveX = 0;
var targetMoveY = 0;
var mouseXOnMouseDown = 0;
var mouseYOnMouseDown = 0;
var targetPositionOnMouseDownX = 0;
var targetPositionOnMouseDownX = 0
var windowHalfX = window.innerWidth/2;
var windowHalfY = window.innerHeight/2;

//show hide grid;
var gridLineShowed = true;

//rotate camera
var cameraPosition = [[200,200], [-200,200], [-200,-200], [200,-200]];
var cameraLastPosition = 0;
var cameraNextPosition = 0;
var cameraMoveRatioX = 0;
var cameraMoveRatioY = 0;
var rotateCam = false;

//loop
var lastTick = 0;
var tickFps = 1000/30;
var timeRatio = 1;
var onPause = false;





//functions;

function onDocumentMouseDown( event ) {
	event.preventDefault();
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mouseup', onDocumentMouseUp, false );
	mouseXOnMouseDown = event.clientX - windowHalfX;
	mouseYOnMouseDown = event.clientY - windowHalfY;
	targetPositionOnMouseDownX = targetMoveX
	targetPositionOnMouseDownY = targetMoveY
}

function onDocumentMouseMove( event ) {
	var mouseX = event.clientX - windowHalfX;
	var mouseY = event.clientY - windowHalfY;
	targetMoveX = targetPositionOnMouseDownX + ( mouseX - mouseXOnMouseDown );
	targetMoveY = targetPositionOnMouseDownY + ( mouseY - mouseYOnMouseDown );

}
function onDocumentMouseUp( event ) {
	document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
}

function onWindowResize() {
	graphics.camera.left = window.innerWidth / - 2;
	graphics.camera.right = window.innerWidth / 2;
	graphics.camera.top = window.innerHeight / 2;
	graphics.camera.bottom = window.innerHeight / - 2;
	graphics.camera.updateProjectionMatrix();
	graphics.renderer.setSize( window.innerWidth - 10, window.innerHeight - 10 );
}

function onDocumentMouseWheel(event){
	if (graphics.camera.zoom > 0.5 && event.deltaY > 0 ){
		graphics.camera.zoom -= 0.1;
	}else if (graphics.camera.zoom < 4 && event.deltaY < 0){
		graphics.camera.zoom += 0.1;
	}

	graphics.camera.updateProjectionMatrix();
	graphics.renderer.setSize( window.innerWidth - 10, window.innerHeight - 10 );
}

function rotateCamera(direction){
	if (!rotateCam){
		var position = cameraLastPosition + direction;

		if (position >= 4)
			cameraNextPosition = 0;
		else if (position <= -1)
			cameraNextPosition = 3;
		else
			cameraNextPosition = position;

		var difX = cameraPosition[cameraLastPosition][0] - cameraPosition[cameraNextPosition][0];
		var difY = cameraPosition[cameraLastPosition][1] - cameraPosition[cameraNextPosition][1];

		if (difX > 0)
			cameraMoveRatioX = -1;
		else if (difX == 0)
			cameraMoveRatioX = 0;
		else
			cameraMoveRatioX = 1;

		if (difY > 0)
			cameraMoveRatioY = -1;
		else if (difY == 0)
			cameraMoveRatioY = 0;
		else
			cameraMoveRatioY = 1;

		cameraLastPosition = cameraNextPosition;
		rotateCam = true;
	}
}


function showOrHideGridLine(){
	if (gridLineShowed){
		graphics.scene.remove(graphics.grid);
		gridLineShowed = false;
		var elem = document.getElementById('gridLine');
		elem.value = "show grid";

	}else{
		graphics.scene.add(graphics.grid);
		gridLineShowed = true;
		var elem = document.getElementById('gridLine');
		elem.value = "hide grid";
	}

}

function start(){
	onEnterFrame();
}

function pause(){
	if (onPause)
		onPause = false;
	else
		onPause = true;
}

function stop(){
	console.log('Try to stop!');
}

function onEnterFrame()
{
	requestAnimationFrame(onEnterFrame)
	var currentTick = Date.now();
	var dx = (currentTick - lastTick);

	// protection for jumping in time;
	if (dx > tickFps*2 || dx <= 0)
	{
		dx = tickFps;
	}

	//logic run in 30 fps; graphics - on max;
	if (dx >= tickFps){
		dx *= timeRatio;
		if(!onPause)
			update(dx); //update logic;

		lastTick = currentTick;
	}
	
	render();
	graphics.stats.update();
	
	
}

function render(){
	moveScene();
	//smoothlyRotateCamera();
	graphics.renderer.render(graphics.scene, graphics.camera);
}

function moveScene(){
	graphics.camera.position.x = -(targetMoveX * 0.35) / graphics.camera.zoom;
	graphics.camera.position.z = -(targetMoveY * 0.35) / graphics.camera.zoom;
	graphics.camera.lookAt(new THREE.Vector3(graphics.camera.position.x - 200, graphics.camera.position.y - 100, graphics.camera.position.z - 200));
}
/*
function smoothlyRotateCamera(){
	if (rotateCam){
		
		camera.position.x += cameraMoveRatioX * 25;
		camera.position.z += cameraMoveRatioY * 25;

		var camPosX = Math.floor(camera.position.x);
		var camPosZ = Math.floor(camera.position.z);
		var camNextPosX = cameraPosition[cameraNextPosition][0];
		var camNextPosY = cameraPosition[cameraNextPosition][1];
		//camera.lookAt(new THREE.Vector3(0, 0, 0));
		//camera.lookAt( scene );

		if(camPosX == camNextPosX && camPosZ == camNextPosY){
			camera.position.x = camNextPosX;
			camera.position.z = camNextPosY;
			rotateCam = false;
		}

	}
}
*/