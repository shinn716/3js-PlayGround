// https://www.youtube.com/watch?v=p4BHphMBlFA

import * as THREE from 'three'
import BlasterScene from './BlasterScene'

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

// scene
const scene = new BlasterScene(mainCamera)
scene.initalize()

// debug
console.log('threejs version: ' + THREE.REVISION);

// loop
function Loop()
{
  scene.update()
  renderer.render(scene, mainCamera)
  requestAnimationFrame(Loop)
}

Loop()
