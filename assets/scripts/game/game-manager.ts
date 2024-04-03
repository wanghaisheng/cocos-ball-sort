import { _decorator, Camera, Component, ConfigurableConstraint, EventTouch, geometry, Input, input, Node, PhysicsSystem, SystemEvent, systemEvent, Vec3 } from 'cc';
import { TubeManager } from './tube/tube-manager';
import { BallManager } from './ball/ball-manager';
import { Constants } from '../utils/const';
import { initArray } from '../utils/util';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(TubeManager)
    tubeManager: TubeManager = null

    @property(BallManager)
    ballManager: BallManager = null

    // tube
    tubePosList: Vec3[] = []
    tubeCount: number = 0

    // ball
    activeBallList: string[][]
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
        this.initTubeBall(Constants.TUBE_TYPE.NO4, 2, 2, 4)
    }

    initTubeBall(tubeType: number, tubeCount: number, emptyTubeCount: number, ballCount: number) {
        const tubeNum = tubeCount + emptyTubeCount
        this.activeBallList = initArray(tubeNum, ballCount, '')
        this.tubeManager.createTubes(tubeType, tubeNum)
        this.tubePosList = this.tubeManager.getPositionList()
        this.ballManager.createBallList(this.tubePosList.slice(0, tubeCount), ballCount, this.activeBallList)
    }

    // 点击了试管
    clickTube(tube: Node) {
        // 操作试管内的球体移动
        const pos = tube.position

    }

}

