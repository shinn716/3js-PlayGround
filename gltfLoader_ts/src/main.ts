import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Scene from './GameScene'

const width = window.innerWidth
const height = window.innerHeight

// webgl init
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('app') as HTMLCanvasElement
})
renderer.setSize(width, height)

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
scene.Initialize()

// debug
console.log('threejs version: ' + THREE.REVISION);

// loop
function Loop()
{
  scene.Update()
  renderer.render(scene, mainCamera)
  requestAnimationFrame(Loop)
}

Loop()
