import { _decorator, Camera, Component, ConfigurableConstraint, EventTouch, geometry, Input, input, Node, PhysicsSystem, SystemEvent, systemEvent, Vec3 } from 'cc';
import { TubeManager } from './tube/tube-manager';
import { BallManager } from './ball/ball-manager';
import { Constants } from '../utils/const';
import { Tube } from './tube/tube';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(TubeManager)
    tubeManager: TubeManager = null

    @property(BallManager)
    ballManager: BallManager = null

    // tube
    tubeList: Tube[] = []
    tubeCount: number = 0

    // ball
    // activeBallList: string[][]
    ballCount: number = 0


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
        const tubeNum = tubeCount + emptyTubeCount
        this.tubeManager.createTubes(tubeType, tubeNum)
        this.tubeList = this.tubeManager.getTubeList()
        const ballTubeList = this.tubeList.slice(0, tubeCount)
        this.ballManager.createBallList(ballTubeList, ballCount)
        console.log('this.tubeList', this.tubeList)
    }

    // 点击了试管
    clickTube(tube: Node) {
        // 操作试管内的球体移动
        const pos = tube.position
        console.log('tube', tube)
        const target = tube.getComponent(Tube)
        const topBall = target.getTopBall()
        console.log('topBall', target.getBallList(), topBall)
        // 跳跃
        topBall.ballPop(10)
    }

}

