import { _decorator, Camera, Component, ConfigurableConstraint, equals, EventTouch, geometry, Input, input, Label, Layers, math, Node, PhysicsSystem, v3, Vec3 } from 'cc';
import { TubeManager } from './tube/tube-manager';
import { BallManager } from './ball/ball-manager';
import { Constants } from '../utils/const';
import { Tube } from './tube/tube';
import { BallControl } from './ball/ball-control';
import { User } from '../utils/user';
import { PageGame } from './page/page-game';
import { Ball } from './ball/ball';
const { ccclass, property } = _decorator;

/**
 * 游戏管理器
 * 1）可增加炸弹道具
 */
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

    @property(Node)
    pageFail: Node = null

    @property(Node)
    pageSuccess: Node = null

    // game
    public gameStatus: number = Constants.GAME_STATUS.INIT
    public finishStep: number = 0

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
    private _targetCombinateCount: number = 0
    private _eliminateBallCount: number = 0
    private _ballTypeNum: number = 0

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
        const userLevel = 2
        this.gameStatus = Constants.GAME_STATUS.INIT
        const data = this.getLevelData(userLevel)
        this._data = data
        this._addTubeNum = 0
        this._isDissolve = false
        this.finishStep = 0
        this._eliminateBallCount = 0
        this._ballTypeNum = data.ballTypeNum
        this._targetCombinateCount = data.targetCombinateCount

        this.initTubeBall(data.tubeType, data.tubeCount, data.emptyTubeCount, data.ballCount, data.ballCountMax, data.ballTypeNum)
        this.ballControl.init()

        // 弹出目标
        Constants.tipManager.showLevelTip(userLevel, data.targetCombinateCount)
        // 更新进度
        this.updateProgress(0, 0)
    }

    initTubeBall(tubeType: number, tubeCount: number, emptyTubeCount: number, ballCount: number, ballCountMax: number, ballTypeNum: number) {
        this._tubeType = tubeType
        this._tubeCount = tubeCount
        this._emptyTubeCount = emptyTubeCount
        this._ballCount = ballCount
        this._tubeList.map(item => {
            item.clearTubeAction(false)
        })
        this._tubeList = []

        const tubeNum = tubeCount + emptyTubeCount
        this.tubeManager.createTubes(tubeType, tubeNum, ballCountMax)
        this._tubeList = this.tubeManager.getTubeList()
        const ballTubeList = this._tubeList.slice(0, tubeCount)
        this.ballManager.createBallList(ballTubeList, ballCount, ballTypeNum)
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
            hitTube.clearTubeAction(true)
            this._isDissolve = false
            return
        }
        this.ballControl.tubeBallJump(this.tubeManager, this.ballManager, tube, this._tubeList, this._tubeCount)
    }

    // 回撤
    returnBackLastStep(cb: Function) {
        if (this.gameStatus !== Constants.GAME_STATUS.READY && this.gameStatus !== Constants.GAME_STATUS.PLAYING) return
        const res = this.ballControl.returnBallLastStep(this.ballManager, cb)
        if (res === null) {
            // 没有回撤的球
            Constants.tipManager.showTipLabel('没有可回撤的球', () => {})
        }
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

    // 派发
    dispatchBall() {
        // 派发球的过程中，不允许操作
        this.gameStatus = Constants.GAME_STATUS.PAUSE
        this.ballManager.dispatchBall(
            this.ballControl,
            this._tubeCount,
            this._ballTypeNum,
            this._tubeList,
            () => {
                console.log('dispatch ball finish')
                // 清除已满的试管
                this._tubeList.forEach((item) => {
                    this.ballControl.checkTubeFull(item)
                })
                // 判断是否所有试管都已经满了
                if (this._tubeList.every(item => item.isFull())) {
                    this.gameOver(Constants.GAME_FINISH_TYPE.FAIL)
                } else {
                    // 球派发完成，可以操作了
                    this.gameStatus = Constants.GAME_STATUS.PLAYING
                }
            }
        )
    }

    // 清空试管
    dissolveTube() {
        if (this.gameStatus !== Constants.GAME_STATUS.READY && this.gameStatus !== Constants.GAME_STATUS.PLAYING) return
        this._isDissolve = true
        Constants.tipManager.showTipLabel('选择要清空的试管', () => {})
    }

    getLevelData(userLevel: number) {
        let data = {
            tubeType: Constants.TUBE_TYPE.NO3, // 试管类型
            tubeCount: 2, // 有球试管个数
            emptyTubeCount: 1, // 空管个数
            ballCount: 2, // 初始球的个数
            ballCountMax: 0,// 试管最大球个数
            ballTypeNum: 2, // 试管随机球的类型数
            targetCombinateCount: 10,// 组合次数
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
            data.ballTypeNum = Math.min(this._ballCountMax, 15)
            data.targetCombinateCount = userLevel * userLevel * data.ballTypeNum
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
            data.ballTypeNum = Math.min(this._ballCountMax, 15)
            data.targetCombinateCount = userLevel * userLevel * data.ballTypeNum
        }
        if (userLevel > 15) {
            // [4, 5]
            const randTubeType = math.randomRangeInt(4, 6)
            data.tubeType = randTubeType === 4 ? Constants.TUBE_TYPE.NO4 : Constants.TUBE_TYPE.NO5
            const tubeNumMax = this.tubeManager.getTubeCountMax(data.tubeType)
            data.tubeCount = tubeNumMax - 1
            data.ballCount = data.tubeType - 3
            data.ballTypeNum = Math.min(this._ballCountMax, data.tubeCount + 3)
            data.targetCombinateCount = userLevel * userLevel * data.ballTypeNum
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
            data.ballTypeNum = Math.min(this._ballCountMax, data.tubeCount)
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
            data.ballTypeNum = Math.min(this._ballCountMax, data.tubeCount)
        }
        if (userLevel > 1) {
            // 增加一支试管或颜色
            data.tubeType = Constants.TUBE_TYPE.NO3
            const randX = math.randomRangeInt(0, 2)
            if (randX === 0) {
                // 增加一支试管
                data.tubeCount += (userLevel - 1)
            } else {
                // 增加一种颜色
                data.ballTypeNum += (userLevel - 1)
            }
            data.targetCombinateCount = userLevel * (userLevel + 5) + 40
        }
        
        return data
    }

    gameOver(type: number) {
        switch(type) {
            case Constants.GAME_FINISH_TYPE.FAIL:
                console.log('game fail')
                this.pageFail.active = true
                break;
            case Constants.GAME_FINISH_TYPE.FINISH:
                console.log('game finish')
                break;  
            default:
                console.log('game pass')
                this.pageSuccess.active = true
                // 游戏通关
                break;
        }
        this.gameStatus = Constants.GAME_STATUS.GAMEOVER
    }

    // 更新进度
    updateProgress(eliminateBallCount: number, stepCount: number) {
        this._eliminateBallCount += eliminateBallCount
        this.pageGame.updateProgressNode(this._eliminateBallCount, this._targetCombinateCount)

        if (this._eliminateBallCount >= this._targetCombinateCount) {
            this.finishStep = stepCount
            this.gameOver(Constants.GAME_FINISH_TYPE.PASS)
        }
    }


}

