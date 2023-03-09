import * as THREE from 'three'
import { AxesHelper } from 'three';

// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import Raycaster from './Raycaster';
import GameScene from './GameScene';
import Stats from 'three/examples/jsm/libs/stats.module'
import FristPersonController from './FristPersonController';
import FileLoader from './FileLoader';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';

console.log('threejs version: ' + THREE.REVISION);

let composer: EffectComposer, outlinePass: OutlinePass;

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xbbbbbb);
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.z = 11
camera.position.y = 1.7

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// const orbitControls = new OrbitControls(camera, renderer.domElement)
// orbitControls.addEventListener('change', render);

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    composer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const stats = Stats()
document.body.appendChild(stats.dom);

// game scene
const debug = document.getElementById('debug1') as HTMLDivElement;
const game = new GameScene(scene, debug);
game.init();
game.DrawGUI();

// fristPersonController
const controller = new FristPersonController(camera);
controller.MouseEventInit();
controller.KeyboardEventInit();

// Outline
// implementation - outline
// https://zhuanlan.zhihu.com/p/462329055
composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
composer.addPass(outlinePass);

outlinePass.edgeStrength = 5;
outlinePass.visibleEdgeColor = new THREE.Color(0x0570fe);
outlinePass.hiddenEdgeColor = new THREE.Color(0x0570fe);
outlinePass.usePatternTexture = true;

const outlineTexLoader = new THREE.TextureLoader();
outlineTexLoader.load('../../imgs/tri_pattern.jpg', function (texture) {

    outlinePass.patternTexture = texture;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

});


// raycaster
const raycaster = new Raycaster(camera, scene, game, outlinePass);
raycaster.Events.addEventListener("customEvent", event => {
    // console.log("Click pos:", event.data.customData);

    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: .75,
    });

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

const cubeGeometry = new THREE.BoxGeometry()
const cubeMaterial = new THREE.MeshBasicMaterial();
const textureLoader = new THREE.TextureLoader().load('../../imgs/grid.png');
cubeMaterial.map = textureLoader;

// file loader
const fileLoader = new FileLoader();

const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
cube.position.y = 7;
cube.name = 'debug';
scene.add(cube);

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
    renderer.render(scene, camera);
    composer.render();
}

animate()


