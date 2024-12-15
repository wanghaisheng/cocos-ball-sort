import { _decorator, Camera, Component, equals, Label, Layers, Node, tween, Vec3 } from 'cc';
import { Tube } from '../tube/tube';
import { Constants } from '../../utils/const';
import { Utils } from '../../utils/util';
import { Ball } from './ball';
import { TubeManager } from '../tube/tube-manager';
import { BallManager } from './ball-manager';
const { ccclass, property } = _decorator;

@ccclass('BallControl')
export class BallControl extends Component { 
    @property(Camera)
    mainCamera: Camera = null
    @property(Node)
    flowerEffect: Node = null

     private _tubeList: Tube[] = []
     private _newTubeList: Tube[] = []
     private _tubeCount: number = 0
     private _stepList: any[] = []
     
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
        this._stepList = []
    }

    // 试管球的跳跃控制
    tubeBallJump(tubeManager: TubeManager, ballManager: BallManager, tube: Node, tubeList: Tube[], tubeCount: number) {
        const hitTube = tube.getComponent(Tube)
        // 操作试管内的球体移动
        const topBallList = hitTube.getAllTopBall()
        const ballCount = topBallList.length
        if (ballCount === 0) return

        this._tubeList = tubeList
        this._tubeCount = tubeCount
        this._newTubeList = tubeList.filter(item => item.uuid !== hitTube.uuid)
        const hPos = hitTube.getTubePosition()
        const tubeH = hitTube.getTubeHeight()
        // 寻找目标试管
        const ballType = topBallList[0].ballType
        // console.log('ballType', ballType)
        const targetTube = tubeManager.getTargetTube(ballType, ballCount, this._newTubeList)
        const emptyBallCount = targetTube && targetTube.isAllSame() ? targetTube.getEmptyBallCount() : 0
        const targetBallCount = targetTube && targetTube.getBallList().length
        for(let i = 0; i < ballCount; i++) {
            const topBall = topBallList[i]
            const bPos = topBall.getBallPosition()
            const oldBallY = bPos.y
            const oldBallX = bPos.x

            if (targetTube) {
                const tPos = targetTube.getTubePosition()
                // 弹出
                const popY = Utils.getBallOnTubeY(Math.max(hPos.y, tPos.y), tubeH)
                const dstPos = new Vec3(oldBallX, popY, tPos.z)

                // 横向跳动
                const dstPos2 = new Vec3(tPos.x, dstPos.y, dstPos.z)
                
                // 下沉
                const bottomY = ballManager.getBottomY(tPos.y, tubeH)
                let downY = bottomY + Constants.BALL_RADIUS * (targetBallCount + i)
                if (emptyBallCount && ballCount > emptyBallCount) {
                    const index = ballCount - emptyBallCount
                    if (i < index) {
                        downY = bottomY + Constants.BALL_RADIUS * i
                    } else {
                        downY = bottomY + Constants.BALL_RADIUS * (targetBallCount + i - index)
                    }
                }
                
                // const downY = bottomY + Constants.BALL_RADIUS * ballNum
                const dstPos3 = new Vec3(tPos.x, downY, tPos.z)
                console.log(dstPos3)
                if (i === ballCount - 1) {
                    topBall.jumpBallAction([dstPos, dstPos2, dstPos3], i * 0.05, () => {
                        Constants.audioManager.play('ball_pop')
                    }, () => {
                        Constants.audioManager.play('ball_down')
                        // 最后一次才设置球，防止球还没跳到指定位置就被销毁
                        topBallList.forEach(() => {
                            // 设置试管和球
                            this.setTubeBall(hitTube, targetTube)
                        })
                        
                    })
                    // 记录上一次跳的位置
                    this._stepList.push([topBallList, hitTube, targetTube])
                } else {
                    topBall.jumpBallAction([dstPos, dstPos2, dstPos3], i * 0.05, () => {
                        Constants.audioManager.play('ball_pop')
                    }, () => {
                        Constants.audioManager.play('ball_down')
                    })
                }
            } else {
                // 弹出
                if (i === 0) {
                    // 调用振动
                    Utils.vibrateShort()
                    // 告訴用户弹出无效
                    Constants.tipManager.showTipLabel('没有可跳的位置', () => {})
                }
                const popY = Utils.getBallOnTubeY(hPos.y, tubeH)
                const dstPos = new Vec3(oldBallX, popY - i * Constants.BALL_RADIUS, bPos.z)
                const oldPos = new Vec3(oldBallX, oldBallY, bPos.z)
                topBall.jumpBallAction([dstPos, oldPos], i * 0.05, () => {
                    Constants.audioManager.play('ball_pop')
                }, () => {})
            }
        }
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
        this.checkTubeFull(targetTube)
    }

    // 判断是否已经满了，并清空
    checkTubeFull(targetTube: Tube) {
        if (!targetTube.isAllSameTube()) return

        // 播放音效
        Constants.audioManager.play('explosion')

        const wpos = targetTube.getTubeTopWordPosition()

        let pos = new Vec3()
        // 转换为UI节点坐标
        // @ts-ignore
        this.mainCamera._camera.update();
        this.mainCamera.convertToUINode(wpos, this.flowerEffect.parent, pos)
        // 播放特效
        Constants.effectManager.playFlowerEffect(pos)

        if (Utils.getLocalStorage('scene') == 'GameManager') {
            // // 颜色完全相同且满的试管
            // targetTube.setIsFinish(true)
            const ballCount = targetTube.getBallList().length
            // 执行清除
            targetTube.clearTubeAction(true)
            // 更新进度
            Constants.gameManager.updateProgress(ballCount, this.getStepNum())
        } else {
            // 颜色完全相同且满的试管
            targetTube.setIsFinish(true)
            // 检测是否结束
            Constants.sortGameManager.checkGameOver(this.getStepNum())
        }
    }

    

    // 回退上一次操作
    returnBallLastStep(ballManager: BallManager, cb: Function) {
        if (this._stepList.length === 0) {
            // 没有回撤的球
            Constants.tipManager.showTipLabel('没有可回撤的球', () => {})
            return
        }
        const [topBallList, jumpTube, targetTube] = this._stepList.pop()
        const invalidBallList = topBallList.filter(item => !item || !item.node)
        if (invalidBallList.length > 0 || jumpTube.isFull()) {
            // 无效的球
            Constants.tipManager.showTipLabel('球或位置失效', () => {})
            return
        }
        for(let i = 0; i < topBallList.length; i++) {
            const ball = topBallList[i]
            // 重新获取试管的位置，是为了防止增加新试管后，位置发生变化
            const tubePos = jumpTube.getTubePosition()
            const ballY = this.getDownBallPosY(ballManager, jumpTube)
            const oldPos = new Vec3(tubePos.x, ballY, tubePos.z)
            ball.setPosition(oldPos)
            targetTube.popBall()
            jumpTube.pushBall(ball)

            if (targetTube.isFinish) {
                targetTube.setIsFinish(false)
            }

            if (i === topBallList.length - 1) {
                cb()
            }
        }
    }

    // 检查是否结束
    checkFinish() {
        const finishList = this._tubeList.filter(item => item.isFinish)
        return finishList.length === this._tubeCount
    }

    /** 获取步数 */
    getStepNum() {
        return this._stepList.length
    }
}

