import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Status from 'stats.js'
import * as dat from 'dat.gui'
import Scene from './GameScene'

const width = window.innerWidth
const height = window.innerHeight

// webgl init
const renderer = new THREE.WebGLRenderer({
    antialias:true,
    canvas: document.getElementById('app') as HTMLCanvasElement
})
renderer.setSize(width, height)
renderer.setPixelRatio(window.devicePixelRatio)

// camera
const mainCamera = new THREE.PerspectiveCamera( 
                                                60,                   // fov 
                                                width / height,       // aspect ratio
                                                .1,                   // near plane
                                                100                   // far plane
                                                )

const orbit = new OrbitControls(mainCamera, renderer.domElement)

mainCamera.position.set(0, 2, 5)
orbit.update();


// scene
const scene = new Scene(mainCamera)
scene.background = new THREE.Color(0xbfe3dd)
scene.Initialize()

// debug
console.log('threejs version: ' + THREE.REVISION);

// fps counter
var stats = new Status()
stats.showPanel(1)
document.body.appendChild( stats.dom );

// GUI
const gui = new dat.GUI();
const options = {
  backgroundColor: 0xbfe3dd,
  size: 1,
  model: 'Fox.glb',
  animationIndex: 0,
  play: () => {scene.PlayAnimate()}
}
gui.addColor(options, 'backgroundColor').onChange((value)=>{
  scene.background = new THREE.Color(value)
})

gui.add(options, 'size', .1, 5).onChange((value)=>{
  scene.SetModelSize(value)
})

// Create dropdowns by passing an array or object of named values
gui.add( options, 'model', {  'Fox' : 'Fox.glb', 'Horse'  : 'Horse.glb', '2CylinderEngine': '2CylinderEngine.glb', 'Buggy': 'Buggy.glb'} ).onChange((value)=>{
  scene.LoadGLTF('assets/' + options.model)
  console.log(options.model)
})

gui.add(options, 'animationIndex').onChange((value)=>{
  scene.SetAnimationIndex(value)
})

gui.add(options, 'play');

// Init load first model
scene.LoadGLTF('assets/Fox.glb')

Loop()

// loop
function Loop()
{
  stats.begin();
  scene.Update()
  renderer.render(scene, mainCamera)
	stats.end();
  requestAnimationFrame(Loop)
}




