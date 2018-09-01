var loops = 0;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 90, window.innerWidth/window.innerHeight, 0.1, 1000 );
//camera.rotateZ(90);

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var basicMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

var pivot = new THREE.Object3D();

emflogo.objects[0].vertices.forEach(function(vertex){
    var geometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
    var material = basicMaterial
    var cube = new THREE.Mesh( geometry, material );
    cube.position.x = vertex[0]*2;
    cube.position.y = vertex[1]*2;
    cube.position.z = vertex[2]*2;
    pivot.add(cube);
});
pivot.rotateZ(Math.PI/4);
//pivot.position.x = -6;
scene.add( pivot );

var pivotRing = new THREE.Object3D();
emflogo.objects[1].vertices.forEach(function(vertex){
    var geometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
    var material = basicMaterial
    var cube = new THREE.Mesh( geometry, material );
    cube.position.x = vertex[0]*4;
    cube.position.y = vertex[1]*4;
    cube.position.z = vertex[2]*4;
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


var animate = function () {
    requestAnimationFrame( animate );

    pivot.rotation.y -= 0.1;
    pivotRing.rotation.z += 0.7;
    pivotRing.rotation.y += 0.05;

	for (var t = 0; t < textMeshes.length; t++) {
		textMeshes[t].position.y -= text_move_speed;
	}
	for (var t = 0; t < textMeshesMirror.length; t++) {
		textMeshesMirror[t].position.y += text_move_speed;
	}

    renderer.render( scene, camera );
	loops++;
};


var texts = [
	"oispa kaljaa",
	"ihan vitusti",
	"perkele kun ois kaljaa niin saatanasti"
];

var textGeoms = [];
var textMeshes = [];
var textMeshesMirror = [];

var text_move_speed = 0.25;
var curveSegments = 3;
var textSize = 10;
var bevelThickness = 0.1;
var bevelSize = 0.3;
var bevelSegments = 4;
var bevelEnabled = true;
var font = undefined;
var font_fname = "./fonts/optimer_regular.typeface.json";

var materials = [
	new THREE.MeshPhongMaterial( { color: 0x00ff00, flatShading: true } ), // front
	new THREE.MeshPhongMaterial( { color: 0x00aaa0 } ) // side
];

var mirror = false;
var textgroup = new THREE.Group();
scene.add( textgroup );
var text_spawn_x = 10;
var text_spawn_y = 10;
var text_spawn_z = -180;
var text_spawn_increment = 30;

function genText(on_done) {
	var loader = new THREE.FontLoader();

	var createText = function() {

		for (var t = 0; t < texts.length; t++) {
			textGeoms[t] = new THREE.TextGeometry(texts[t], {
				font: font,
				size: textSize,
				curveSegments: curveSegments,
				bevelThickness: bevelThickness,
				bevelSize: bevelSize,
				bevelEnabled: bevelEnabled
			});

			textGeoms[t].computeBoundingBox();
			textGeoms[t].computeVertexNormals();

			textGeoms[t] = new THREE.BufferGeometry().fromGeometry( textGeoms[t] );
			textMeshes[t] = new THREE.Mesh( textGeoms[t], materials );
			textMeshes[t].position.x = text_spawn_x;
			textMeshes[t].position.y = text_spawn_y + (t * text_spawn_increment);
			textMeshes[t].position.z = text_spawn_z;
			textMeshes[t].rotation.x = 0;
			textMeshes[t].rotation.y = Math.PI * 2;
			textgroup.add( textMeshes[t] );

			if ( mirror ) {
				textMeshesMirror[t] = new THREE.Mesh( textGeoms[t], materials );
				textMeshesMirror[t].position.x = text_spawn_x;
				textMeshesMirror[t].position.y = -text_spawn_y - (t * text_spawn_increment);
				textMeshesMirror[t].position.z = text_spawn_z;
				textMeshesMirror[t].rotation.x = Math.PI;
				textMeshesMirror[t].rotation.y = Math.PI * 2;
				textgroup.add( textMeshesMirror[t] );
			}
		}

		on_done();
	};

	loader.load(font_fname, function ( response ) {
		font = response;
		createText();
	});
}

genText(animate);
