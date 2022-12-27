import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default class GameScene extends THREE.Scene
{
	private readonly camera: THREE.PerspectiveCamera
    private group = new THREE.Group()
    private rotSpeed: number = .00025

	constructor(camera: THREE.PerspectiveCamera)
	{
		super()
		this.camera = camera
	}
    
    async Initialize()
	{
        const loader = new GLTFLoader();
        loader.load('assets/2CylinderEngine.glb', (loader) =>{
            var obj = loader.scene
            var size = .005
            obj.position.z = 0
            obj.scale.set(size, size, size)
            this.group.add(obj)
            this.add(this.group)
        })


        // Light
        const ambientLight = new THREE.AmbientLight(0x666666);
        this.add(ambientLight);

        const light = new THREE.DirectionalLight(0xFFFFFF, 1)
		light.position.set(0, 4, 2)
        this.add(light)
    }

    Update()
	{
		// update
        this.group?.rotateY(Math.PI * this.rotSpeed)
	}
}



