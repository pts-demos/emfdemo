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

camera.position.x = 2;
camera.position.y = 1;
camera.position.z = 25;

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

    renderer.render( scene, camera );
};

animate();