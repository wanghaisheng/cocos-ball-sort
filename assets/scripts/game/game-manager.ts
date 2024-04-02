import { _decorator, Camera, Component, EventTouch, geometry, Input, input, Node, PhysicsSystem, SystemEvent, systemEvent } from 'cc';
import { TubeManager } from './tube/tube-manager';
import { BallManager } from './ball/ball-manager';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(TubeManager)
    tubeManager: TubeManager = null

    @property(BallManager)
    ballManager: BallManager = null

    onLoad() {

    }

    start() {
        this.init()
    }

    update(deltaTime: number) {
        
    }

    init() {
        this.tubeManager.createTubes(3)
        const posList = this.tubeManager.getPositionList()
        this.ballManager.createBallList(posList, 4)
    }

}

