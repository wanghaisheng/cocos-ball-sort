import { _decorator, Camera, Component, ConfigurableConstraint, equals, EventTouch, geometry, Input, input, Label, Layers, math, Node, PhysicsSystem, SystemEvent, systemEvent, v3, Vec3 } from 'cc';
import { TubeManager } from './tube/tube-manager';
import { BallManager } from './ball/ball-manager';
import { Constants } from '../utils/const';
import { Tube } from './tube/tube';
import { BallControl } from './ball/ball-control';
import { User } from '../utils/user';
import { PageGame } from './page/page-game';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(TubeManager)
    tubeManager: TubeManager = null

    @property(BallManager)
    ballManager: BallManager = null

    @property(BallControl)
    ballControl: BallControl = null

    @property(PageGame)
    pageGame: PageGame = null

    // game
    public gameStatus: number = Constants.GAME_STATUS.INIT

    // tube
    private _tubeList: Tube[] = []
    private _tubeCount: number = 0
    private _emptyTubeCount: number = 0
    private _tubeType: number = Constants.TUBE_TYPE.NO3
    private _addTubeNum: number = 0 // 增加试管的次数
    private _isDissolve: boolean = false // 是否溶解

    // ball
    private _ballCount: number = 0
    private _ballCountMax: number = Constants.BALL_TYPE_MAX

    // data
    private _data: any = {}

    __preload () {
        Constants.gameManager = this
    }

    onLoad() {

    }

    update(deltaTime: number) {
        
    }

    onDestroy() {

    }

    // 初始化
    init() {
        // const userLevel = User.instance().getLevel()
        const userLevel = 5
        this.gameStatus = Constants.GAME_STATUS.INIT
        
        const data = this.getLevelData(userLevel)
        this.initTubeBall(data.tubeType, data.tubeCount, data.emptyTubeCount, data.ballCount, data.ballCountMax, data.ballRandMax)
        // 弹出目标
        Constants.tipManager.showLevelTip(userLevel, data.targetCombinateCount)
        // 更新进度
        this.pageGame.updateProgressNode(0, data.targetCombinateCount)

        this.ballControl.init()
        this._data = data
        this._addTubeNum = 0
        this._isDissolve = false
    }

    initTubeBall(tubeType: number, tubeCount: number, emptyTubeCount: number, ballCount: number, ballCountMax: number, ballRandMax: number) {
        this._tubeType = tubeType
        this._tubeCount = tubeCount
        this._emptyTubeCount = emptyTubeCount
        this._ballCount = ballCount
        this._tubeList.map(item => {
            item.distroyBallList()
        })
        this._tubeList = []

        const tubeNum = tubeCount + emptyTubeCount
        this.tubeManager.createTubes(tubeType, tubeNum, ballCountMax)
        this._tubeList = this.tubeManager.getTubeList()
        const ballTubeList = this._tubeList.slice(0, tubeCount)
        this.ballManager.createBallList(ballTubeList, ballCount)
        this.tubeManager.initTubeBallJump(
            () => {
                this.gameStatus = Constants.GAME_STATUS.READY
                // 当颜色不足时，创建的非空试管个数会变小
                this._tubeCount = this.ballManager.validTubeCount
            }
        )
        
    }

    clickTube(tube: Node) {
        if (this.gameStatus !== Constants.GAME_STATUS.READY && this.gameStatus !== Constants.GAME_STATUS.PLAYING) return
        if (this._isDissolve) {
            // 溶解试管
            const hitTube = tube.getComponent(Tube)
            const ballList = hitTube.getBallList()
            for(let i = ballList.length - 1; i >= 0; i--) {
                ballList[i].dissolve()
            }
            hitTube.clearBallList()
            this._isDissolve = false
            return
        }
        this.ballControl.tubeBallJump(this.tubeManager, this.ballManager, tube, this._tubeList, this._tubeCount)
    }

    // 回撤
    returnBackLastStep(cb: Function) {
        if (this.gameStatus !== Constants.GAME_STATUS.READY && this.gameStatus !== Constants.GAME_STATUS.PLAYING) return
        this.ballControl.returnBallLastStep(this.ballManager, cb)
    }

    // 加管
    addEmptyTube(cb: Function) {
        if (this.gameStatus !== Constants.GAME_STATUS.READY && this.gameStatus !== Constants.GAME_STATUS.PLAYING) return
        if (this._addTubeNum < Constants.TUBE_ADD_NUM) {
            const res = this.tubeManager.addEmptyTube(this._data.tubeType, cb)
            if (res) {
                this._addTubeNum++
            }
        }
    }

    // 溶解
    dissolveTube() {
        this._isDissolve = true
        Constants.tipManager.showTipLabel('选择要溶解的试管', () => {})
    }

    getLevelData(userLevel: number) {
        let data = {
            tubeType: Constants.TUBE_TYPE.NO3, // 试管类型
            tubeCount: 2, // 有球试管个数
            emptyTubeCount: 1, // 空管个数
            ballCount: 3, // 初始球的个数
            ballCountMax: 0,// 试管最大球个数
            ballRandMax: 2, // 试管随机球的类型数
            targetCombinateCount: 3,// 组合次数
        }
        
        // 制定游戏规则
        if (userLevel > 50) {
            // [7, 8]
            const randTubeType = math.randomRangeInt(7, 9)
            if (randTubeType === 7) {
                data.tubeType = Constants.TUBE_TYPE.NO7
            } else {
                data.tubeType = Constants.TUBE_TYPE.NO8
            }
            const tubeNumMax = this.tubeManager.getTubeCountMax(data.tubeType)
            data.tubeCount = tubeNumMax - 1
            data.ballCount = data.tubeType - 4
            data.ballRandMax = Math.min(this._ballCountMax, 15)
            data.targetCombinateCount = userLevel * userLevel * data.ballRandMax
        }
        if (userLevel > 25) {
            // [5, 7]
            const randTubeType = math.randomRangeInt(5, 7)
            if (randTubeType === 5) {
                data.tubeType = Constants.TUBE_TYPE.NO5
            } else {
                data.tubeType = Constants.TUBE_TYPE.NO7
            }
            const tubeNumMax = this.tubeManager.getTubeCountMax(data.tubeType)
            data.tubeCount = tubeNumMax - 1
            data.ballCount = data.tubeType - 3
            data.ballRandMax = Math.min(this._ballCountMax, 15)
            data.targetCombinateCount = userLevel * userLevel * data.ballRandMax
        }
        if (userLevel > 15) {
            // [4, 5]
            const randTubeType = math.randomRangeInt(4, 6)
            data.tubeType = randTubeType === 4 ? Constants.TUBE_TYPE.NO4 : Constants.TUBE_TYPE.NO5
            const tubeNumMax = this.tubeManager.getTubeCountMax(data.tubeType)
            data.tubeCount = tubeNumMax - 1
            data.ballCount = data.tubeType - 3
            data.ballRandMax = Math.min(this._ballCountMax, data.tubeCount + 3)
            data.targetCombinateCount = userLevel * userLevel * data.ballRandMax
        }
        if (userLevel > 10) {
            // [3, 4, 5]
            const randTubeType = math.randomRangeInt(3, 6)
            data.tubeType = randTubeType > 4 ? Constants.TUBE_TYPE.NO5 : (randTubeType > 3 ? Constants.TUBE_TYPE.NO4 : Constants.TUBE_TYPE.NO3)
            const tubeNumMax = this.tubeManager.getTubeCountMax(data.tubeType)
            if (tubeNumMax - 1 > userLevel) {
                data.tubeCount += userLevel - 1
            } else {
                data.tubeCount = tubeNumMax - 1
            }
            data.ballCount = data.tubeType - 2
            data.ballRandMax = Math.min(this._ballCountMax, data.tubeCount)
        }
        if (userLevel > 5) {
            // [3, 4]
            const randTubeType = math.randomRangeInt(3, 5)
            data.tubeType = randTubeType === 3 ? Constants.TUBE_TYPE.NO3 : Constants.TUBE_TYPE.NO4
            const tubeNumMax = this.tubeManager.getTubeCountMax(data.tubeType)
            if (tubeNumMax - 1 > userLevel) {
                data.tubeCount += userLevel - 2
            } else {
                data.tubeCount = tubeNumMax - 1
            }
            data.ballCount = data.tubeType - 2
            data.ballRandMax = Math.min(this._ballCountMax, data.tubeCount)
        }
        if (userLevel > 1) {
            data.tubeType = Constants.TUBE_TYPE.NO3
            const tubeNumMax = this.tubeManager.getTubeCountMax(data.tubeType)
            if (tubeNumMax - 1 > userLevel) {
                data.tubeCount += userLevel
            } else {
                data.tubeCount = tubeNumMax - 1
            }
            data.ballRandMax = Math.min(this._ballCountMax, data.tubeCount)
        }

        data.targetCombinateCount = userLevel * userLevel * data.tubeType
        
        return data
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

