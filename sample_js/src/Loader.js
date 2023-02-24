import * as THREE from '../node_modules/three/build/three.module';
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader';

let mixer;

export default class Loader extends THREE.Scene {

    // mixer = function (value) {
	// 	return value;
	// }

    constructor(path, callback, px, py, pz, size = 1) {
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

            console.log(gltf.animations.length)
            mixer = new THREE.AnimationMixer(root);
            mixer.clipAction(gltf.animations[0]).play();
        });
    }

    PlayAni(delta) {
        mixer?.update(delta);
    }
}