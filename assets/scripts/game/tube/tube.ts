import { _decorator, Camera, Component, EventTouch, geometry, input, Input, Node, PhysicsSystem, SystemEvent, Vec3 } from 'cc';
import { Constants } from '../../utils/const';
import { Ball } from '../ball/ball';
const { ccclass, property } = _decorator;

@ccclass('Tube')
export class Tube extends Component {

    public disabled: boolean = false
    public isFinish: boolean = false

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

    setDisabled(disabled: boolean) {
        this.disabled = disabled
    }

    setIsFinish(isFinish: boolean) {
        this.isFinish = isFinish
    }

    getBallList() {
        return this._ballList
    }

    getTubeType() {
        return this._tubeType
    }

    // 获取符合目标的等级，数值越高越符合
    getTargetTubeLevel(ballType: string) {
        let level = Constants.TUBE_LEVEL.NONE
        if (!this._ballList.length) return Constants.TUBE_LEVEL.GOOD
        if (this._ballList.length < this._ballCountMax) {
            const topBall = this.getTopBall()
            if (topBall.ballType === ballType) {
                level = Constants.TUBE_LEVEL.POOR
                if (this.isAllSame()) {
                    level = Constants.TUBE_LEVEL.EXCELLENT
                }
            }
        }
        return level
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
        let len = this._ballList.length, k = 1
        if (!len) return []
        const top = this._ballList[len - 1]
        for(let i = len - 2; i >= 0; i--) {
            const ball = this._ballList[i]
            if (ball.ballType === top.ballType) {
                k++
            } else {
                break
            }
        }
        return this._ballList.slice(-k)
    }

    // 颜色完全相同，不一定满
    isAllSame() {
        const sameBallList = this.getAllTopBall()
        return sameBallList.length === this._ballList.length
    }

    // 颜色完全相同且满
    isAllSameTube() {
        const len = this._ballList.length
        return len === this._ballCountMax && this.isAllSame()
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

