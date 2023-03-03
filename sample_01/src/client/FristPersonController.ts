
import * as THREE from 'three'

export default class FristPersonController {

    public dragSpeed: number = .1;
    public moveSpeed: number = .05;

    private camera: THREE.Camera;
    private isClick: boolean = false;
    private rotation: THREE.Euler = new THREE.Euler(0, 0, 0);
    private keyState: boolean[] = [false, false, false, false];

    constructor(_camera: THREE.Camera) {
        this.camera = _camera;
    }

    MouseEventInit() {
        
        document.addEventListener('mousedown', (e) => {
            this.isClick = true;
        });
        document.addEventListener('mouseup', (e) => {
            this.isClick = false;
        });
        document.addEventListener('mousemove', (e) => {

            if (this.isClick) {

                const movementX = e.movementX;
                const movementY = e.movementY;

                this.rotation.y += -movementX * Math.PI / 180 * this.dragSpeed;
                this.rotation.x += -movementY * Math.PI / 180 * this.dragSpeed;

                const euler = new THREE.Euler(0, 0, 0, 'YXZ');
                euler.x = this.rotation.x;
                euler.y = this.rotation.y;
                this.camera.quaternion.setFromEuler(euler);
                // this.camera.rotation.x = Math.min(Math.max(this.camera.rotation.x, -1.0472), 1.0472);
            }
        });
    }

    KeyboardEventInit() {
        
        document.addEventListener('keydown', (e) => {
            if (e.key == 'w')
                this.keyState[0] = true;
            if (e.key == 'a')
                this.keyState[1] = true;
            if (e.key == 's')
                this.keyState[2] = true;
            if (e.key == 'd')
                this.keyState[3] = true;
        }, true);

        document.addEventListener('keyup', (e) => {
            if (e.key == 'w')
                this.keyState[0] = false;
            if (e.key == 'a')
                this.keyState[1] = false;
            if (e.key == 's')
                this.keyState[2] = false;
            if (e.key == 'd')
                this.keyState[3] = false;
        }, true);
    }

    KeyboardEventUpdate() {

        if (this.keyState[0])
            this.camera.translateZ(-this.moveSpeed);

        if (this.keyState[1])
            this.camera.translateX(-this.moveSpeed);

        if (this.keyState[2])
            this.camera.translateZ(this.moveSpeed);

        if (this.keyState[3])
            this.camera.translateX(this.moveSpeed);
    }
}