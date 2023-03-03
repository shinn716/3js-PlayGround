import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import Raycaster from './Raycaster';
import GameScene from './GameScene';
import Stats from 'three/examples/jsm/libs/stats.module'
import FristPersonController from './FristPersonController';

console.log('threejs version: ' + THREE.REVISION);

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.z = 11
camera.position.y = 1.7

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// const orbitControls = new OrbitControls(camera, renderer.domElement)
// orbitControls.addEventListener('change', render);

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const stats = Stats()
document.body.appendChild(stats.dom);


const debug = document.getElementById('debug1') as HTMLDivElement;
const game = new GameScene(scene, debug);
game.init();
game.drawGUI();

const controller = new FristPersonController(camera);
controller.MouseEventInit();
controller.KeyboardEventInit();

const raycaster = new Raycaster(camera, scene, game);

console.log(scene.children);

function animate() {
    requestAnimationFrame(animate)

    controller.KeyboardEventUpdate();
    game.Update();
    stats.update();
    render()
}

function render() {

    raycaster.Update();
    renderer.render(scene, camera)
}

animate()


