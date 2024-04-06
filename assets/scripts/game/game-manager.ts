import { _decorator, Camera, Component, ConfigurableConstraint, equals, EventTouch, geometry, Input, input, Label, Layers, Node, PhysicsSystem, SystemEvent, systemEvent, v3, Vec3 } from 'cc';
import { TubeManager } from './tube/tube-manager';
import { BallManager } from './ball/ball-manager';
import { Constants } from '../utils/const';
import { Tube } from './tube/tube';
import { BallControl } from './ball/ball-control';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(TubeManager)
    tubeManager: TubeManager = null

    @property(BallManager)
    ballManager: BallManager = null

    @property(BallControl)
    ballControl: BallControl = null

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

    onDestroy() {

    }

    init() {
        this.initTubeBall(Constants.TUBE_TYPE.NO4, 4, 1, 7)
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
        this.tubeManager.initTubeBallJump()
        // 当颜色不足时，创建的非空试管个数会变小
        this._tubeCount = this.ballManager.validTubeCount
    }

    clickTube(tube: Node) {
        this.ballControl.tubeBallJump(this.tubeManager, this.ballManager, tube, this._tubeList, this._tubeCount)
    }

    gameOver(type: number) {
        switch(type) {
            case Constants.GAME_FINISH_TYPE.FAIL:
                console.log('game fail')
                break;
            case Constants.GAME_FINISH_TYPE.FINISH:
                console.log('game finish')
                break;  
            default:
                console.log('game pass')
                // 游戏通关
                break;
        }
    }
}

