import { _decorator, Component, equals, Label, Layers, Node, Vec3 } from 'cc';
import { Tube } from '../tube/tube';
import { Constants } from '../../utils/const';
import { vibrateShort } from '../../utils/util';
import { Ball } from './ball';
import { TubeManager } from '../tube/tube-manager';
import { BallManager } from './ball-manager';
const { ccclass, property } = _decorator;

@ccclass('BallControl')
export class BallControl extends Component { 
     // ball
     private _jumpPosList: any[] = []
     private _isDelay: boolean = false
 
     private _timeoutId: number = 0
     private _tubeList: Tube[] = []
     private _newTubeList: Tube[] = []
     private _tubeCount: number = 0

    __preload () {
        Constants.ballControl = this
    }
     
    start() {

    }

    update(deltaTime: number) {
        
    }

    onDestroy() {
        clearTimeout(this._timeoutId)
        this.hideInvalidTip()
    }

    // 试管球的跳跃控制
    tubeBallJump(tubeManager: TubeManager, ballManager: BallManager, tube: Node, tubeType: number, tubeList: Tube[], tubeCount: number) {
        const hitTube = tube.getComponent(Tube)
        if (!this.checkValid(tubeManager, hitTube)) return
        // 操作试管内的球体移动
        const topBall = hitTube.getTopBall()
        if (topBall) {
            this._jumpPosList = []
            this._tubeList = tubeList
            this._tubeCount = tubeCount
            this._newTubeList = tubeList.filter(item => item.uuid !== hitTube.uuid)
            const hPos = hitTube.getTubePosition()
            const bPos = topBall.getBallPosition()
            const oldBallY = bPos.y
            const oldBallX = bPos.x
            const tubeH = Tube.getTubeHeight(tubeType)
            
            // 寻找目标试管
            const targetTube = tubeManager.getTargetTube(topBall.ballType, this._newTubeList)
            // console.log('targetTube', targetTube)
            
            // console.log('bPos', bPos)
            if (targetTube) {
                const tPos = targetTube.getTubePosition()
                const ballNum = targetTube.getBallList().length
                const bottomY = ballManager.getBottomY(tPos.y, tubeH)
                // 弹出
                const popY = Math.max(hPos.y, tPos.y) + tubeH / 2 + Constants.BALL_RADIUS * 0.5
                const dstPos = new Vec3(oldBallX, popY, tPos.z)
                // const dstPos = new Vec3(tPos.x, oldBallY, tPos.z)
                topBall.jumpBall(dstPos, Constants.BALL_JUMP_TYPE.UP)
                
                // this._jumpPosList.push([dstPos, Constants.BALL_JUMP_TYPE.UP])
                // 横向跳动
                if (!equals(tPos.x, oldBallX)) {// 正好是两个试管上下情况，x不会有位移的
                    const dstPos2 = new Vec3(tPos.x, dstPos.y, dstPos.z)
                    let moveType = tPos.x > oldBallX ? Constants.BALL_JUMP_TYPE.MOVE_RIGHT : Constants.BALL_JUMP_TYPE.MOVE_LEFT
                    this._jumpPosList.push([dstPos2, moveType])
                }
                // topBall.jumpBall(dstPos2)
                
                // 下沉
                const downY = bottomY + Constants.BALL_RADIUS * ballNum
                const dstPos3 = new Vec3(tPos.x, downY, tPos.z)
                // this._jumpPosList.push(dstPos3)
                // topBall.jumpBall(dstPos3)
                this._jumpPosList.push([dstPos3, Constants.BALL_JUMP_TYPE.DOWN])

                // console.log('tPos', tPos, dstPos3)

                this.delayJumpBall(topBall)

                this.setTubeBall(hitTube, targetTube)
                
            } else {
                // 弹出
                const popY = hPos.y + tubeH / 2 + Constants.BALL_RADIUS * 0.5
                const dstPos = new Vec3(oldBallX, popY, bPos.z)
                // this._jumpPosList.push([dstPos, Constants.BALL_JUMP_TYPE.UP])

                topBall.jumpBall(dstPos, Constants.BALL_JUMP_TYPE.UP)
                // 调用振动
                vibrateShort()
                // 告訴用户弹出无效
                const oldPos = new Vec3(oldBallX, oldBallY, bPos.z)
                this.setJumpBall(tubeManager, hitTube, topBall, oldPos, popY)
                
                // const dstPos4 = new Vec3(oldBallX, oldBallY, bPos.z)
                // // this._jumpPosList.push(dstPos4)
                // this._jumpPosList.push([dstPos4, Constants.BALL_JUMP_TYPE.DOWN])

                // this.JumpBall(topBall)
            }
        }
    }

    checkValid(tubeManager: TubeManager, hitTube: Tube) {
        if (hitTube.disabled || hitTube.isFinish) return false
        if (hitTube.jumpBall) {
            this.hideJumpBall(tubeManager, hitTube)
            return false
        }
        return true
    }

    // 球跳动
    JumpBall(topBall: Ball) {
        if (this._isDelay) return
        if (this._jumpPosList.length) {
            const [pos, moveType] = this._jumpPosList[0]
            this._jumpPosList.splice(0, 1)
            topBall.jumpBall(pos, moveType)
        } else {
            // 检查是否结束
            if (this.checkFinish()) {
                console.log('游戏通关')
                Constants.gameManager.gameOver(Constants.GAME_FINISH_TYPE.PASS)
            }
        }
    }

    // 延迟跳动
    delayJumpBall(ball: Ball) {
        this._isDelay = true
        this._timeoutId = setTimeout(() => {
            this._isDelay = false
            this.JumpBall(ball)
        }, 300)
    }

    setJumpBall(tubeManager: TubeManager, hitTube: Tube, topBall: Ball, oldPos: Vec3, popY: number) {
        // 设置其他tube不可用
        tubeManager.setDisabledTubes(this._newTubeList, true)
        hitTube.setJumpBall(topBall, oldPos)
        this.showInvalidTip(hitTube, popY)
    }

    hideJumpBall(tubeManager: TubeManager, hitTube: Tube) {
        const jumpBall = hitTube.getJumpBall()
        const oldPos = hitTube.getJumpBallOldPos()
        if (jumpBall && oldPos) {
            jumpBall.jumpBall(oldPos, Constants.BALL_JUMP_TYPE.DOWN)
        }
        tubeManager.setDisabledTubes(this._newTubeList, false)
        hitTube.setJumpBall(null, null)
        this.hideInvalidTip()
    }

    showInvalidTip(hitTube: Tube, popY: number) {
        const canvasNode = this.node.parent.getChildByName('Canvas')
        if (canvasNode) {
            // 动态创建label节点
            let node = new Node()
            node.layer = Layers.Enum.UI_2D
            node.name = 'TipLabel'
            let label = node.addComponent(Label)
            label.fontSize = 14
            label.lineHeight = 20
            label.string = '没有可跳的位置'
            const pos = hitTube.getTubePosition()
            node.setPosition(pos.x, popY + 100, pos.z)
            canvasNode.addChild(node)
        }
    }

    hideInvalidTip() {
        const canvasNode = this.node.parent.getChildByName('Canvas')
        if (canvasNode) {
            const node = canvasNode.getChildByName('TipLabel')
            node.destroy()
        }
    }

    // 设置目标试管
    setTubeBall(hitTube: Tube, targetTube: Tube) {
        const topBall = hitTube.popBall()
        targetTube.pushBall(topBall)
        if (targetTube.isAllSameTube()) {
            // 颜色完全相同且满的试管
            targetTube.setIsFinish(true)
        }
    }

    // 检查是否结束
    checkFinish() {
        const finishList = this._tubeList.filter(item => item.isFinish)
        return finishList.length === this._tubeCount
    }
}

