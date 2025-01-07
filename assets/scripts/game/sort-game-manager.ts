import { _decorator, Camera, Component, ConfigurableConstraint, equals, EventTouch, geometry, Input, input, Label, Layers, Material, math, MeshRenderer, Node, PhysicsSystem, resources, utils, v3, Vec3 } from 'cc';
import { TubeManager } from './tube/tube-manager';
import { BallManager } from './ball/ball-manager';
import { Constants } from '../utils/const';
import { Tube } from './tube/tube';
import { BallControl } from './ball/ball-control';
import { User } from '../data/user';
import { PageSortGame } from './page/page-sort-game';
import { Ball } from './ball/ball';
import { Utils } from '../utils/util';
import LevelData from '../data/level-data';
import { PageDailyTask } from './page/page-daily-task';
import { PageSuccess } from './page/page-success';
import { PageFail } from './page/page-fail';
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

    @property(PageDailyTask)
    pageDailyTask: PageDailyTask = null

    @property(PageFail)
    pageFail: PageFail = null

    @property(PageSuccess)
    pageSuccess: PageSuccess = null

    @property(Node)
    themeNode: Node = null

    @property
    userLevelTest: number = 0

    // game
    public gameStatus: number = Constants.GAME_STATUS.INIT
    public finishStep: number = 0 // 游戏用步数
    public usedTime: number = 0 // 游戏用时

    // tube
    private _tubeList: Tube[] = []
    private _tubeType: number = Constants.TUBE_TYPE.NO3
    private _tubeCount: number = 0 // 总试管数量
    private _ballTubeCount: number = 0 // 有球试管数量
    private _addTubeNum: number = 0 // 增加试管的次数

    // ball
    private _ballCountMax: number = Constants.BALL_TYPE_MAX

    private _userLevel: number = 1

    // data
    private _data: any = {}

    __preload () {
        Constants.sortGameManager = this
    }

    onLoad() {
        Constants.eventTarget.on(Constants.EventName.SHARE, this.handleShare, this)
    }
    
    start() {
        Utils.setLocalStorage('scene', 'SortGameManager')

        // 监听微信分享
        Utils.passiveShare()

        const lastLoginDate = Utils.getLocalStorage('lastLoginDate')
        if (!lastLoginDate) {
            Utils.clearLocalStorage('user')
            Utils.clearLocalStorage('powerData')
            Utils.clearLocalStorage('historyData')
        }

        const today = new Date().toISOString().slice(0, 10)
        if (lastLoginDate !== today) {
            Utils.setLocalStorage('lastLoginDate', today)
        }

        // 初始化
        this.init()

        // 设置皮肤
        this.setUserThemeSkin()

        // 日常登录奖励
        this.pageDailyTask.init()
    }

    update(deltaTime: number) {
        
    }

    onDestroy() {
        Constants.eventTarget.off(Constants.EventName.SHARE, this.handleShare, this)
    }

    // 初始化
    init(level: number = 0) {
        // const userLevel = User.instance().getLevel()
        const userLevel = level || this.userLevelTest || User.instance().getLevel()
        this.gameStatus = Constants.GAME_STATUS.INIT
        const { data } = LevelData.getData(userLevel)
        this._data = data
        this._addTubeNum = 0
        this.finishStep = 0
        this._userLevel = userLevel

        this.pageSortGame.init(data.limitTime)
        this.initTubeBall()
        this.ballControl.init()
        

        // 弹出目标
        Constants.tipManager.showLevelTip(userLevel)
    }

    setUserThemeSkin() {
        const key = User.instance().getDefaultSkin()
        // console.log('setUserThemeSkin', key)
        if (key !== Constants.DEFAULT_THEME) {
            const materialUrl = Constants.THEME_SKIN_LIST.find(item => item.code === key)?.materialUrl
            if (!this.themeNode || !materialUrl) return
            resources.load(materialUrl, Material, (err, material) => {
                this.themeNode.getComponent(MeshRenderer).material = material;
            });
        }
    }

    initTubeBall() {
        const { list = [], spec, tips } = this._data
        const tubeCount = list.length
        const ballList = tubeCount > 0 ? list[0] : []
        const tubeType = Utils.getTubeType(ballList.length)
        const ballCount = ballList.filter(k => k).length || 0
        this._ballTubeCount = list.filter(item => item && item.some(k => k)).length
        this._tubeCount = tubeCount
        this._tubeType = tubeType
        this._tubeList.map(item => {
            item.clearTubeAction(false)
        })
        this._tubeList = []

        this.tubeManager.createTubes(tubeType, tubeCount, ballCount)
        this._tubeList = this.tubeManager.getTubeList()
        const ballTubeList = this._tubeList.slice(0, tubeCount)
        this.ballManager.createSortBallList(ballTubeList, list, spec)
        this.tubeManager.initTubeBallJump(
            () => {
                console.log('小球落地动画完成，开始游戏')
                this.gameStatus = Constants.GAME_STATUS.READY
                // 开启倒计时
                this.pageSortGame.startTimeClock()
            }
        )
        
    }

    clickTube(tube: Node) {
        if (this.gameStatus !== Constants.GAME_STATUS.READY && this.gameStatus !== Constants.GAME_STATUS.PLAYING) return
        const hitTube = tube.getComponent(Tube)
        if (hitTube.isFinish) return
        if (this._userLevel === 1 && User.instance().getIsFirstSortGame()) {
            this.pageSortGame.hideHand()
            User.instance().setIsFirstSortGame(false)
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
        if (this._addTubeNum >= Constants.TUBE_ADD_NUM) {
            return Constants.tipManager.showTipLabel('同一关卡不能重复使用该道具', () => {})
        }
        this.tubeManager.addEmptyTube(this._tubeType, () => {
            this._addTubeNum++
            cb()
        })
    }


    gameOver(type: number) {
        switch(type) {
            case Constants.GAME_FINISH_TYPE.TIME_OUT:
                console.log('game time out')
                this.finishStep = this.ballControl.getStepNum()
                if (this.finishStep > 0) {
                    this.pageFail.showNode(this._userLevel)
                } else {
                    this.pageSortGame.stopTimeClock()// 游戏超时
                    this.usedTime = this.pageSortGame.getGameUsedTime()
                    // 游戏超时
                    Constants.tipManager.showModal({
                        msg: '游戏超时未操作，重新开始',
                        showCloseIcon: false,
                        confirm: () => { this.init() }
                    })
                }
                break;
            case Constants.GAME_FINISH_TYPE.FAIL:
                console.log('game fail')
                this.pageFail.showNode(this._userLevel)
                break;
            case Constants.GAME_FINISH_TYPE.FINISH:
                console.log('game finish')
                break;  
            default:
                console.log('game pass')
                this.pageSuccess.showNode(this._userLevel);
                // 游戏通关
                break;
        }
        this.gameStatus = Constants.GAME_STATUS.GAMEOVER
    }

    checkGameOver(stepCount: number) {
        const finishCount = this._tubeList.filter(item => item.isFinish).length
        if (finishCount === this._ballTubeCount) {
            this.pageSortGame.stopTimeClock()
            this.finishStep = stepCount
            this.usedTime = this.pageSortGame.getGameUsedTime()
            this.gameOver(Constants.GAME_FINISH_TYPE.PASS)
        }
    }

    handleShare() {
        const user = User.instance()
        if (!user.hasDailyShareCount()) {
            Constants.tipManager.showModal({
                msg: '今日分享次数已用完，请明日再来',
            })
        } else {
            const dailyTask = user.getDailyTask()
            dailyTask.shareCount--
            user.setDailyTask(dailyTask)
            
            // 调用分享接口
            Utils.activeShare()
            const shareGold = 20
            user.setGold(shareGold + user.getGold())
        }
    }

}

