var Graphics = (function () {
    function Graphics(tileSize) {
        this.tileSize = tileSize;
        this.init();
    }
    Graphics.prototype.init = function () {
        //primary DOM element;
        this.container = document.getElementById('canvas');
        //scene
        this.scene = new THREE.Scene();
        //camera
        this.camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -5000, 10000); //-500, 1000
        this.camera.position.set(200, 100, 200);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        //renderer
        if (Detector.webgl) {
            this.renderer = new THREE.WebGLRenderer({ antialias: false });
        }
        else {
            this.renderer = new THREE.CanvasRenderer();
            this.renderer.setPixelRatio(window.devicePixelRatio);
        }
        this.renderer.setClearColor(0x999999);
        this.renderer.setSize(window.innerWidth - 10, window.innerHeight - 10);
        this.renderer.sortObjects = false;
        //this.renderer.shadowMapEnabled = true;
        this.container.appendChild(this.renderer.domElement);
        this.stats = new Stats();
        this.container.appendChild(this.stats.dom);
    };
    Graphics.prototype.showHideGrid = function (visibility) {
        if (visibility == "Show")
            this.scene.add(this.grid);
        else
            this.scene.remove(this.grid);
    };
    Graphics.prototype.createGraphics = function (mapWidth, mapHeight, gridArray) {
        this.createGraphicGridLines(mapWidth, mapHeight);
        this.createLight();
        this.firstGroundLayer = this.createGroundLayerGraphics('images/atlas_ground.png', mapWidth, mapHeight, gridArray);
        this.scene.add(this.firstGroundLayer);
        this.secondGroundLayer = this.createSecondGroundLayerGraphics('images/atlas_ground_2.png', mapWidth, mapHeight, gridArray);
        this.scene.add(this.secondGroundLayer);
    };
    Graphics.prototype.createSecondGroundLayerGraphics = function (tex, mapWidth, mapHeight, gridArray) {
        var treeTileSize = this.tileSize / 2; // 64
        var treesInPoint = Math.round(Math.sqrt(treeTileSize)); //8
        var stepTree = Math.floor(this.tileSize / Math.sqrt(treesInPoint));
        var loader = new THREE.TextureLoader();
        var texture = loader.load(tex);
        var material = new THREE.MeshPhongMaterial({ color: 0xffffff, map: texture, shininess: 0, transparent: true, opacity: 1 });
        var trees = new Array();
        var mountains = new Array();
        //trees
        trees.push([new THREE.Vector2(0, .75), new THREE.Vector2(.125, .75), new THREE.Vector2(.125, .875), new THREE.Vector2(0, .875)]);
        trees.push([new THREE.Vector2(.125, .75), new THREE.Vector2(.25, .75), new THREE.Vector2(.25, .875), new THREE.Vector2(.125, .875)]);
        trees.push([new THREE.Vector2(.25, .75), new THREE.Vector2(.375, .75), new THREE.Vector2(.375, .875), new THREE.Vector2(.25, .875)]);
        trees.push([new THREE.Vector2(.375, .75), new THREE.Vector2(.5, .75), new THREE.Vector2(.5, .875), new THREE.Vector2(.375, .875)]);
        trees.push([new THREE.Vector2(.5, .75), new THREE.Vector2(.625, .75), new THREE.Vector2(.625, .875), new THREE.Vector2(.5, .875)]);
        trees.push([new THREE.Vector2(.625, .75), new THREE.Vector2(.75, .75), new THREE.Vector2(.75, .875), new THREE.Vector2(.625, .875)]);
        trees.push([new THREE.Vector2(0, .625), new THREE.Vector2(.125, .625), new THREE.Vector2(.125, .75), new THREE.Vector2(0, .75)]);
        trees.push([new THREE.Vector2(.125, .625), new THREE.Vector2(.25, .625), new THREE.Vector2(.25, .75), new THREE.Vector2(.125, .75)]);
        trees.push([new THREE.Vector2(.25, .625), new THREE.Vector2(.375, .625), new THREE.Vector2(.375, .75), new THREE.Vector2(.25, .75)]);
        trees.push([new THREE.Vector2(.375, .625), new THREE.Vector2(.5, .625), new THREE.Vector2(.5, .75), new THREE.Vector2(.375, .75)]);
        //mountains
        mountains.push([new THREE.Vector2(0, .5), new THREE.Vector2(.125, .5), new THREE.Vector2(.125, .625), new THREE.Vector2(0, .625)]);
        mountains.push([new THREE.Vector2(.125, .5), new THREE.Vector2(.25, .5), new THREE.Vector2(.25, .625), new THREE.Vector2(.125, .625)]);
        mountains.push([new THREE.Vector2(.25, .5), new THREE.Vector2(.375, .5), new THREE.Vector2(.375, .625), new THREE.Vector2(.25, .625)]);
        mountains.push([new THREE.Vector2(.375, .5), new THREE.Vector2(.5, .5), new THREE.Vector2(.5, .625), new THREE.Vector2(.375, .625)]);
        mountains.push([new THREE.Vector2(.5, .5), new THREE.Vector2(.625, .5), new THREE.Vector2(.625, .625), new THREE.Vector2(.5, .625)]);
        mountains.push([new THREE.Vector2(.625, .5), new THREE.Vector2(.75, .5), new THREE.Vector2(.75, .625), new THREE.Vector2(.625, .625)]);
        mountains.push([new THREE.Vector2(.75, .5), new THREE.Vector2(.875, .5), new THREE.Vector2(.875, .625), new THREE.Vector2(.75, .625)]);
        mountains.push([new THREE.Vector2(0, .375), new THREE.Vector2(.125, .375), new THREE.Vector2(.125, .5), new THREE.Vector2(0, .5)]);
        mountains.push([new THREE.Vector2(.125, .375), new THREE.Vector2(.25, .375), new THREE.Vector2(.25, .5), new THREE.Vector2(.125, .5)]);
        mountains.push([new THREE.Vector2(.25, .375), new THREE.Vector2(.375, .375), new THREE.Vector2(.375, .5), new THREE.Vector2(.25, .5)]);
        mountains.push([new THREE.Vector2(.375, .375), new THREE.Vector2(.5, .375), new THREE.Vector2(.5, .5), new THREE.Vector2(.375, .5)]);
        mountains.push([new THREE.Vector2(.5, .375), new THREE.Vector2(.625, .375), new THREE.Vector2(.625, .5), new THREE.Vector2(.5, .5)]);
        mountains.push([new THREE.Vector2(.625, .375), new THREE.Vector2(.75, .375), new THREE.Vector2(.75, .5), new THREE.Vector2(.625, .5)]);
        mountains.push([new THREE.Vector2(.75, .5), new THREE.Vector2(.875, .5), new THREE.Vector2(.875, .625), new THREE.Vector2(.75, .625)]);
        mountains.push([new THREE.Vector2(0, .25), new THREE.Vector2(.125, .25), new THREE.Vector2(.125, .375), new THREE.Vector2(0, .375)]);
        mountains.push([new THREE.Vector2(.125, .25), new THREE.Vector2(.25, .25), new THREE.Vector2(.25, .375), new THREE.Vector2(.125, .375)]);
        mountains.push([new THREE.Vector2(.25, .25), new THREE.Vector2(.375, .25), new THREE.Vector2(.375, .375), new THREE.Vector2(.25, .375)]);
        mountains.push([new THREE.Vector2(.375, .25), new THREE.Vector2(.5, .25), new THREE.Vector2(.5, .375), new THREE.Vector2(.375, .375)]);
        mountains.push([new THREE.Vector2(.5, .25), new THREE.Vector2(.625, .25), new THREE.Vector2(.625, .375), new THREE.Vector2(.5, .375)]);
        mountains.push([new THREE.Vector2(.625, .25), new THREE.Vector2(.75, .25), new THREE.Vector2(.75, .375), new THREE.Vector2(.625, .375)]);
        mountains.push([new THREE.Vector2(.75, .25), new THREE.Vector2(.875, .25), new THREE.Vector2(.875, .375), new THREE.Vector2(.75, .375)]);
        //city
        var city = [new THREE.Vector2(0, .875), new THREE.Vector2(.125, .875), new THREE.Vector2(.125, 1), new THREE.Vector2(0, 1)];
        var meshArray = new Array();
        var sizeWithStepHeight = (this.tileSize * mapHeight) / 2;
        var sizeWithStepWidth = (this.tileSize * mapWidth) / 2;
        var y = -sizeWithStepHeight;
        for (var i = 0; i < mapHeight; i++) {
            var x = -sizeWithStepWidth;
            for (var j = 0; j < mapWidth; j++) {
                var pointId = i * mapHeight + j;
                var point = gridArray[pointId];
                var mesh;
                if (point.coverType == 7) {
                    //create forest ( trees );
                    for (var k = -treeTileSize; k <= treeTileSize; k += stepTree) {
                        for (var l = -treeTileSize; l <= treeTileSize; l += stepTree) {
                            var num = Math.random();
                            if (num <= 0.5) {
                                //create tree;
                                var rnum = Math.floor(Math.random() * (trees.length));
                                var newTreeGeometry = trees[rnum];
                                var planeGeometry = new THREE.PlaneGeometry(this.tileSize / 2, this.tileSize / 2, 1);
                                planeGeometry.faceVertexUvs[0] = [];
                                planeGeometry.faceVertexUvs[0][0] = [newTreeGeometry[0], newTreeGeometry[1], newTreeGeometry[3]];
                                planeGeometry.faceVertexUvs[0][1] = [newTreeGeometry[1], newTreeGeometry[2], newTreeGeometry[3]];
                                mesh = new THREE.Mesh(planeGeometry, material);
                                mesh.rotateY(0.7584);
                                mesh.rotateZ(1.5708);
                                mesh.position.set(x + k - 4, treeTileSize / 2, y + l - 4);
                                meshArray.push(mesh);
                            }
                        }
                    }
                }
                else if (point.coverType == 8) {
                    //create rocks
                    var rnum = Math.floor(Math.random() * (mountains.length));
                    var newRockGeometry = mountains[rnum];
                    var planeGeometry = new THREE.PlaneGeometry(this.tileSize, this.tileSize, 1);
                    planeGeometry.faceVertexUvs[0] = [];
                    planeGeometry.faceVertexUvs[0][0] = [newRockGeometry[0], newRockGeometry[1], newRockGeometry[3]];
                    planeGeometry.faceVertexUvs[0][1] = [newRockGeometry[1], newRockGeometry[2], newRockGeometry[3]];
                    mesh = new THREE.Mesh(planeGeometry, material);
                    mesh.rotateY(0.7584);
                    mesh.rotateZ(1.5708);
                    mesh.position.set(x + this.tileSize / 2, this.tileSize / 2, y + this.tileSize / 2);
                    meshArray.push(mesh);
                }
                else if (point.coverType == 9) {
                    //create city
                    var planeGeometry = new THREE.PlaneGeometry(this.tileSize, this.tileSize, 1);
                    planeGeometry.faceVertexUvs[0] = [];
                    planeGeometry.faceVertexUvs[0][0] = [city[0], city[1], city[3]];
                    planeGeometry.faceVertexUvs[0][1] = [city[1], city[2], city[3]];
                    mesh = new THREE.Mesh(planeGeometry, material);
                    mesh.rotateY(0.7584);
                    mesh.rotateZ(1.5708);
                    mesh.position.set(x + this.tileSize / 2, this.tileSize / 2, y + this.tileSize / 2);
                    meshArray.push(mesh);
                }
                x += this.tileSize;
            }
            y += this.tileSize;
        }
        var geometry = this.megreMeshes(meshArray);
        var newMesh = new THREE.Mesh(geometry, material);
        //newMesh.castShadow = true;
        return newMesh;
    };
    Graphics.prototype.createGroundLayerGraphics = function (newTexture, gridSizeHeight, gridSizeWidth, gridArray) {
        var solidArray = new Array();
        var liquidArray = new Array();
        var planeGeometry; //ground tile;
        var textureLoader = new THREE.TextureLoader();
        var tex = textureLoader.load(newTexture);
        var solidMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, map: tex, shininess: 0 });
        var liquidMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, map: tex, shininess: 25 });
        var sand = [new THREE.Vector2(.01, .76), new THREE.Vector2(.24, .76), new THREE.Vector2(.24, .99), new THREE.Vector2(.01, .99)];
        var road = [new THREE.Vector2(.26, .76), new THREE.Vector2(.49, .76), new THREE.Vector2(.49, .99), new THREE.Vector2(.26, .99)];
        var rock = [new THREE.Vector2(.51, .76), new THREE.Vector2(.74, .76), new THREE.Vector2(.74, .99), new THREE.Vector2(.51, .99)];
        var lava = [new THREE.Vector2(.76, .76), new THREE.Vector2(.99, .76), new THREE.Vector2(.99, .99), new THREE.Vector2(.76, .99)];
        var earth = [new THREE.Vector2(.01, .51), new THREE.Vector2(.24, .51), new THREE.Vector2(.24, .74), new THREE.Vector2(.01, .74)];
        var water = [new THREE.Vector2(.26, .51), new THREE.Vector2(.49, .51), new THREE.Vector2(.49, .74), new THREE.Vector2(.26, .74)];
        var swamp = [new THREE.Vector2(.51, .51), new THREE.Vector2(.74, .51), new THREE.Vector2(.74, .74), new THREE.Vector2(.51, .74)];
        var oil = [new THREE.Vector2(.76, .51), new THREE.Vector2(.99, .51), new THREE.Vector2(.99, .74), new THREE.Vector2(.76, .74)];
        var city = [new THREE.Vector2(.01, .26), new THREE.Vector2(.24, .26), new THREE.Vector2(.24, .49), new THREE.Vector2(.01, .49)];
        var forest = [new THREE.Vector2(.26, .26), new THREE.Vector2(.49, .26), new THREE.Vector2(.49, .49), new THREE.Vector2(.26, .49)];
        var mesh;
        var sizeWithStepHeight = (this.tileSize * gridSizeHeight) / 2;
        var sizeWithStepWidth = (this.tileSize * gridSizeWidth) / 2;
        var y = -sizeWithStepHeight;
        // 0 - free ; 1 - water; 2 - lava; 3 - swamp; 4 - earth; 5 - sand; 6 - road; 7 - forest; 8 - rocks; 9 - city;
        for (var i = 0; i < gridSizeHeight; i++) {
            var x = -sizeWithStepWidth;
            for (var j = 0; j < gridSizeWidth; j++) {
                var pointId = i * gridSizeHeight + j;
                var point = gridArray[pointId];
                planeGeometry = new THREE.PlaneGeometry(this.tileSize, this.tileSize, 1);
                if (point.coverType == 0) {
                    //create free; now it's oil;
                    planeGeometry.faceVertexUvs[0] = [];
                    planeGeometry.faceVertexUvs[0][0] = [oil[0], oil[1], oil[3]];
                    planeGeometry.faceVertexUvs[0][1] = [oil[1], oil[2], oil[3]];
                    mesh = new THREE.Mesh(planeGeometry, liquidMaterial);
                    mesh.rotateX(-1.5708);
                    mesh.position.set(x, 0, y);
                    liquidArray.push(mesh);
                }
                else if (point.coverType == 1) {
                    //create water;
                    planeGeometry.faceVertexUvs[0] = [];
                    planeGeometry.faceVertexUvs[0][0] = [water[0], water[1], water[3]];
                    planeGeometry.faceVertexUvs[0][1] = [water[1], water[2], water[3]];
                    mesh = new THREE.Mesh(planeGeometry, liquidMaterial);
                    mesh.rotateX(-1.5708);
                    mesh.position.set(x, 0, y);
                    liquidArray.push(mesh);
                }
                else if (point.coverType == 2) {
                    //create lava;
                    planeGeometry.faceVertexUvs[0] = [];
                    planeGeometry.faceVertexUvs[0][0] = [lava[0], lava[1], lava[3]];
                    planeGeometry.faceVertexUvs[0][1] = [lava[1], lava[2], lava[3]];
                    mesh = new THREE.Mesh(planeGeometry, solidMaterial);
                    mesh.rotateX(-1.5708);
                    mesh.position.set(x, 0, y);
                    solidArray.push(mesh);
                }
                else if (point.coverType == 3) {
                    //create swamp;
                    planeGeometry.faceVertexUvs[0] = [];
                    planeGeometry.faceVertexUvs[0][0] = [swamp[0], swamp[1], swamp[3]];
                    planeGeometry.faceVertexUvs[0][1] = [swamp[1], swamp[2], swamp[3]];
                    mesh = new THREE.Mesh(planeGeometry, solidMaterial);
                    mesh.rotateX(-1.5708);
                    mesh.position.set(x, 0, y);
                    solidArray.push(mesh);
                }
                else if (point.coverType == 4) {
                    //create earth;
                    planeGeometry.faceVertexUvs[0] = [];
                    planeGeometry.faceVertexUvs[0][0] = [earth[0], earth[1], earth[3]];
                    planeGeometry.faceVertexUvs[0][1] = [earth[1], earth[2], earth[3]];
                    mesh = new THREE.Mesh(planeGeometry, solidMaterial);
                    mesh.rotateX(-1.5708);
                    mesh.position.set(x, 0, y);
                    solidArray.push(mesh);
                }
                else if (point.coverType == 5) {
                    //create sand;
                    planeGeometry.faceVertexUvs[0] = [];
                    planeGeometry.faceVertexUvs[0][0] = [sand[0], sand[1], sand[3]];
                    planeGeometry.faceVertexUvs[0][1] = [sand[1], sand[2], sand[3]];
                    mesh = new THREE.Mesh(planeGeometry, solidMaterial);
                    mesh.rotateX(-1.5708);
                    mesh.position.set(x, 0, y);
                    solidArray.push(mesh);
                }
                else if (point.coverType == 6) {
                    //create road;
                    planeGeometry.faceVertexUvs[0] = [];
                    planeGeometry.faceVertexUvs[0][0] = [road[0], road[1], road[3]];
                    planeGeometry.faceVertexUvs[0][1] = [road[1], road[2], road[3]];
                    mesh = new THREE.Mesh(planeGeometry, solidMaterial);
                    mesh.rotateX(-1.5708);
                    mesh.position.set(x, 0, y);
                    solidArray.push(mesh);
                }
                else if (point.coverType == 7) {
                    //create forest
                    planeGeometry.faceVertexUvs[0] = [];
                    planeGeometry.faceVertexUvs[0][0] = [forest[0], forest[1], forest[3]];
                    planeGeometry.faceVertexUvs[0][1] = [forest[1], forest[2], forest[3]];
                    mesh = new THREE.Mesh(planeGeometry, solidMaterial);
                    mesh.rotateX(-1.5708);
                    mesh.position.set(x, 0, y);
                    solidArray.push(mesh);
                }
                else if (point.coverType == 8) {
                    //create rock
                    planeGeometry.faceVertexUvs[0] = [];
                    planeGeometry.faceVertexUvs[0][0] = [rock[0], rock[1], rock[3]];
                    planeGeometry.faceVertexUvs[0][1] = [rock[1], rock[2], rock[3]];
                    mesh = new THREE.Mesh(planeGeometry, solidMaterial);
                    mesh.rotateX(-1.5708);
                    mesh.position.set(x, 0, y);
                    solidArray.push(mesh);
                }
                else if (point.coverType == 9) {
                    //create city;
                    planeGeometry.faceVertexUvs[0] = [];
                    planeGeometry.faceVertexUvs[0][0] = [city[0], city[1], city[3]];
                    planeGeometry.faceVertexUvs[0][1] = [city[1], city[2], city[3]];
                    mesh = new THREE.Mesh(planeGeometry, solidMaterial);
                    mesh.rotateX(-1.5708);
                    mesh.position.set(x, 0, y);
                    solidArray.push(mesh);
                }
                x += this.tileSize;
            }
            y += this.tileSize;
        }
        //merge meshes to 1 global mesh;
        var solidGeometry = this.megreMeshes(solidArray);
        var liquidGeometry = this.megreMeshes(liquidArray);
        var solidMesh = new THREE.Mesh(solidGeometry, solidMaterial);
        //earthMesh.receiveShadow = true;
        var liquidMesh = new THREE.Mesh(liquidGeometry, liquidMaterial);
        var group = new THREE.Group();
        group.add(solidMesh);
        group.add(liquidMesh);
        return group;
    };
    Graphics.prototype.createLight = function () {
        //ambientLight;
        //var ambientLight = new THREE.AmbientLight( 0x404040 );
        //scene.add( ambientLight );
        this.hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffdf, 0.6);
        this.hemiLight.position.set(0, 500, 0);
        this.scene.add(this.hemiLight);
        //direction light;
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        this.directionalLight.position.set(0, 0.75, 0).normalize();
        this.scene.add(this.directionalLight);
        //var targetObject = new THREE.Object3D();
        //scene.add(targetObject);
        //directionalLight.target = targetObject;
        //spot light
        this.spotLight = new THREE.SpotLight(0xfffffd, 0.25, 0, 1.05, 1, 1); //color, intensity, distance, angle, penumbra, decay
        this.spotLight.position.set(10000, 10000, 10000);
        //spotLight.castShadow = true;
        //spotLight.shadow.mapSize.width = 1024;
        //spotLight.shadow.mapSize.height = 1024;
        //spotLight.shadow.camera.near = 500;
        //spotLight.shadow.camera.far = 4000;
        //spotLight.shadow.camera.fov = 30;
        this.scene.add(this.spotLight);
    };
    // Grid
    Graphics.prototype.createGraphicGridLines = function (gridSizeHeight, gridSizeWidth) {
        var geometry = new THREE.Geometry();
        var sizeWithStepHeight = (this.tileSize * gridSizeHeight) / 2;
        var sizeWithStepWidth = (this.tileSize * gridSizeWidth) / 2;
        for (var y = -sizeWithStepHeight; y <= sizeWithStepHeight; y += this.tileSize) {
            for (var x = -sizeWithStepWidth; x <= sizeWithStepWidth; x += this.tileSize) {
                geometry.vertices.push(new THREE.Vector3(x, 0, -y));
                geometry.vertices.push(new THREE.Vector3(x, 0, y));
                geometry.vertices.push(new THREE.Vector3(-y, 0, x));
                geometry.vertices.push(new THREE.Vector3(y, 0, x));
            }
        }
        var material = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.2 });
        this.grid = new THREE.LineSegments(geometry, material);
        this.grid.position.x -= this.tileSize / 2;
        this.grid.position.z -= this.tileSize / 2;
        this.scene.add(this.grid);
    };
    Graphics.prototype.megreMeshes = function (arrayOfMeshes) {
        var geometry = new THREE.Geometry();
        for (var i = 0; i < arrayOfMeshes.length; i++) {
            arrayOfMeshes[i].updateMatrix();
            geometry.merge(arrayOfMeshes[i].geometry, arrayOfMeshes[i].matrix);
        }
        return geometry;
    };
    return Graphics;
}());
var GridPoint = (function () {
    function GridPoint(id, point, cover, effect, speed, newIndex, coords) {
        this.gridId = id;
        this.pointType = point;
        this.coverType = cover;
        this.effectType = effect;
        this.movementRatio = speed;
        this.graphicIndex = newIndex;
        this.gridCoords = coords;
    }
    return GridPoint;
}());
var GroundMap = (function () {
    function GroundMap(width, height) {
        this.width = width;
        this.height = height;
        this.size = width * height;
        this.logicGrid = new Array();
        this.cityCoordinatesArray = new Array();
    }
    GroundMap.prototype.generateBiomMap = function (primaryGroundBiom, params) {
        // генерируем все параметры в определенном порядке
        var obj = { "Earth": [], "Sand": [], "Forest": [], "Water": [], "Lava": [], "Swamp": [], "Rocks": [], "River": [], "City": [] };
        this.fillLogicGrid(primaryGroundBiom);
        for (var key in params) {
            if (!(obj[key] === undefined))
                obj[key] = params[key];
        }
        for (var prop in obj) {
            var params = obj[prop];
            if (params.length > 0)
                this.generateGroundMapObjects(prop, params);
        }
    };
    GroundMap.prototype.fillLogicGrid = function (type) {
        var coverType;
        var pointType;
        var movementRatio;
        if (type == "Earth") {
            coverType = 4;
            pointType = 1;
            movementRatio = 0.8;
        }
        else if (type == "Sand") {
            coverType = 5;
            pointType = 1;
            movementRatio = 0.6;
        }
        else if (type == "Water") {
        }
        else if (type == "Lava") {
        }
        else if (type == "Oil") {
        }
        else {
            //default earth
            coverType = 4;
            pointType = 1;
            movementRatio = 0.8;
        }
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var gridId = y * this.height + x;
                var coords = new GridCoordinates(x, y);
                var newGridPoint = new GridPoint(gridId, pointType, coverType, 0, movementRatio, 0, coords); //earth;
                this.logicGrid.push(newGridPoint);
            }
        }
    };
    GroundMap.prototype.generateCities = function (args) {
        var cityType = args[0];
        var cityAmount = args[1] || Math.min(Math.round(this.width / 5), Math.round(this.height / 5)); // default;
        var safeZone = args[2] || 2; //default;
        var minRadius = args[3] || Math.round((this.width + this.height) / (2 * cityAmount)); //default
        var temporaryArrayForCheckCoords = new Array();
        for (var i = 0; i < cityAmount; i++) {
            var pointX = Math.floor(Math.random() * (this.width - safeZone * 2) + safeZone);
            var pointY = Math.floor(Math.random() * (this.height - safeZone * 2) + safeZone);
            var check = true;
            //проверяем, есть ли по близости город, в пределах минимального радиуса.
            for (var j = 0; j < temporaryArrayForCheckCoords.length; j++) {
                var cityX = temporaryArrayForCheckCoords[j].x;
                var cityY = temporaryArrayForCheckCoords[j].y;
                var difX = Math.abs(cityX - pointX);
                var difY = Math.abs(cityY - pointY);
                var coordDif = Math.round(Math.sqrt(difX * difX + difY * difY));
                if (coordDif <= minRadius)
                    check = false;
            }
            if (check) {
                var newCoords = new GridCoordinates(pointX, pointY);
                temporaryArrayForCheckCoords.push(newCoords);
                var gridId = pointY * this.height + pointX;
                this.logicGrid[gridId].coverType = 9;
                this.logicGrid[gridId].pointType = 2;
                this.logicGrid[gridId].movementRatio = 1;
            }
            else {
                i--;
            }
        }
        this.cityCoordinatesArray = temporaryArrayForCheckCoords;
    };
    //angular -  будет ли река поворачивать на 90 градусов ( true; false); type - 0 - simple river, 1 - river with lake, 2 - river with solid;
    GroundMap.prototype.generateRiver = function (args) {
        var type = args[0];
        var liquidType = args[1] || 0; //simple river default;
        var liquidAngulatChanse = args[2] || false; // no chanse on default;
        var liquidWidth = args[3] || Math.round(this.width * 0.05); //max 5%;
        var liquidOffset = args[4] || 1; //max 1;
        var liquidStep = args[5] || 1; //max 1;
        var liquidMaxWidth = args[6] || (liquidWidth + 5); // max +5;
        var liquidMinWidth = args[7] || 2; // 0 - river can be underground;
        var pointType;
        var coverType;
        var movementRatio;
        if (type == "Water") {
            coverType = 1;
            movementRatio = 0.4;
            pointType = 0;
        }
        else if (type == "Lava") {
            coverType = 2;
            movementRatio = 0;
            pointType = 0;
        }
        else if (type == "Oil") {
            coverType = 0;
            movementRatio = 0.2;
            pointType = 0;
        }
        var startingPointY = Math.floor(Math.random() * (this.height / 2 + 1)); // max start on half of grid on Y;
        var startingPointX = Math.floor(Math.random() * (this.width - liquidWidth + 1));
        var liquidHeight;
        if (liquidType == 0) {
            startingPointY = 0;
            liquidHeight = this.height;
        }
        var liquidCurrentWidth = liquidWidth;
        var nextPointX = startingPointX;
        // no angular, no lakes and solids, right now only simple RiverL
        for (var j = 0; j < liquidHeight; j++) {
            if (j != 0) {
                var liquidCurrentStep = Math.floor(Math.random() * (liquidStep * 2 + 1) - liquidStep);
                var liquidDirectionOffset = Math.floor(Math.random() * (liquidOffset * 2 + 1) - liquidOffset); // -1 left, 0 - center, +1 - right;
                liquidCurrentWidth = liquidCurrentWidth + liquidCurrentStep;
                nextPointX += liquidDirectionOffset;
                if (liquidCurrentWidth > liquidMaxWidth)
                    liquidCurrentWidth = liquidMaxWidth;
                else if (liquidCurrentWidth < liquidMinWidth)
                    liquidCurrentWidth = liquidMinWidth;
                else if (liquidCurrentWidth == 1)
                    nextPointX -= liquidDirectionOffset;
            }
            for (var k = 0; k < liquidCurrentWidth; k++) {
                var gridIndex = (startingPointY + j) * this.height + (nextPointX + k);
                //проверяем, принадлежит ли наш индекс строке Y, на которой мы хотим разместить часть объекта;
                if (gridIndex >= (startingPointY + j) * this.height && gridIndex < (startingPointY + j + 1) * this.height) {
                    var point = this.logicGrid[gridIndex];
                    point.pointType = pointType; // water
                    point.movementRatio = movementRatio;
                    point.coverType = coverType; // water;
                }
            }
        }
    };
    // generating with WIDTH, so height is static; 
    //offset - есть ли смещение влево или вправо и на сколько, step - на сколько сильно может уменьшаться или увеличиваться объект с каждой последующей Y  координатой;
    GroundMap.prototype.generateGroundMapObjects = function (type, args) {
        if (type == "River") {
            this.generateRiver(args);
            return;
        }
        else if (type == "City") {
            this.generateCities(args);
            return;
        }
        var pointType;
        var movementRatio;
        var coverType;
        if (type == "Water") {
            pointType = 0;
            movementRatio = 0.4;
            coverType = 1;
        }
        else if (type == "Rocks") {
            pointType = 2;
            movementRatio = 0.2;
            coverType = 8;
        }
        else if (type == "Forest") {
            pointType = 2;
            movementRatio = 0.7;
            coverType = 7;
        }
        else if (type == "Swamp") {
            pointType = 1;
            movementRatio = 0.5;
            coverType = 3;
        }
        else if (type == "Earth") {
            pointType = 1;
            movementRatio = 0.8;
            coverType = 4;
        }
        else if (type == "Sand") {
            pointType = 1;
            movementRatio = 0.5;
            coverType = 5;
        }
        else if (type == "Lava") {
            pointType = 0;
            movementRatio = 0;
            coverType = 2;
        }
        else if (type == "Oil") {
            pointType = 0;
            movementRatio = 0;
            coverType = 0;
        }
        var liquidAmount = args[0] || 1; // max 1
        var liquidWidth = args[1] || Math.round(this.width / 10); // max 10%
        var liquidHeight = args[2] || Math.round(this.height / 10); // max 10%
        var liquidOffset = args[3] || 1; //max 1;
        var liquidStep = args[4] || 1; //max 1;
        var liquidMaxWidth = args[5] || (liquidWidth + 5); // max +5;
        var liquidMinWidth = 1; //default;
        for (var i = 0; i < liquidAmount; i++) {
            // для того, что бы вписать объект, что бы он не выходил за границы, сделаю стартовые точки с учетом длинны и ширины объекта.
            var startingPointY = Math.floor(Math.random() * (this.height - liquidHeight + 1));
            var startingPointX = Math.floor(Math.random() * (this.width - liquidWidth + 1));
            var liquidCurrentWidth = liquidWidth;
            var nextPointX = startingPointX;
            for (var j = 0; j < liquidHeight; j++) {
                if (j != 0) {
                    var liquidCurrentStep = Math.floor(Math.random() * (liquidStep * 2 + 1) - liquidStep);
                    var liquidDirectionOffset = Math.floor(Math.random() * (liquidOffset * 2 + 1) - liquidOffset); // -1 left, 0 - center, +1 - right;
                    liquidCurrentWidth = liquidCurrentWidth + liquidCurrentStep;
                    nextPointX = nextPointX + liquidDirectionOffset;
                    if (liquidCurrentWidth > liquidMaxWidth)
                        liquidCurrentWidth = liquidMaxWidth;
                    else if (liquidCurrentWidth == 1)
                        nextPointX -= liquidDirectionOffset;
                }
                for (var k = 0; k < liquidCurrentWidth; k++) {
                    var gridIndex = (startingPointY + j) * this.height + (nextPointX + k);
                    //проверяем, принадлежит ли наш индекс строке Y, на которой мы хотим разместить часть объекта;
                    if (gridIndex >= (startingPointY + j) * this.height && gridIndex < (startingPointY + j + 1) * this.height) {
                        var point = this.logicGrid[gridIndex];
                        point.pointType = pointType;
                        point.movementRatio = movementRatio;
                        point.coverType = coverType;
                    }
                }
            }
        }
    };
    //amount - количество дорог идущих от 1 города ( максимум );
    GroundMap.prototype.generateRoadFromCityToCity = function (amount) {
        var roadAmount = amount || 2; //2 max;
        var distanceArray = null;
        for (var j = 0; j < this.cityCoordinatesArray.length; j++) {
            var city = this.cityCoordinatesArray[j];
            distanceArray = this.calculateDistanceFromCity(city);
            if (distanceArray != null) {
                for (var i = 0; i < roadAmount; i++) {
                    this.createRoadFromCityToCity(city, distanceArray);
                }
            }
        }
    };
    GroundMap.prototype.createRoadFromCityToCity = function (city, citiesArray) {
        var newCity = null;
        var newCityPosition = null;
        var newCityName = null;
        var currentCity = city.getComponent('City');
        var currentCityName = city.getComponent('Name').surname;
        var currentCityPosition = city.getComponent('GridPosition').position;
        for (var k = 0; k < citiesArray.length; k++) {
            var tempCityName = citiesArray[k].getComponent('Name').surname;
            var tempCity = citiesArray[k].getComponent('City');
            if (tempCityName != currentCityName && !tempCity.checkRoadToCity(currentCityName)) {
                newCity = tempCity;
                newCityPosition = citiesArray[k].getComponent('GridPosition').position;
                newCityName = citiesArray[k].getComponent('Name').surname;
                if (k > 0) {
                    var previousCityName = citiesArray[k - 1].getComponent('Name').surname;
                    if (!tempCity.checkRoadToCity(previousCityName))
                        break;
                }
            }
        }
        if (newCity == null)
            return;
        var pointX = currentCityPosition.x;
        var pointY = currentCityPosition.y;
        var toPointX = newCityPosition.x;
        var toPointY = newCityPosition.y;
        var nextPointX = pointX;
        var nextPointY = pointY;
        while (true) {
            var difX = nextPointX - toPointX;
            var difY = nextPointY - toPointY;
            var directionX = 0;
            var directionY = 0;
            if (difX < 0)
                directionX = 1;
            else if (difX > 0)
                directionX = -1;
            if (difY < 0)
                directionY = 1;
            else if (difY > 0)
                directionY = -1;
            if (Math.abs(difX) > Math.abs(difY)) {
                if (difX != 0) {
                    nextPointX += directionX;
                    var gridIndex = nextPointY * this.height + nextPointX;
                    var point = this.logicGrid[gridIndex];
                    if (point.coverType != 9) {
                        point.pointType = 1; // flat tile;
                        point.coverType = 6; // road
                        point.movementRatio = 1; // normal
                    }
                }
            }
            else {
                if (difY != 0) {
                    nextPointY += directionY;
                    var gridIndex = nextPointY * this.height + nextPointX;
                    var point = this.logicGrid[gridIndex];
                    if (point.coverType != 9) {
                        point.pointType = 1; // flat tile;
                        point.coverType = 6; // road
                        point.movementRatio = 1; // normal
                    }
                }
            }
            //exit from endless loop;
            if (difX == 0 && difY == 0) {
                currentCity.roadAmount++;
                currentCity.addRoadToCity(newCityName);
                newCity.roadAmount++;
                newCity.addRoadToCity(currentCityName);
                break;
            }
        }
    };
    GroundMap.prototype.calculateDistanceFromCity = function (city) {
        var dsArray = new Array();
        var temporary = new Array();
        var result = new Array();
        var pointX = city.getComponent("GridPosition").position.x;
        var pointY = city.getComponent("GridPosition").position.y;
        //собираем информацию о дистанции до города со всех городов.
        for (var i = 0; i < this.cityCoordinatesArray.length; i++) {
            var newCity = this.cityCoordinatesArray[i];
            var newCityName = newCity.getComponent('Name').surname;
            //
            var newPointX = newCity.getComponent("GridPosition").position.x;
            var newPointY = newCity.getComponent("GridPosition").position.y;
            var difX = Math.abs(pointX - newPointX);
            var difY = Math.abs(pointX - newPointX);
            var dif = Math.round(Math.sqrt(difX * difX + difY * difY));
            dsArray.push(dif); // пушим дистанцию
        }
        temporary = dsArray.slice(); // copy;
        temporary.sort(function (a, b) { return a - b; }); // сортируем.
        //делаем отправной массив с ссылками на города. но в порядке от самых ближайших городов до самых дальних.
        for (var j = 0; j < dsArray.length; j++) {
            var searchNum = temporary[j];
            var index = dsArray.indexOf(searchNum);
            result.push(this.cityCoordinatesArray[index]);
        }
        return result;
    };
    GroundMap.prototype.createCityEntities = function (entityRoot, namesArray) {
        for (var i = 0; i < this.cityCoordinatesArray.length; i++) {
            var coordinates = this.cityCoordinatesArray[i];
            var newCity = entityRoot.createEntity("City");
            var component = newCity.createComponent("City");
            newCity.addComponent(component);
            component = newCity.createComponent("Name");
            component.init(namesArray[0], namesArray[1]);
            component.generateSurname();
            newCity.addComponent(component);
            component = newCity.createComponent("GridPosition");
            component.changePosition(coordinates.x, coordinates.y);
            component.gridId = this.height * coordinates.y + coordinates.x;
            newCity.addComponent(component);
            //заменяем внутри массива значение с простыми координатами на ссылку, полученную в результате создания Entity. Это необходмо для работы функции прокладки дороги.
            this.cityCoordinatesArray[i] = newCity;
        }
    };
    return GroundMap;
}());
