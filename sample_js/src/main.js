
import * as THREE from '../node_modules/three/build/three.module';
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls';
import Scene from './GameScene';

// Init
console.log("Main-start");

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// add camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 2, 10);
orbit.update();

// add scene
const myscene = new Scene(camera)
myscene.Initialize();

// loop
function animate(time) {
    renderer.render(myscene, camera);
}

renderer.setAnimationLoop(animate);
