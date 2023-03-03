import * as THREE from 'three'
import { AxesHelper } from 'three';
import { GUI } from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default class GameScene {

	private group = new THREE.Group;
	private scene: THREE.Scene;
	private debug: HTMLDivElement;

	private matWireframe: THREE.Material;
	private matStandard: THREE.Material[] = [];
	private meshUuid: string[] = [];

	public enableWirefame: boolean = false;
	public matHighlight: THREE.Material;

	constructor(_scene: THREE.Scene, _debug: HTMLDivElement) {
		console.log('scene awake');
		this.scene = _scene;
		this.debug = _debug;

		this.matHighlight = new THREE.MeshBasicMaterial({
			color: 0xa21a2f1,
			transparent: true,
			opacity: 0.5,
		});

		this.matWireframe = new THREE.MeshBasicMaterial({
			color: 0x00ff00,
			wireframe: true,
		});
	}

	init() {
		console.log('scene init');

		// const geometry = new THREE.BoxGeometry()
		// const material = new THREE.MeshBasicMaterial({
		// 	color: 0x00ff00,
		// 	wireframe: true,
		// })

		// const cube = new THREE.Mesh(geometry, material)
		// this.group.add(cube);
		// this.scene.add(this.group)
		// this.group.add(new AxesHelper(5));

		// add light
		const ambientLight = new THREE.AmbientLight(0x404040, 1);
		this.scene.add(ambientLight);

		const light = new THREE.DirectionalLight(0xFFFFFF, 1)
		light.position.set(0, 4, 2)
		this.scene.add(light)

		const hemilight = new THREE.HemisphereLight(0x000000, 0xffffff, 1);
		this.scene.add(hemilight);

		// model https://sgmsavirtualbooth.blob.core.windows.net/test/Scenario_M1_bake.glb
		this.loadModel(
			'https://sgmsavirtualbooth.blob.core.winwwdows.net/test/showroom.glb',
			// 'https://sgmsavirtualbooth.blob.core.windows.net/test/threejs_test_models/gltf/Scenario_M1.glb',
			// 'https://sgmsavirtualbooth.blob.core.windows.net/test/threejs_test_models/gltf/Scenario_M1_nolight.glb',
			(result: THREE.Object3D<THREE.Event>) => {
				this.group.add(result);
			});

		this.scene.add(this.group);
		this.group.add(new AxesHelper(10));

	}



	loadModel(path: string, callback: { (result: THREE.Object3D<THREE.Event>): void; (arg0: THREE.Group): void; }) {
		console.log('loadModel')

		var loader = new GLTFLoader();
		loader.load(path, (gltf) => {

			let c = gltf.scene.children;
			for (var i = 0; i < c.length; i++) {
				if (c[i].type == 'DirectionalLight')
					c[i].visible = false;
			}

			let Model = gltf.scene;
			Model.traverse((node) => {

				let object = node as THREE.Mesh;
				for (const child of object.children) {
					let mesh = child as THREE.Mesh;

					if (mesh.material) {
						this.meshUuid.push(child.uuid);
						this.matStandard.push(mesh.material as THREE.Material);
					}
				}
			});

			callback(Model);
		}, (e) => {
			let percentComplete = e.loaded / e.total * 100;
			console.log(Math.round(percentComplete) + ' %');
		});
	}


	drawGUI() {

		const gui = new GUI()
		const cubeRotFolder = gui.addFolder('Rotation')
		cubeRotFolder.add(this.group.rotation, 'x', 0, Math.PI * 2)
		cubeRotFolder.add(this.group.rotation, 'y', 0, Math.PI * 2)
		cubeRotFolder.add(this.group.rotation, 'z', 0, Math.PI * 2)
		cubeRotFolder.close();

		const cubePosFolder = gui.addFolder('Position');
		cubePosFolder.add(this.group.position, 'x', -10, 10)
		cubePosFolder.add(this.group.position, 'y', -10, 10)
		cubePosFolder.add(this.group.position, 'z', -10, 10)
		cubePosFolder.close()

		const options = {
			wireframe: false,
		}

		gui.add(options, 'wireframe').onChange((e) => {
			this.enableWirefame = e as boolean;
			if (e as boolean) {
				this.ModelSetWireframe();
			}
			else {
				this.ModelSetDefault();
			}
		});
	}

	ModelSetWireframe() {
		this.group.traverse((node) => {
			if (node.type == 'Mesh') {
				let mesh = node as THREE.Mesh;
				mesh.material = this.matWireframe;
			}
		});
	}

	ModelSetDefault() {
		this.group.traverse((node) => {
			let object = node as THREE.Mesh;
			for (const child of object.children) {
				let mesh = child as THREE.Mesh;
				if (mesh.material) {
					for (let i = 0; i < this.meshUuid.length; i++) {
						if (mesh.uuid == this.meshUuid[i]) {
							mesh.material = this.matStandard[i];
						}
					}
				}
			}
		});
	}

	Update() {
		this.debug.innerText =
			'Local Pos X : ' +
			this.group.position.x.toFixed(2) +
			'\n' +
			'Local Pos Y : ' +
			this.group.position.y.toFixed(2) +
			'\n' +
			'Local Pos Z : ' +
			this.group.position.z.toFixed(2) +
			'\n' +
			'Local Rot X : ' +
			this.group.rotation.x.toFixed(2) +
			'\n' +
			'Local Rot Y : ' +
			this.group.rotation.y.toFixed(2) +
			'\n' +
			'Local Rot Z : ' +
			this.group.rotation.z.toFixed(2) +
			'\n'
	}
}

