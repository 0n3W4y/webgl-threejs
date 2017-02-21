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
