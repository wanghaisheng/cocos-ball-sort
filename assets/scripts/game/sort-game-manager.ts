import { _decorator, Camera, Component, ConfigurableConstraint, equals, EventTouch, geometry, Input, input, Label, Layers, math, Node, PhysicsSystem, utils, v3, Vec3 } from 'cc';
import { TubeManager } from './tube/tube-manager';
import { BallManager } from './ball/ball-manager';
import { Constants } from '../utils/const';
import { Tube } from './tube/tube';
import { BallControl } from './ball/ball-control';
import { User } from '../data/user';
import { PageSortGame } from './page/page-sort-game';
import { Ball } from './ball/ball';
import { passiveShare, getTubeType, setLocalStorage } from '../utils/util';
import LevelData from '../data/level-data';
const { ccclass, property } = _decorator;

/**
 * 游戏管理器
 * 1）可增加炸弹球、彩虹球道具
 */
@ccclass('SortGameManager')
export class SortGameManager extends Component {

    @property(TubeManager)
    tubeManager: TubeManager = null

    @property(BallManager)
    ballManager: BallManager = null

    @property(BallControl)
    ballControl: BallControl = null

    @property(PageSortGame)
    pageSortGame: PageSortGame = null

    @property(Node)
    pageFail: Node = null

    @property(Node)
    pageSuccess: Node = null

    @property
    userLevelTest: number = 0

    // game
    public gameStatus: number = Constants.GAME_STATUS.INIT
    public finishStep: number = 0

    // tube
    private _tubeList: Tube[] = []
    private _tubeCount: number = 0 // 总试管数量
    private _ballTubeCount: number = 0 // 有球试管数量
    private _addTubeNum: number = 0 // 增加试管的次数

    // ball
    private _ballCountMax: number = Constants.BALL_TYPE_MAX

    // data
    private _data: any = {}

    __preload () {
        Constants.sortGameManager = this
    }

    onLoad() {
        
    }
    
    start() {
        setLocalStorage('scene', 'SortGameManager')

        // 监听微信分享
        passiveShare()

        // 初始化
        this.init()
    }

    update(deltaTime: number) {
        
    }

    onDestroy() {

    }

    // 初始化
    init() {
        // const userLevel = User.instance().getLevel()
        const userLevel = this.userLevelTest || User.instance().getLevel()
        this.gameStatus = Constants.GAME_STATUS.INIT
        const { data } = LevelData.getData(userLevel)
        this._data = data
        this._addTubeNum = 0
        this.finishStep = 0

        this.pageSortGame.init(data.limitTime)
        this.initTubeBall()
        this.ballControl.init()
        

        // 弹出目标
        Constants.tipManager.showLevelTip(userLevel)
    }

    initTubeBall() {
        const { list = [] } = this._data
        const tubeCount = list.length
        const ballList = tubeCount > 0 ? list[0] : []
        const tubeType = getTubeType(ballList.length)
        const ballCount = ballList.filter(k => k).length || 0
        this._ballTubeCount = list.filter(item => item && item.some(k => k)).length
        this._tubeCount = tubeCount
        this._tubeList.map(item => {
            item.clearTubeAction(false)
        })
        this._tubeList = []

        this.tubeManager.createTubes(tubeType, tubeCount, ballCount)
        this._tubeList = this.tubeManager.getTubeList()
        const ballTubeList = this._tubeList.slice(0, tubeCount)
        this.ballManager.createSortBallList(ballTubeList, list)
        this.tubeManager.initTubeBallJump(
            () => {
                this.gameStatus = Constants.GAME_STATUS.READY
            }
        )
        
    }

    clickTube(tube: Node) {
        if (this.gameStatus !== Constants.GAME_STATUS.READY && this.gameStatus !== Constants.GAME_STATUS.PLAYING) return
        const hitTube = tube.getComponent(Tube)
        if (hitTube.isFinish) return
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
        if (this._addTubeNum++ >= Constants.TUBE_ADD_NUM) {
            return Constants.tipManager.showTipLabel('当局已使用过该道具', () => {})
        }
        this.tubeManager.addEmptyTube(this._data.tubeType, cb)
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

    checkGameOver(stepCount: number) {
        const finishCount = this._tubeList.filter(item => item.isFinish).length
        if (finishCount === this._ballTubeCount) {
            this.finishStep = stepCount
            this.gameOver(Constants.GAME_FINISH_TYPE.PASS)
        }
    }

}

