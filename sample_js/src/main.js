
import * as THREE from 'three/build/three.module';
import {OrbitControls} from '../node_modules/three/examples/jsm/controls/OrbitControls';
import Scene from './Scene';
import Stats from 'stats.js';
import * as dat from 'dat.gui';

const clock = new THREE.Clock();
let booAnim = true;


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
myscene.background
myscene.Initialize();


// add stats
var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);


// add gui
const gui = new dat.GUI();
const options = {
    bgColor: 0xbfe3dd,
    playAni: true,
}
gui.addColor(options, 'bgColor').onChange((value) => {
    myscene.background = new THREE.Color(value)
})
gui.add(options, 'playAni').onChange(function (value) {
    booAnim = value;
});


// loop
function animate() {
    stats.begin();
    const delta = clock.getDelta();
    if(booAnim)
        myscene.Update(delta);
    renderer.render(myscene, camera);
    stats.end();
}

renderer.setAnimationLoop(animate);

