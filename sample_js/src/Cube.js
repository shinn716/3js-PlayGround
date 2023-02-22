import * as THREE from '../../node_modules/three/build/three.module';

export default class Cube extends THREE.Scene {

	constructor(name) {
		super();
		console.log('clone:' + name);

		this.Render();
	}

	Render() {
		console.log("add cube");
		const boxGeometry = new THREE.BoxGeometry();
		const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00FFFF });
		const box = new THREE.Mesh(boxGeometry, boxMaterial);
		this.add(box);
	}

	SetTransform(px, py, pz, rx, ry, rz, size) {
		const root = this;
		root.scale.set(size, size, size);
		root.position.set(px, py, pz);
		root.rotation.set(rx, ry, rz);
	}
}