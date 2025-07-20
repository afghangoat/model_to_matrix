"use strict";
let renderdist = 100;
let camera;
let scene;
let renderer;
let controls;
const gltfl = new THREE.GLTFLoader();
function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}
function contextmenu( event ) {
	event.preventDefault();
}
function onWindowResize() {
	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth,window.innerHeight);
}
let offsets=[-0,0,-0];
let gscale=0.01;
window.addEventListener('resize', onWindowResize, false);
function init(){
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,0.1,renderdist);
	renderer = new THREE.WebGLRenderer({ antialias: false});
	renderer.setSize(window.innerWidth,window.innerHeight);
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	document.body.appendChild(renderer.domElement);
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.toneMapping = THREE.CineonToneMapping;
    renderer.toneMappingExposure = 1.75;
	camera.position.set( 10, 0, 3 );
	const light = new THREE.DirectionalLight(0x000000);
	light.position.set(10, 15, 10);
	light.target.position.set(0, 0, 0);
	const envlight = new THREE.HemisphereLight( 0xf0f0f0, 0x000000, 0.3);
	scene.add(envlight);
	scene.add(light);
	gltfl.load(
	// resource URL
	'./models/lowpoly_concrete_barrier.glb',
	// called when the resource is loaded
	function ( gltf ) {
		gltf.scene.scale.set(gscale,gscale,gscale);
		gltf.scene.position.x+=offsets[0];
		gltf.scene.position.y+=offsets[1];
		gltf.scene.position.z+=offsets[2];
		scene.add( gltf.scene );
	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
	);
	const axesHelper = new THREE.AxesHelper( 1 );
	const gridHelper = new THREE.GridHelper( 10, 10 );
	scene.add( gridHelper );
	scene.add( axesHelper );
	animate();
}
function getVertices(object, vertices) {
    if (object instanceof THREE.Mesh) {
        // Check if the object is a mesh
        var geometry = object.geometry;
        if (geometry instanceof THREE.BufferGeometry) {
            // For BufferGeometry
            var indexAttribute = geometry.getIndex();
            var indices = indexAttribute.array;
            var positions = geometry.getAttribute('position').array;

            // Get the transformation matrix that takes into account scaling, rotation, and translation
            var matrixWorld = object.matrixWorld;

            for (var i = 0; i < indices.length; i += 3) {
                var face = [];
                for (var j = 0; j < 3; j++) {
                    var vertexIndex = indices[i + j];
                    var vertex = new THREE.Vector3(
                        positions[vertexIndex * 3],
                        positions[vertexIndex * 3 + 1],
                        positions[vertexIndex * 3 + 2]
                    );

                    // Apply the transformation matrix to the vertex to get it in world space
                    vertex.applyMatrix4(matrixWorld);

                    face.push(vertex);
                }
                vertices.push(face);
            }
        }
    }

    // Recursively traverse child objects
    if (object.children) {
        for (var i = 0; i < object.children.length; i++) {
            getVertices(object.children[i], vertices);
        }
    }

    return vertices;
}

// Call the function to get vertices from the entire scene
function cfp1(){
	let averts=getVertices(scene, []);
	for(let j=0;j<averts.length;j++){
		averts[j][0].x=parseFloat(averts[j][0].x.toFixed(3));
		averts[j][0].y=parseFloat(averts[j][0].y.toFixed(3));
		averts[j][0].z=parseFloat(averts[j][0].z.toFixed(3));
		averts[j][1].x=parseFloat(averts[j][1].x.toFixed(3));
		averts[j][1].y=parseFloat(averts[j][1].y.toFixed(3));
		averts[j][1].z=parseFloat(averts[j][1].z.toFixed(3));
		averts[j][2].x=parseFloat(averts[j][2].x.toFixed(3));
		averts[j][2].y=parseFloat(averts[j][2].y.toFixed(3));
		averts[j][2].z=parseFloat(averts[j][2].z.toFixed(3));
	}
	document.getElementById("seedw").innerHTML=JSON.stringify(averts);
}
function animate(){
	requestAnimationFrame(animate);
	controls.update();
	renderer.render(scene,camera);
}
function bufferText() {    
        const el = document.createElement("textarea");
        el.value = document.getElementById("seedw").innerHTML;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
  }
init();
document.getElementById("s1").addEventListener("click", cfp1);
document.getElementById("s2").addEventListener("click", bufferText);