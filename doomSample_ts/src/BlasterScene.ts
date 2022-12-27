import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import Bullet from './Bullet'

export default class BlasterScene extends THREE.Scene
{
    private readonly mtlLoader = new MTLLoader()
    private readonly objLoader = new OBJLoader()
    private readonly camera : THREE.PerspectiveCamera
    private readonly keyDown = new Set<string>()

	private blaster?: THREE.Group
    private bulletMtl?: MTLLoader.MaterialCreator
	private directionVector = new THREE.Vector3()

    private bullets: Bullet[] = []
    private targets: THREE.Group[] = []

    constructor(_camera : THREE.PerspectiveCamera)
    {
        super()
        this.camera = _camera
    }

    async initalize()
    {
        // load model from public
		const targetMtl = await this.mtlLoader.loadAsync('assets/targetA.mtl')
		targetMtl.preload()

        // load bullet
        this.bulletMtl = await this.mtlLoader.loadAsync('assets/ammo_machinegun.mtl')
        this.bulletMtl.preload()

		// create the 4 targets
		const t1 = await this.CreateTarget(targetMtl)
		t1.position.x = -1
		t1.position.z = -3

		const t2 = await this.CreateTarget(targetMtl)
		t2.position.x = 1
		t2.position.z = -3

		const t3 = await this.CreateTarget(targetMtl)
		t3.position.x = 2
		t3.position.z = -3

		const t4 = await this.CreateTarget(targetMtl)
		t4.position.x = -2
		t4.position.z = -3

		this.add(t1, t2, t3, t4)
        this.targets.push(t1, t2, t3, t4)

        this.blaster = await this.CreateBlaster()
        this.add(this.blaster)
        this.blaster.position.z = 3
        this.blaster.add(this.camera)

        this.camera.position.z = 1
        this.camera.position.y = .5
        
        // light
        const light = new THREE.DirectionalLight(0xFFFFFF, 2)
        light.position.set(0, 4, 2)
        this.add(light)

        // keyboard 
        document.addEventListener('keydown', this.handleKeyDown)
        document.addEventListener('keyup', this.handleKeyUp)
    }

    private handleKeyDown = (event: KeyboardEvent) =>
    {
        this.keyDown.add(event.key.toLowerCase())
    }
    
    private handleKeyUp = (event: KeyboardEvent) =>
    {
        this.keyDown.delete(event.key.toLowerCase())

        if(event.key == ' ')
            this.CreateBullet()
    }

    private UpdateInput()
    {
        if(!this.blaster)
        {
            return
        }

        var shiftKey = this.keyDown.has('shift')
        if(!shiftKey)
        {
            if(this.keyDown.has('a') || this.keyDown.has('arrowleft'))
            {
                this.blaster.rotateY(.02)
            }
            else if(this.keyDown.has('d') || this.keyDown.has('arrowright'))
            {
                this.blaster.rotateY(-.02)
            }
        }
        var dir = this.directionVector
        this.camera.getWorldDirection(dir)

        const speed = .1
        if(this.keyDown.has('w') || this.keyDown.has('arrowup'))
        {
            this.blaster.position.add(dir.clone().multiplyScalar(speed))
        }
        else if(this.keyDown.has('s') || this.keyDown.has('arrowdown'))
        {
            this.blaster.position.add(dir.clone().multiplyScalar(-speed))
        }

        if(shiftKey)
        {
            const strafeDir = dir.clone()
            const upVector = new THREE.Vector3(0,1,0)
            if(this.keyDown.has('a') || this.keyDown.has('arrowleft'))
            {
                this.blaster.position.add(strafeDir.applyAxisAngle(upVector, Math.PI * .5).multiplyScalar(speed))
            }
            else if(this.keyDown.has('d') || this.keyDown.has('arrowright'))
            {
                this.blaster.position.add(strafeDir.applyAxisAngle(upVector, Math.PI * -.5).multiplyScalar(speed))
            }

        }
    }

    private async CreateBullet()
    {
        if(!this.blaster)
            return

        if(this.bulletMtl)
        {
            this.objLoader.setMaterials(this.bulletMtl)    
        }

        var bulletModel = await this.objLoader.loadAsync('assets/ammo_machinegun.obj')
        this.camera.getWorldDirection(this.directionVector)

        var aabb = new THREE.Box3().setFromObject(this.blaster)
        var size = aabb.getSize(new THREE.Vector3())
        var vec = this.blaster.position.clone()
        vec.y += .06
        bulletModel.position.add(vec.add(this.directionVector.clone().multiplyScalar(size.z * .5)))
        bulletModel.scale.set(10, 10, 10)

        bulletModel.children.forEach(child => child.rotateX(Math.PI * -.5))
        bulletModel.rotation.copy(this.blaster.rotation)

        this.add(bulletModel)

        console.log('CreateBullet')

        var b = new Bullet(bulletModel)
        b.setVelocity(
            this.directionVector.x * .02,
            this.directionVector.y * .02,
            this.directionVector.z * .02,
        )

        this.bullets.push(b)
    }

    private UpdateBullets()
    {
        for(let i = 0; i < this.bullets.length; ++i)
        {
            var b = this.bullets[i]
            b.update()

            if(b.shoudRemove)
            {
                this.remove(b.group)
                this.bullets.splice(i, 1)
                i--
            }
            else
            {
                for(let j =0; j<this.targets.length; j++)
                {
                        const target = this.targets[j]
                        if(target.position.distanceToSquared(b.group.position) < .05)
                        {
                            this.remove(b.group)
                            this.bullets.splice(i, 1)
                            i--

                            target.visible = false
                            setTimeout(() =>{
                                target.visible = true
                            }, 1000)
                        }
                }
            }
        }
    }

    private async CreateTarget(mtl: MTLLoader.MaterialCreator)
	{
		this.objLoader.setMaterials(mtl)

		const modelRoot = await this.objLoader.loadAsync('assets/targetA.obj')

		modelRoot.rotateY(Math.PI * 0.5)

		return modelRoot
	}


    private async CreateBlaster()
    {
        const mtl = await this.mtlLoader.loadAsync('assets/blasterG.mtl')
        mtl.preload()

        this.objLoader.setMaterials(mtl)

        const modelRoot = await this.objLoader.loadAsync('assets/blasterG.obj')
        return modelRoot
    }




    update()
    {
        this.UpdateInput()
        this.UpdateBullets()
    }
}