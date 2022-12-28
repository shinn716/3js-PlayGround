import * as THREE from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default class GameScene extends THREE.Scene
{
	private readonly camera: THREE.PerspectiveCamera
    private obj = new THREE.Group
    private group = new THREE.Group
    private rotSpeed: number = .00025
    private mixer?: THREE.AnimationMixer
    private prevTime = Date.now()
    private animIndex: number = 0

    private clips = []
    private clipNames : string[] = []

	constructor(camera: THREE.PerspectiveCamera)
	{
		super()
		this.camera = camera
	}
    
    async Initialize()
	{
        // Light
        const ambientLight = new THREE.AmbientLight(0x666666);
        this.add(ambientLight);

        const light = new THREE.DirectionalLight(0xFFFFFF, 1)
		light.position.set(0, 4, 2)
        this.add(light)

        const lightHelper = new THREE.DirectionalLightHelper(light)
        this.add(lightHelper)
            
        const axesHelper = new THREE.AxesHelper(5); 
        this.group.add(axesHelper)
    }

    SetAnimationIndex(index: number){
        this.animIndex = index
    }

    SetModelSize(size: number)
    {
        this.group.scale.set(size, size, size)
    }

    LoadGLTF(path : string)
    {     
        this.animIndex = 0
        this.group.remove(this.obj)

        const loader = new GLTFLoader();
        loader.load(path, (loader) =>{
            this.obj = loader.scene

            var size = .01
            this.obj.position.z = 0
            this.obj.scale.set(size, size, size)
            this.group.add(this.obj)
            this.add(this.group)

            console.log(loader.animations.length)

            if(loader.animations.length==0)
                return

            console.log('==Animation clip list==')
            for(let i=0; i<loader.animations.length; i++){
                console.log(loader.animations[i].name)   
                this.clipNames[i] = loader.animations[i].name
            }

            this.mixer = new THREE.AnimationMixer(this.obj)
            this.mixer.clipAction(loader.animations[this.animIndex]).setDuration(1).play()
            this.clips = loader.animations
            
        })
    }

    PlayAnimate()
    {
        console.log("Play " + this.animIndex + " " + this.clipNames[this.animIndex])
        const clip = THREE.AnimationClip.findByName(this.clips, this.clipNames[this.animIndex] );
        const action = this.mixer?.clipAction( clip );
        action?.play();
    }

    // Test()
    // {
    //     console.log("hello")
    //     const loader = new GLTFLoader()
    //     loader.load('assets/Horse.glb', (gltf)=>{
    //         let mesh = gltf.scene.children[0]
    //         mesh.scale.set(.01, .01, .01)
    //         this.add(mesh)
    //         this.mixer = new THREE.AnimationMixer(mesh)
    //         this.mixer.clipAction(gltf.animations[0]).setDuration(1).play()
    //     })
    // }

    Update()
	{
		// update
        this.group?.rotateY(Math.PI * this.rotSpeed)

        // animation
        const time = Date.now();
        this.mixer?.update( ( time - this.prevTime ) * 0.001 );
        this.prevTime = time;
	}
}



