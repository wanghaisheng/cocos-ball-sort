import { _decorator, Camera, Component, EventTouch, geometry, Input, input, instantiate, math, Node, PhysicsSystem, Prefab, v3, Vec3, view } from 'cc';
import { PoolManager } from '../../utils/pool-manager';
import { Constants } from '../../utils/const';
import { Tube } from './tube';
const { ccclass, property } = _decorator;

@ccclass('TubeManager')
export class TubeManager extends Component {
    @property(Camera)
    mainCamera: Camera = null

    // tube
    @property(Prefab)
    tube3: Prefab = null
    @property(Prefab)
    tube4: Prefab = null
    @property(Prefab)
    tube5: Prefab = null

    // layout
    @property
    lineMax: number = 0 // 一行最大试管个数
    @property
    spaceX: number = 0 // 试管横向间距
    @property
    spaceY: number = 0 // 试管纵向间距

    tubeList: Tube[] = [] // 试管列表

    start() {

    }

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
                console.log('击中试管')
                Constants.gameManager.clickTube(hitNode)
            }
        } else {
            console.log('射线不包含')
        }
    }

    getTubeList() {
        return this.tubeList
    }

    getTargetTube(ballType: string, list: Tube[]) {
        // console.log('this.tubeList', this.tubeList)
        let target: Tube = null, curLevel = Constants.TUBE_LEVEL.NONE
        for(let i = 0; i < list.length; i++) {
            const tube = list[i]
            const level = tube.getTargetTubeLevel(ballType)
            // console.log('level', level)
            if (level > curLevel) {
                target = tube
                curLevel = level
            }
        }
        return target
    }

    private _getTubePrefab(type: number) {
        switch(type) {
            case Constants.TUBE_TYPE.NO4:
                return this.tube4
            case Constants.TUBE_TYPE.NO5:
                return this.tube5
            default:
                return this.tube3
        }
    }

    createTubes(type: number, count: number) {
        this.clearTubes()
        this.tubeList = []
        const tubeHight = Tube.getTubeHeight(type)
        const layoutList = this._getTubeLayout(type, count)
        const leftY = this._getY(type, layoutList.length)
        for(let row = 0; row < layoutList.length; row++) {
            const colNum = layoutList[row]
            // x的偏移由横向个数决定，因此需要重新计算
            const leftX = this._getX(type, colNum)
            for(let col = 0; col < colNum; col++) {
                let pos = new Vec3(0, 0, 0)
                pos.y = leftY - row * (tubeHight + this.spaceY)
                pos.x = leftX + col * this.spaceX

                const prefab = this._getTubePrefab(type)
                const tube = PoolManager.instance().getNode(prefab, this.node)
                tube.setPosition(pos)
                const tubeComp = tube.getComponent(Tube)
                tubeComp.setTubeProp(type)

                this.tubeList.push(tubeComp)
            }
        }
    }
 
    clearTubes() {
        const children = this.node.children
        if (children && children.length) {
            for(let i = children.length - 1; i >= 0; i--) {
                PoolManager.instance().putNode(children[i])
            }
        }
    }

    // 获取最左边节点X的偏移量
    private _getX(type: number, totalCol: number) {
        let x = 0
        const n = Math.floor(totalCol / 2)
        if (totalCol % 2) {// 奇数
            x -= n * this.spaceX
        } else {
            x -= ((this.spaceX / 2) + (n - 1) * this.spaceX)
        }
        return x
    }

    // 获取最左边节点Y的偏移量
    private _getY(type: number, totalRow: number) {
        let y = 0
        const tubeHight = Tube.getTubeHeight(type)
        if (totalRow === 2) {
            y += (tubeHight + this.spaceY) / 2
        }
        if (totalRow === 3) {
            y += (tubeHight + this.spaceY)
        }
        return y
    }

    // 试管横向纵向的最大布局
    private _getTubeLayoutMax(type: number) {
        if (type >= Constants.TUBE_TYPE.NO12) {
            return [1, this.lineMax]
        }
        if (type >= Constants.TUBE_TYPE.NO8) {
            return [2, this.lineMax]
        }
        return [3, this.lineMax]
    }

    // 获取试管的布局，个数超过极限，按最大极限算
    private _getTubeLayout(type: number, count: number) {
        if (count <= 0) return [1]

        const [maxRow, maxCol] = this._getTubeLayoutMax(type)
        if (maxRow === 1) {
            return count >= maxCol ? [maxCol] : [count]
        }
        if (maxRow === 2) {
            if (count >= maxRow * maxCol) {
                return [maxCol, maxCol]
            }
            if (count >= maxCol) {
                const col1 = Math.ceil(count / 2)
                return [col1, count - col1]
            }
            return [count]
        } else {// 最大三行布局的情况
            if (count >= 3 * maxCol) {
                return [maxCol, maxCol, maxCol]
            }
            if (count > 2 * maxCol) {// 大于2行的情况
                let top = count - 2 * maxCol
                let middle, bottom
                if (top >= maxCol / 2) {// 大数情况
                    bottom = Math.ceil((count - maxCol) / 2)
                    middle = count - maxCol - bottom
                    return [maxCol, middle, bottom]
                } else {
                    bottom = Math.ceil((count - maxCol + 1) / 2)
                    middle = count - (maxCol - 1) - bottom
                    return [maxCol - 1, middle, bottom]
                }
            }
            if (count >= maxCol) {// 2行
                const top = Math.ceil(count / 2)
                return [top, count - top]
            }
            return [count]
        }
    }
}

