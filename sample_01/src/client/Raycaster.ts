import THREE = require("three");
import GameScene from './GameScene';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';

export default class Raycaster {

    public Events = new THREE.EventDispatcher()

    private gameScene: GameScene;
    private scene: THREE.Scene;
    private camera: THREE.Camera;
    private raycaster = new THREE.Raycaster();
    private pointer = new THREE.Vector2();
    private outline: OutlinePass;

    constructor(_camera: THREE.Camera, _scene: THREE.Scene, _game: GameScene, _outline: OutlinePass) {

        this.gameScene = _game;
        this.scene = _scene;
        this.camera = _camera;
        this.outline = _outline;

        window.addEventListener('pointermove', (e) => {
            this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.pointer.y = - (e.clientY / window.innerHeight) * 2 + 1;
        });

        window.addEventListener('click', (e) => {

            if (!this.gameScene.enableHotspot)
                return;

            const mouse = new THREE.Vector2();
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, _camera);

            const intersects = raycaster.intersectObjects(_scene.children);
            if (intersects.length > 0) {

                // console.log(intersects[0].object.name);
                if (intersects[0].object.name == 'debug' || intersects[0].object.name == 'hotspot' || intersects[0].object.name == 'grid')
                    return;

                const eventData = {
                    customData: intersects[0].point
                };
                this.Events.dispatchEvent({ type: "customEvent", data: eventData });
            }
        });
    }


    Update() {

        if (!this.gameScene.enableSelecting)
            return;

        this.raycaster.setFromCamera(this.pointer, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children);

        if (!this.gameScene.enableWirefame) {
            this.gameScene.ModelSetDefault();
            if (intersects.length > 0) {
                let mesh = intersects[0].object as THREE.Mesh;

                if (mesh.type != 'AxesHelper' && mesh.name != 'hotspot' && mesh.name != 'debug' && mesh.name != 'grid') {
                    // console.log(mesh.name);

                    // material highlight 
                    // mesh.material = this.gameScene.matHighlight;

                    // postprocessing highlight
                    let selectedObjects: THREE.Object3D<THREE.Event>[] = [];
                    selectedObjects[0] = mesh;
                    this.outline.selectedObjects = selectedObjects;
                }
            }
            else{
                this.outline.selectedObjects = [];
            }
        }
    }
}