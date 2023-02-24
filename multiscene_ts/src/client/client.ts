import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const scene1 = new THREE.Scene()
scene1.background = new THREE.Color(0x323200)

const scene2 = new THREE.Scene()
scene2.background = new THREE.Color(0x003232)

const camera1 = new THREE.PerspectiveCamera(
    75,
    1,
    0.1,
    1000
)
camera1.position.z = 3

const camera2 = new THREE.OrthographicCamera(-2,2,2,-2)
camera2.position.z = 2


const canvas1 = document.getElementById("c1") as HTMLCanvasElement
const canvas2 = document.getElementById("c2") as HTMLCanvasElement
const renderer1 = new THREE.WebGLRenderer({canvas:canvas1})
renderer1.setSize(200, 200)
const renderer2 = new THREE.WebGLRenderer({canvas:canvas2})
renderer2.setSize(200, 200)


new OrbitControls(camera1, renderer1.domElement)
new OrbitControls(camera2, renderer2.domElement)

const geometry1 = new THREE.TorusGeometry()
const geometry2 = new THREE.TorusKnotGeometry()
const material = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    wireframe: true,
})

const cube1 = new THREE.Mesh(geometry1, material)
scene1.add(cube1)

const cube2 = new THREE.Mesh(geometry2, material)
scene2.add(cube2)


// resize canvas
// window.addEventListener('resize', onWindowResize, false)
// function onWindowResize() {
//     camera.aspect = window.innerWidth / window.innerHeight
//     camera.updateProjectionMatrix()
//     renderer.setSize(window.innerWidth, window.innerHeight)
//     render()
// }

console.dir(scene1)

function animate() {
    requestAnimationFrame(animate)

    cube1.rotation.x += 0.01
    cube1.rotation.y += 0.01

    cube2.rotation.x += 0.01
    cube2.rotation.y += 0.01

    render()
}

function render() {
    renderer1.render(scene1, camera1)
    renderer2.render(scene2, camera2)
}

animate()