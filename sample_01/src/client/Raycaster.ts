import THREE = require("three");
import GameScene from './GameScene';


export default class Raycaster {

    private gameScene: GameScene;
    private scene: THREE.Scene;
    private camera: THREE.Camera;
    private raycaster = new THREE.Raycaster();
    private pointer = new THREE.Vector2();

    public Events = new THREE.EventDispatcher()

    constructor(camera: THREE.Camera, scene: THREE.Scene, game: GameScene) {

        this.gameScene = game;
        this.scene = scene;
        this.camera = camera;


        window.addEventListener('pointermove', (e) => {
            this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.pointer.y = - (e.clientY / window.innerHeight) * 2 + 1;
        });

        window.addEventListener('click', (e) => {
            const mouse = new THREE.Vector2();
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);

            const intersects = raycaster.intersectObjects(scene.children);
            if (intersects.length > 0) {
                const eventData = {
                    customData: intersects[0].point
                };
                this.Events.dispatchEvent({ type: "customEvent", data: eventData });
            }
        });
    }


    Update() {
        this.raycaster.setFromCamera(this.pointer, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children);

        if (!this.gameScene.enableWirefame) {
            this.gameScene.ModelSetDefault();
            if (intersects.length > 0) {
                let mesh = intersects[0].object as THREE.Mesh;

                if (mesh.type != 'AxesHelper' && mesh.name !='hotspot') {
                    // console.log(mesh.name);
                    mesh.material = this.gameScene.matHighlight;
                }
            }
        }
    }
}