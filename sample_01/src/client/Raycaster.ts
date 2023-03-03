import THREE = require("three");
import GameScene from './GameScene';


export default class Raycaster {

    private gameScene : GameScene;
    private scene : THREE.Scene;
    private camera : THREE.Camera;
    private raycaster = new THREE.Raycaster();
    private pointer = new THREE.Vector2();

    constructor(camera: THREE.Camera, scene: THREE.Scene, game: GameScene) {
        
        this.gameScene = game;
        this.scene = scene;
        this.camera = camera;
        window.addEventListener('pointermove', (e) => {
            this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.pointer.y = - (e.clientY / window.innerHeight) * 2 + 1;
        });

    }

    Update() {
        this.raycaster.setFromCamera(this.pointer, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children);
    
        if (!this.gameScene.enableWirefame) {
            this.gameScene.ModelSetDefault();
            if (intersects.length > 0) {
                let mesh = intersects[0].object as THREE.Mesh;
                if (mesh.type != 'AxesHelper') {
                    mesh.material = this.gameScene.matHighlight;
                }
            }
        }
    }
}