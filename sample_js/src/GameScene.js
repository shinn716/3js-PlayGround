import * as THREE from '../node_modules/three/build/three.module';
// import { GLTFLoader } from '../../node_modules/three/examples/jsm/loaders/GLTFLoader';
// import Cube from './Cube';
import MyLoader from './Loader';


// import model1 from '../models/Buggy.glb'
// import model2 from '../models/Industrial_L1_bake.glb'
// import model3 from '../models/showroom.glb'
// import model3 from '../models/Parrot.glb'


export default class GameScene extends THREE.Scene {

	constructor(camera) {
		super()
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

		// add model
		new MyLoader('https://sgmsavirtualbooth.blob.core.windows.net/test/gltf/Parrot.glb', (result) => {
			this.add(result);
		}, 0, 0, 0, .1);

		// this.LoadGLTF(model2, (result) => {
		// 	this.add(result);
		// }, 0, 0, 0, 1);

		// add custom model
		// const myCube = new Cube('cube');
		// this.add(myCube);
		// myCube.SetTransform(1, 0, 0, 0, 30, 0, 2);
	}

	// LoadGLTF(path, callback, px, py, pz, size) {
	// 	const loader = new GLTFLoader();
	// 	loader.load(path, function (gltf) {
	// 		const root = gltf.scene;
	// 		root.scale.set(size, size, size);
	// 		root.position.set(px, py, pz);
	// 		callback(root);
	// 	})
	// }
}