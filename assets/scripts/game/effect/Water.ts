import { _decorator, Component, Node, Vec4, Vec3, director, ModelComponent, CameraComponent, systemEvent, SystemEvent, Touch, geometry, Vec2, Input, input, EventTouch, Camera, Material, MeshRenderer, PhysicsSystem } from "cc";
const { ccclass, property } = _decorator;

@ccclass('Water')
export class Water extends Component {
    @property(Camera)
    camera_3d: Camera = null

    private _ray: geometry.Ray = new geometry.Ray();
    private _meshRenderer: MeshRenderer = null;
    private _temp_v4: Vec4 = new Vec4();
    private _temp_v3: Vec3 = new Vec3();
    private _count = 0;

    start() {
        this._meshRenderer = this.node.getComponent(MeshRenderer);
        input.on(Input.EventType.TOUCH_END, this.onTouchStart, this)
    }

    private playWaterEffect() {
        const pass = this._meshRenderer?.material?.passes[0];
        pass.setUniform(pass.getHandle(`center${this._count++ % 10}`), this._temp_v4);
        // this.model_plane.material.setProperty(`center${this._count++ % 10}`, this._temp_v4);
    }

    private onTouchStart(event: EventTouch) {
        this.camera_3d.screenPointToRay(event.getLocationX(), event.getLocationY(), this._ray)
        //基于模型的射线检测
        let ray = this.camera_3d.screenPointToRay(event.getLocationX(), event.getLocationY())
    
        if (PhysicsSystem.instance.raycastClosest(ray)) {
            const res = PhysicsSystem.instance.raycastClosestResult
            const hitNode = res.collider.node
            console.log('hitNode, res', res, hitNode)
            if (hitNode.name.startsWith('Plane')) {
                console.log('击中Plane')
                console.log('this._meshRenderer', res.distance, this._meshRenderer)
                this._temp_v3.set(this._ray.o);
                this._temp_v3 = this._temp_v3.add(this._ray.d.clone().multiplyScalar(res.distance));
                const minPosition = hitNode.worldPosition.clone().add(this._meshRenderer?.mesh?.struct?.minPosition);
                const maxPosition = hitNode.worldPosition.clone().add(this._meshRenderer?.mesh?.struct?.maxPosition);
                this._temp_v4.set((this._temp_v3.x - minPosition.x) / (maxPosition.x - minPosition.x), (this._temp_v3.z - minPosition.z) / (maxPosition.z - minPosition.z), director.root.cumulativeTime, 0)
                console.log(minPosition, maxPosition, this._temp_v3)
                this.playWaterEffect();
            }
        } else {
            console.log('射线不包含')
        }
    }
}

