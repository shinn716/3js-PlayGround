import * as THREE from 'three/build/three.module';
import Obj from './Object';

export default class Scene extends THREE.Scene {

	constructor(camera) {
		super();
		this.camera = camera;
		console.log('GLTFLoader-constructor');
	}

	async Initialize() {
		console.log('GLTFLoader-initialize');

		// add light
		const ambientLight = new THREE.AmbientLight(0x666666);
		this.add(ambientLight);

		const light = new THREE.DirectionalLight(0xFFFFFF, 1)
		light.position.set(0, 4, 2)
		this.add(light)

		// add object
		// const boxGeometry = new THREE.BoxGeometry();
		// const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00FFFF });
		// const box = new THREE.Mesh(boxGeometry, boxMaterial);
		// this.add(box);

		// add gizmos
		const axesHelper = new THREE.AxesHelper(5);
		this.add(axesHelper);

		// add custom model
		this.myObj = new Obj('Parrot');
		this.add(this.myObj);
		this.myObj.SetPosAndRot(0, 0, 0, 0, 0, 0);
		this.myObj.SetScale(.1);
	}


	Update(delta) {
		this.myObj.Play(delta);
	}
}