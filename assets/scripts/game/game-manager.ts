import { _decorator, Camera, Component, ConfigurableConstraint, EventTouch, geometry, Input, input, Node, PhysicsSystem, SystemEvent, systemEvent, Vec3 } from 'cc';
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

    init() {
        this.initTubeBall(Constants.TUBE_TYPE.NO3, 6, 1, 3)
    }

    initTubeBall(tubeType: number, tubeCount: number, emptyTubeCount: number, ballCount: number) {
        this._tubeType = tubeType
        this._tubeCount = emptyTubeCount
        this._ballCount = ballCount

        const tubeNum = tubeCount + emptyTubeCount
        this.tubeManager.createTubes(tubeType, tubeNum)
        this._tubeList = this.tubeManager.getTubeList()
        const ballTubeList = this._tubeList.slice(0, tubeCount)
        this.ballManager.createBallList(ballTubeList, ballCount)
    }

    // 点击了试管
    clickTube(tube: Node) {
        // 操作试管内的球体移动
        const hitTube = tube.getComponent(Tube)
        const topBall = hitTube.getTopBall()
        if (topBall) {
            const bPos = topBall.getBallPosition()
            const oldBallY = bPos.y
            const oldBallX = bPos.x
            const tubeH = Tube.getTubeHeight(this._tubeType)

            // 寻找目标试管
            const targetTube = this.tubeManager.getTargetTube(topBall.ballType, this._tubeList)
            console.log('targetTube', targetTube)
            if (targetTube) {
                const tPos = targetTube.getTubePosition()
                const ballNum = targetTube.getBallList().length
                const bottomY = this.ballManager.getBottomY(tPos.y, tubeH)
                // 弹出
                const dstPos = new Vec3(oldBallX, tPos.y + tubeH / 2, tPos.z)
                topBall.jumpBall(dstPos)
                // 横向跳动
                const dstPos2 = new Vec3(dstPos.x, dstPos.y, dstPos.z)
                this.JumpBallAsync(dstPos2, topBall)
                // 下沉
                const y = bottomY + Constants.BALL_RADIUS * (ballNum - 1)
                const dstPos3 = new Vec3(dstPos2.x, y, dstPos2.z)
                this.JumpBallAsync(dstPos3, topBall)

                hitTube.popBall()
                targetTube.pushBall(topBall)
            } else {
                // 弹出
                const tPos = hitTube.getTubePosition()
                const dstPos = new Vec3(oldBallX, tPos.y + tubeH / 2, bPos.z)
                topBall.jumpBall(dstPos)

                const dstPos4 = new Vec3(bPos.x, oldBallY, bPos.z)
                this.JumpBallAsync(dstPos4, topBall)
            }
        }
    }

    JumpBallAsync(dst: Vec3, ball: Ball) {
        this.scheduleOnce(function() {
            console.log('dst', dst)
            ball.jumpBall(dst)
        }, 0.1)
    }

}

