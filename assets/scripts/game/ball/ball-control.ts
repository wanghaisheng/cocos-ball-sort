import { _decorator, Component, equals, Label, Layers, Node, tween, Vec3 } from 'cc';
import { Tube } from '../tube/tube';
import { Constants } from '../../utils/const';
import { getBallOnTubeY, vibrateShort } from '../../utils/util';
import { Ball } from './ball';
import { TubeManager } from '../tube/tube-manager';
import { BallManager } from './ball-manager';
const { ccclass, property } = _decorator;

@ccclass('BallControl')
export class BallControl extends Component { 
 
     private _tubeList: Tube[] = []
     private _newTubeList: Tube[] = []
     private _tubeCount: number = 0
     private _lastJumpBall: Ball = null
     private _lastJumpTube: Tube = null
     private _lastTargetTube: Tube = null
     
    start() {

    }

    update(deltaTime: number) {
        
    }

    onDestroy() {
        
    }

    init() {
        this._tubeList = []
        this._newTubeList = []
        this._tubeCount = 0
        this._lastJumpBall = null
        this._lastJumpTube = null
        this._lastTargetTube = null
    }

    // 试管球的跳跃控制
    tubeBallJump(tubeManager: TubeManager, ballManager: BallManager, tube: Node, tubeList: Tube[], tubeCount: number) {
        const hitTube = tube.getComponent(Tube)
        if (!this.checkValid(tubeManager, hitTube)) return
        // 操作试管内的球体移动
        const topBall = hitTube.getTopBall()
        if (topBall) {
            this._tubeList = tubeList
            this._tubeCount = tubeCount
            this._newTubeList = tubeList.filter(item => item.uuid !== hitTube.uuid)
            const hPos = hitTube.getTubePosition()
            const bPos = topBall.getBallPosition()
            const oldBallY = bPos.y
            const oldBallX = bPos.x
            const tubeH = hitTube.getTubeHeight()
            
            // 寻找目标试管
            const targetTube = tubeManager.getTargetTube(topBall.ballType, this._newTubeList)
            
            if (targetTube) {
                const tPos = targetTube.getTubePosition()
                // const ballNum = targetTube.getBallList().length
                // const bottomY = ballManager.getBottomY(tPos.y, tubeH)
                // 弹出
                const popY = getBallOnTubeY(Math.max(hPos.y, tPos.y), tubeH)
                const dstPos = new Vec3(oldBallX, popY, tPos.z)

                // 横向跳动
                const dstPos2 = new Vec3(tPos.x, dstPos.y, dstPos.z)
                
                // 下沉
                // const downY = bottomY + Constants.BALL_RADIUS * ballNum
                const downY = this.getDownBallPosY(ballManager, targetTube)
                const dstPos3 = new Vec3(tPos.x, downY, tPos.z)

                topBall.moveBall([dstPos, dstPos2, dstPos3], () => {
                    this.setTubeBall(hitTube, targetTube)
                    // 记录上一次跳的位置
                    this._lastJumpBall = topBall
                    this._lastJumpTube = hitTube
                    this._lastTargetTube = targetTube
                })
                
            } else {
                // 弹出
                const popY = getBallOnTubeY(hPos.y, tubeH)
                const dstPos = new Vec3(oldBallX, popY, bPos.z)

                topBall.moveUp(dstPos, true)
                // 调用振动
                vibrateShort()
                // 告訴用户弹出无效
                const oldPos = new Vec3(oldBallX, oldBallY, bPos.z)
                Constants.tipManager.showTipLabel('没有合适的位置', () => {
                    topBall.moveDown(oldPos, () => {}, true)
                })
            }
        }
    }

    checkValid(tubeManager: TubeManager, hitTube: Tube) {
        if (hitTube.disabled || hitTube.isFinish) return false
        return true
    }

    // 获取球下沉的位置Y
    getDownBallPosY(ballManager: BallManager, targetTube: Tube) {
        const tubeH = targetTube.getTubeHeight()
        const tPos = targetTube.getTubePosition()
        const ballNum = targetTube.getBallList().length
        const bottomY = ballManager.getBottomY(tPos.y, tubeH)
        return bottomY + Constants.BALL_RADIUS * ballNum
    }

    // 设置目标试管
    setTubeBall(hitTube: Tube, targetTube: Tube) {
        const topBall = hitTube.popBall()
        targetTube.pushBall(topBall)
        if (targetTube.isAllSameTube()) {
            // 颜色完全相同且满的试管
            targetTube.setIsFinish(true)
            // 检查是否结束
            if (this.checkFinish()) {
                Constants.gameManager.gameOver(Constants.GAME_FINISH_TYPE.PASS)
            }
        }
    }

    returnBallLastStep(ballManager: BallManager, cb: Function) {
        if (this._lastJumpBall && this._lastJumpTube) {
            if (this._lastJumpBall.getVisible()) {
                // 重新获取试管的位置，是为了防止增加新试管后，位置发生变化
                const tubePos = this._lastJumpTube.getTubePosition()
                const ballY = this.getDownBallPosY(ballManager, this._lastJumpTube)
                const oldPos = new Vec3(tubePos.x, ballY, tubePos.z)
                this._lastJumpBall.setPosition(oldPos)
                this._lastTargetTube.popBall()
                this._lastJumpTube.pushBall(this._lastJumpBall)
                cb()
            }
            this._lastJumpBall = null
            this._lastJumpTube = null
            this._lastTargetTube = null
        }
    }

    // 检查是否结束
    checkFinish() {
        const finishList = this._tubeList.filter(item => item.isFinish)
        return finishList.length === this._tubeCount
    }
}

