import * as THREE from 'three'
import { AxesHelper } from 'three';

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

// game scene
const debug = document.getElementById('debug1') as HTMLDivElement;
const game = new GameScene(scene, debug);
game.init();
game.drawGUI();

// fristPersonController
const controller = new FristPersonController(camera);
controller.MouseEventInit();
controller.KeyboardEventInit();

// raycaster
const raycaster = new Raycaster(camera, scene, game);
raycaster.Events.addEventListener("customEvent", event => {
    // console.log("Click pos:", event.data.customData);

    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: .75,
    })

    let tgroup = new THREE.Group;
    const cube = new THREE.Mesh(geometry, material)
    cube.name = 'hotspot';

    let pos = event.data.customData as THREE.Vector3
    tgroup.position.set(pos.x, pos.y, pos.z);
    tgroup.scale.set(.1, .1, .1);

    tgroup.add(cube);
    scene.add(tgroup)
    tgroup.add(new AxesHelper(3));
});

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


