var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
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
    cube.position.x = vertex[0]*3;
    cube.position.y = vertex[1]*3;
    cube.position.z = vertex[2]*3;
    pivotRing.add(cube);
});
scene.add(pivotRing);

camera.position.x = 2;
camera.position.y = 1;
camera.position.z = 30;

var animate = function () {
    requestAnimationFrame( animate );

    pivot.rotation.y -= 0.1;
    pivotRing.rotation.y += 0.05;

    renderer.render( scene, camera );
};

animate();