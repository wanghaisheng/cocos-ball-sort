import { _decorator, Camera, Component, EventTouch, geometry, Input, input, instantiate, math, Node, PhysicsSystem, Prefab, v3, Vec3, view } from 'cc';
import { PoolManager } from '../../utils/pool-manager';
import { Constants } from '../../utils/const';
const { ccclass, property } = _decorator;

@ccclass('TubeManager')
export class TubeManager extends Component {
    @property(Camera)
    mainCamera: Camera = null

    // @property(Node)
    // Tubes: Node = null

    @property(Prefab)
    tube3: Prefab = null
    @property(Prefab)
    tube4: Prefab = null


    private _positionList: Vec3[] = []
    spaceX: number = 4
    spaceY: number = 8

    onEnable () {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this)
    }

    onDisable () {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }
    

    onTouchStart(event: EventTouch) {
        const outRay = new geometry.Ray()
        this.mainCamera.screenPointToRay(event.getLocationX(), event.getLocationY(), outRay)
        // if (PhysicsSystem.instance.raycast(outRay)) {
        //     console.log('PhysicsSystem.instance.raycastResults', PhysicsSystem.instance.raycastResults)
        // } else {
        //     console.log('未检测射线222')
        // }

        let ray = this.mainCamera.screenPointToRay(event.getLocationX(), event.getLocationY())

        if (PhysicsSystem.instance.raycastClosest(ray)) {
            const res = PhysicsSystem.instance.raycastClosestResult
            const hitNode = res.collider.node
            console.log('hitNode', hitNode)
            if (hitNode.name.startsWith('tube')) {
                console.log('击中立方体')
                Constants.gameManager.clickTube(hitNode)
            }
        } else {
            console.log('射线不包含')
        }
    }

    onTouchEnd(event: EventTouch) {
        // console.log(event.getLocation());  // Location on screen space
        // console.log(event.getUILocation());  // Location on UI space
    }

    getPositionList() {
        return this._positionList
    }

    _getTubePrefab(type: number) {
        switch(type) {
            case Constants.TUBE_TYPE.NO3:
                return this.tube3
            default:
                return this.tube4
        }
    }

    createTubes(type: number, num: number) {
        this.clearTubes()
        let curX = -4, curY = 0
        for(let i = 0; i < num; i++) {
            let pos = v3(0, 0, 0)
            // const newTube = instantiate(this.tube4)
            const prefab = this._getTubePrefab(type)
            const newTube = PoolManager.instance().getNode(prefab, this.node)
            pos.x = curX
            curX = pos.x + this.spaceX
            newTube.setPosition(pos)
            // this.Tubes.addChild(newTube)
            this._positionList.push(pos)
        }
    }
 
    clearTubes() {
        const children = this.node.children
        if (children && children.length) {
            for(let i = children.length - 1; i >= 0; i--) {
                PoolManager.instance().putNode(children[i])
            }
        }
        // const children = this.Tubes.children
        // if (children && children.length) {
        //     for(let i = 0; i < children.length; i++) {
        //         this.Tubes.children[0].removeFromParent()
        //     }
        // }
    }
}

