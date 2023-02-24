import * as THREE from 'three/build/three.module';
import MyLoader from './Loader';

// let loader;
// let booGizmos = false;

export default class Object extends THREE.Scene {

	booGizmos = function (value) {
		return value;
	}

	loader = function (value) {
		return value;
	}



	constructor(name, gizmos) {
		super();
		console.log("add: " + name);
		this.myname = name;
		this.booGizmos = gizmos;
		this.Render();
	}

	GetName() {
		return this.myname;
	}


	Render() {
		console.log("render: " + this.myname);
		// const boxGeometry = new THREE.BoxGeometry();
		// const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00FFFF });
		// const box = new THREE.Mesh(boxGeometry, boxMaterial);
		// this.add(box);


		this.loader = new MyLoader('https://sgmsavirtualbooth.blob.core.windows.net/test/gltf/Parrot.glb',
			(result) => {
				this.add(result);
			},
			0, 0, 0);

		// console.log(this.loader);

		if (!this.booGizmos)
			return;
		const axesHelper = new THREE.AxesHelper(50);
		this.add(axesHelper);
	}

	SetPosAndRot(px, py, pz, rx, ry, rz) {
		const root = this;
		root.position.set(px, py, pz);
		root.rotation.set(rx, ry, rz);
	}

	SetScale(size) {
		const root = this;
		root.scale.set(size, size, size);
	}

	Play(delta) {
		this.loader.PlayAni(delta);
	}
}