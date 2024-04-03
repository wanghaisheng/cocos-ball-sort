import { _decorator, Camera, Component, EventTouch, geometry, input, Input, Node, PhysicsSystem, SystemEvent, Vec3 } from 'cc';
import { Constants } from '../../utils/const';
import { Ball } from '../ball/ball';
const { ccclass, property } = _decorator;

@ccclass('Tube')
export class Tube extends Component {

    private _tubeType: number = Constants.TUBE_TYPE.NO3
    private _ballCountMax: number = 0
    private _ballList: Ball[] = []

    public static getTubeHeight(type: number) {
        switch(type) {
            case Constants.TUBE_TYPE.NO3:
                return 7
            case Constants.TUBE_TYPE.NO4:
                return 8
            case Constants.TUBE_TYPE.NO5:
                return 10
            default:
                return 2 * type
        }
    }

    start () {
        
    }

    update(deltaTime: number) {
        
    }

    setTubeProp(tubeType: number, ballCountMax: number = 0) {
        this._tubeType = tubeType
        this._ballCountMax = ballCountMax || tubeType
    }

    getBallList() {
        return this._ballList
    }

    getTubeType() {
        return this._tubeType
    }

    // 获取试管的位置
    getTubePosition() {
        return this.node.position
    }

    // 获取顶部球
    getTopBall() {
        if (!this._ballList.length) return null
        return this._ballList[this._ballList.length - 1]
    }

    // 获取顶部类型相同的球
    getAllTopBall() {
        let len = this._ballList.length, res = []
        if (!len) return res
        res[0] = this._ballList[len - 1]
        for(let i = len - 2; i >= 0; i--) {
            const ball = this._ballList[i]
            if (ball.ballType === res[0].ballType) {
                res.push(ball)
            } else {
                break
            }
        }
        return res
    }

    // 塞入球体
    pushBall(ball: Ball) {
        if (this._ballList.length >= this._ballCountMax) {
            return false
        }

        this._ballList.push(ball)
        return true
    }

    // 弹出球体
    popBall() {
        return this._ballList.pop()
    }

}

