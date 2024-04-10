import { _decorator, Camera, Component, EventTouch, geometry, input, Input, Node, PhysicsSystem, Vec3 } from 'cc';
import { Constants } from '../../utils/const';
import { Ball } from '../ball/ball';
import { PoolManager } from '../../utils/pool-manager';
const { ccclass, property } = _decorator;

@ccclass('Tube')
export class Tube extends Component {

    public disabled: boolean = false
    public isFinish: boolean = false
    public jumpBall: Ball = null
    public ballCountMax: number = 0

    private _tubeType: number = Constants.TUBE_TYPE.NO3
    private _tubeHeight: number = 0
    private _ballList: Ball[] = []
    private _jumpBallOldPos: Vec3 = null

    start () {
        
    }

    update(deltaTime: number) {
        
    }

    setTubeProp(tubeType: number, height: number, ballCountMax: number = 0) {
        this._tubeType = tubeType
        this._tubeHeight = height
        this.ballCountMax = ballCountMax && ballCountMax < tubeType ?  ballCountMax : tubeType
    }

    setDisabled(disabled: boolean) {
        this.disabled = disabled
    }

    setIsFinish(isFinish: boolean) {
        this.isFinish = isFinish
    }

    getTubeHeight() {
        return this._tubeHeight
    }

    setJumpBall(jumpBal: Ball, oldPos: Vec3) {
        this.jumpBall = jumpBal
        this._jumpBallOldPos = oldPos
    }

    getJumpBall() {
        return this.jumpBall
    }

    getJumpBallOldPos() {
        return this._jumpBallOldPos
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
        if (this._ballList.length < this.ballCountMax) {
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

    setTubePosition(pos: Vec3) {
        this.node.position = pos
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
            if (ball && top && ball.ballType === top.ballType) {
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
        const len = this._ballList.length
        return len && sameBallList.length === len
    }

    // 颜色完全相同且满
    isAllSameTube() {
        const len = this._ballList.length
        return len === this.ballCountMax && this.isAllSame()
    }

    // 是否空管
    isEmpty() {
        return this._ballList.length === 0
    }

    // 是否满了
    isFull() {
        return this._ballList.length >= this.ballCountMax
    }

    // 有球的试管，但未满
    haveBallNotFull() {
        const len = this._ballList.length
        return len > 0 && len < this.ballCountMax
    }

    // 空的位置
    getEmptyBallCount() {
        return this.ballCountMax - this._ballList.length
    }

    // 塞入球体
    pushBall(ball: Ball) {
        if (this._ballList.length >= this.ballCountMax) {
            return false
        }

        this._ballList.push(ball)
        return true
    }

    // 弹出球体
    popBall() {
        return this._ballList.pop()
    }

    // 移除球，清除试管
    clearTubeAction(isWithAction: boolean = false) {
        const ballList = this._ballList
        if (isWithAction) {
            for(let i = ballList.length - 1; i >= 0; i--) {
                ballList[i].dissolve()
            }
        } else {
            ballList.map((item) => {
                // PoolManager.instance().putNode(item.node)
                item.node.destroy()
            })
        }
        this._ballList = []
    }
}

