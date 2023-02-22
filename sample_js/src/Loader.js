import * as THREE from '../node_modules/three/build/three.module';
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader';

export default class Loader extends THREE.Scene {

	constructor(path, callback, px, py, pz, size) {
        super();
		console.log('loader');
        this.LoadGLTF(path, callback, px, py, pz, size);
	}

    LoadGLTF(path, callback, px, py, pz, size) {
        console.log(path);
        const loader = new GLTFLoader();
        loader.load(path, function (gltf) {
            const root = gltf.scene;
            root.scale.set(size, size, size);
            root.position.set(px, py, pz);
            callback(root);
        })
    }
}