var loops = 0;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 90, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var basicMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

var pivot = new THREE.Object3D();

var waveVertices = [];
emflogo.objects[0].vertices.forEach(function(vertex){
    var geometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
    var material = basicMaterial
    var cube = new THREE.Mesh( geometry, material );
    cube.position.x = vertex[0]*2;
    cube.position.y = vertex[1]*2;
    cube.position.z = vertex[2]*2;
    waveVertices.push(cube);
    pivot.add(cube);
});
pivot.rotateZ(Math.PI/4);
scene.add( pivot );

var ringVertices = [];
var pivotRing = new THREE.Object3D();
emflogo.objects[1].vertices.forEach(function(vertex){
    var geometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
    var material = basicMaterial
    var cube = new THREE.Mesh( geometry, material );
    cube.position.x = vertex[0]*4;
    cube.position.y = vertex[1]*4;
    cube.position.z = vertex[2]*4;
    ringVertices.push(cube);
    pivotRing.add(cube);
});
scene.add(pivotRing);

camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 35;
var cameraTarget = new THREE.Vector3( 0, 0, 0 );
camera.lookAt( cameraTarget );

var dirLight = new THREE.DirectionalLight( 0xffffff, 0.125 );
dirLight.position.set( 0, 0, 1 ).normalize();
scene.add( dirLight );
var pointLight = new THREE.PointLight( 0xffffff, 1.5 );
pointLight.position.set( 0, 100, 90 );
scene.add( pointLight );

var originalScale = ringVertices[0].position.x;

var scaleThings = function(scale) {
    ringVertices.forEach(function(vertex){
        vertex.position.x *= scale;
        vertex.position.y *= scale;
        vertex.position.z *= scale;
    });
    waveVertices.forEach(function(vertex){
        vertex.position.x *= scale;
        vertex.position.y *= scale;
        vertex.position.z *= scale;
    });
};


var animate = function () {
    requestAnimationFrame( animate );

    if(ringVertices[0].position.x <= originalScale){
        scaleThings(1.5);
    } else {
        scaleThings(0.97);
    }
    pivot.rotation.y -= 0.1;
    pivotRing.rotation.y += 0.05;

	var rot_base = Math.PI / 3;

	// Move individual letters down-left from corner-to-corner
	// Rotate and offset them as a function of their x coordinate
	for (var t = 0; t < textMeshes.length; t++) {
		var pos = textMeshes[t].position;
		textMeshes[t].position.x -= text_move_speed_x;

		// adds a bit of up-down boppiness, slightly unique to each letter
		var sin_add = Math.sin(pos.x / 16) * 1.4 * Math.sin(t + (loops * 0.1));

		textMeshes[t].position.y -= text_move_speed_y + sin_add;

		// Only rotate if the letters are on screen
		if (pos.x < 200) {
			var rot_angle = rot_base * (Math.sin(pos.x / 4 / (window.innerWidth)) * 0.25);
			textMeshes[t].rotateZ(rot_angle);
		}
	}

    renderer.render( scene, camera );
	loops++;
};

var text_all = "Oispa kaljaa, ihan vitusti, saatana kun ois niin vitusti kaljaa";
var texts = text_all.split("");

var textGeoms = [];
var textMeshes = [];

var text_move_speed_x = 3;
var text_move_speed_y = 2.7;
var curveSegments = 3;
var textSize = 18;
var bevelThickness = 0.1;
var bevelSize = 1;
var bevelSegments = 4;
var bevelEnabled = true;
var font = undefined;
var font_fname = "./fonts/optimer_regular.typeface.json";

var materials = [
	new THREE.MeshPhongMaterial( { color: 0x00ff00, flatShading: true } ), // front
	new THREE.MeshPhongMaterial( { color: 0x00aaa0 } ) // side
];

var textgroup = new THREE.Group();
scene.add( textgroup );
var text_spawn_x = 160;
var text_spawn_y = 0;
var text_spawn_z = -180;
var text_spawn_increment = 20;

var bg_plane_texture = undefined;
var bg_plane_mat = undefined;
var bg_plane_geom = undefined;
var bg_plane_mesh = undefined;

function loadData(on_done) {
	var createText = function() {

		for (var t = 0; t < texts.length; t++) {
			textGeoms[t] = new THREE.TextGeometry(texts[t], {
				font: font,
				size: textSize,
				curveSegments: curveSegments,
				bevelThickness: bevelThickness,
				bevelSize: bevelSize,
				bevelEnabled: bevelEnabled,
				amount: 3
			});

			textGeoms[t].computeBoundingBox();
			textGeoms[t].computeVertexNormals();

			textGeoms[t] = new THREE.BufferGeometry().fromGeometry( textGeoms[t] );
			textMeshes[t] = new THREE.Mesh( textGeoms[t], materials );
			textMeshes[t].position.x = text_spawn_x + (t * text_spawn_increment);
			textMeshes[t].position.y = text_spawn_y + (t * text_spawn_increment);
			textMeshes[t].position.z = text_spawn_z;
			textMeshes[t].rotation.x = 0;
			textMeshes[t].rotation.y = 0;
			textMeshes[t].rotation.y = 0;
			textgroup.add( textMeshes[t] );
		}

		on_done();
	};

	var fontloader = new THREE.FontLoader();

	fontloader.load(font_fname, function ( response ) {
		font = response;

		bg_plane_texture = new THREE.TextureLoader().load('img/nebula.png');
		bg_plane_mat = new THREE.MeshBasicMaterial( { map: bg_plane_texture } );
		bg_plane_geom = new THREE.PlaneBufferGeometry(1000, 1000, 8, 8);
		bg_plane_mesh = new THREE.Mesh(bg_plane_geom, bg_plane_mat);
		bg_plane_mesh.position.z = -200;
		scene.add(bg_plane_mesh);
		
		createText();
	});
}

loadData(animate);
