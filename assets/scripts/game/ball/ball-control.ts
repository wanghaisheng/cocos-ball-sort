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

    __preload () {
        Constants.ballControl = this
    }
     
    start() {

    }

    update(deltaTime: number) {
        
    }

    onDestroy() {
        this.hideInvalidTip()
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
                const ballNum = targetTube.getBallList().length
                const bottomY = ballManager.getBottomY(tPos.y, tubeH)
                // 弹出
                const popY = getBallOnTubeY(Math.max(hPos.y, tPos.y), tubeH)
                const dstPos = new Vec3(oldBallX, popY, tPos.z)

                // 横向跳动
                const dstPos2 = new Vec3(tPos.x, dstPos.y, dstPos.z)
                
                // 下沉
                const downY = bottomY + Constants.BALL_RADIUS * ballNum
                const dstPos3 = new Vec3(tPos.x, downY, tPos.z)

                topBall.moveBall([dstPos, dstPos2, dstPos3], () => {
                    this.setTubeBall(hitTube, targetTube)
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
                this.setJumpBall(tubeManager, hitTube, topBall, oldPos, popY)
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
            // jumpBall.jumpBall(oldPos, Constants.BALL_JUMP_TYPE.DOWN)
            jumpBall.moveDown(oldPos, () => {}, true)
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
            // 检查是否结束
            if (this.checkFinish()) {
                Constants.gameManager.gameOver(Constants.GAME_FINISH_TYPE.PASS)
            }
        }
    }

    // 检查是否结束
    checkFinish() {
        const finishList = this._tubeList.filter(item => item.isFinish)
        return finishList.length === this._tubeCount
    }
}

