import { _decorator, Camera, Component, ConfigurableConstraint, equals, EventTouch, geometry, Input, input, Node, PhysicsSystem, SystemEvent, systemEvent, Vec3 } from 'cc';
import { TubeManager } from './tube/tube-manager';
import { BallManager } from './ball/ball-manager';
import { Constants } from '../utils/const';
import { Tube } from './tube/tube';
import { Ball } from './ball/ball';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(TubeManager)
    tubeManager: TubeManager = null

    @property(BallManager)
    ballManager: BallManager = null

    // tube
    private _tubeList: Tube[] = []
    private _tubeCount: number = 0
    private _emptyTubeCount: number = 0
    private _tubeType: number = Constants.TUBE_TYPE.NO3

    // ball
    private _ballCount: number = 0
    private _jumpPosList: any[] = []
    private _isDelay: boolean = false

    private _timeoutId: number = 0

    __preload () {
        Constants.gameManager = this
    }

    onLoad() {

    }

    start() {
        this.init()
    }

    update(deltaTime: number) {
        
    }

    onDestroy() {
        clearTimeout(this._timeoutId)
    }

    init() {
        this.initTubeBall(Constants.TUBE_TYPE.NO3, 4, 2, 3)
    }

    initTubeBall(tubeType: number, tubeCount: number, emptyTubeCount: number, ballCount: number) {
        this._tubeType = tubeType
        this._tubeCount = tubeCount
        this._emptyTubeCount = emptyTubeCount
        this._ballCount = ballCount

        const tubeNum = tubeCount + emptyTubeCount
        this.tubeManager.createTubes(tubeType, tubeNum)
        this._tubeList = this.tubeManager.getTubeList()
        const ballTubeList = this._tubeList.slice(0, tubeCount)
        this.ballManager.createBallList(ballTubeList, ballCount)
        // 当颜色不足时，创建的非空试管个数会变小
        this._tubeCount = this.ballManager.validTubeCount
    }

    // 点击了试管
    clickTube(tube: Node) {
        const hitTube = tube.getComponent(Tube)
        if (hitTube.disabled || hitTube.isFinish) return
        // 操作试管内的球体移动
        const topBall = hitTube.getTopBall()
        if (topBall) {
            this._jumpPosList = []
            const hPos = hitTube.getTubePosition()
            const bPos = topBall.getBallPosition()
            const oldBallY = bPos.y
            const oldBallX = bPos.x
            const tubeH = Tube.getTubeHeight(this._tubeType)

            const newTubeList = this._tubeList.filter(item => item.uuid !== hitTube.uuid)
            // 寻找目标试管
            const targetTube = this.tubeManager.getTargetTube(topBall.ballType, newTubeList)
            // console.log('targetTube', targetTube)
            
            // console.log('bPos', bPos)
            if (targetTube) {
                const tPos = targetTube.getTubePosition()
                const ballNum = targetTube.getBallList().length
                const bottomY = this.ballManager.getBottomY(tPos.y, tubeH)
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
                this._jumpPosList.push([dstPos, Constants.BALL_JUMP_TYPE.UP])

                const dstPos4 = new Vec3(oldBallX, oldBallY, bPos.z)
                // this._jumpPosList.push(dstPos4)
                this._jumpPosList.push([dstPos4, Constants.BALL_JUMP_TYPE.DOWN])

                this.JumpBall(topBall)
            }
        }
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
                console.log('游戏结束')
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

