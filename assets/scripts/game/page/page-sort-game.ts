import { _decorator, Component, EventTouch, Input, input, Label, Node, ProgressBar, resources, Sprite, SpriteFrame } from 'cc';
import { Constants } from '../../utils/const';
import { User } from '../../data/user';
import { PageRank } from './page-rank';
import { WaterUp } from '../effect/WaterUp';
const { ccclass, property } = _decorator;

@ccclass('PageSortGame')
export class PageSortGame extends Component {
    // 顶部
    @property(Node)
    powerNode: Node = null;
    @property(Node)
    powerLabel: Node = null;
    @property(Node)
    timeNode: Node = null;
    @property(Node)
    soundRoot: Node = null
    @property(Node)
    pageShopRoot: Node = null
    @property(Node)
    levelNode: Node = null;

    // 中间
    @property(Node)
    handNode: Node = null

    // 底部
    @property(Node)
    btnWithdrawNode: Node = null;
    @property(Node)
    btnAddTubeNode: Node = null;
    @property(Node)
    btnAddTimeNode: Node = null;
    @property(Node)
    shopNode: Node = null;
    @property(Node)
    resetNode: Node = null;
    // @property(Node)
    // goldLabel: Node = null;

    @property(PageRank)
    pageRank: PageRank = null
    @property(WaterUp)
    waterUp: WaterUp = null

    private _isSupportSound: boolean = true
    private _user: User = null
    private _time: number = 0;
    private _limitTime: number = 0;
    private _totalTime: number = 0;

    start() {

    }

    protected onEnable(): void {
        this.powerNode.on(Node.EventType.TOUCH_END, this.onShowPowerRank, this)
        this.soundRoot.on(Node.EventType.TOUCH_END, this.onSound, this)
        this.shopNode.on(Node.EventType.TOUCH_END, this.onShop, this)
        this.resetNode.on(Node.EventType.TOUCH_END, this.onReset, this)

        this.btnWithdrawNode.on(Node.EventType.TOUCH_END, this.onWithdraw, this)
        this.btnAddTubeNode.on(Node.EventType.TOUCH_END, this.onAddTube, this)
        this.btnAddTimeNode.on(Node.EventType.TOUCH_END, this.onAddTimeClick, this)

        Constants.eventTarget.on(Constants.EventName.UPDATE_USER_INFO, this.showUserInfo, this)
    }

    protected onDisable(): void {
        this.powerNode.off(Node.EventType.TOUCH_END, this.onShowPowerRank, this)
        this.soundRoot.off(Node.EventType.TOUCH_END, this.onSound, this)
        this.shopNode.off(Node.EventType.TOUCH_END, this.onShop, this)
        this.resetNode.off(Node.EventType.TOUCH_END, this.onReset, this)

        this.btnWithdrawNode.off(Node.EventType.TOUCH_END, this.onWithdraw, this)
        this.btnAddTubeNode.off(Node.EventType.TOUCH_END, this.onAddTube, this)
        this.btnAddTimeNode.off(Node.EventType.TOUCH_END, this.onAddTimeClick, this)
        
        Constants.eventTarget.off(Constants.EventName.UPDATE_USER_INFO, this.showUserInfo, this)
    }

    update(deltaTime: number) {
        
    }

    protected onDestroy(): void {
        // 移除监听
        this.stopTimeClock(); // 停止计时器
    }

    init(limitTime: number, level: number) {
        const user = User.instance()
        this._user = user
        // 更新用户金币
        console.log('init', limitTime);
        this._time = limitTime;
        this._limitTime = limitTime;
        this._totalTime = limitTime;
        this.stopTimeClock();
        // 显示用户信息
        this.showUserInfo();
        // 显示倒计时
        this.showTimeClock(this._time);
        // 水球倒计时
        this.waterUp.init(this._time);
        // 显示关卡
        this.levelNode.getComponent(Label).string = `第${level}关`;

        // console.log('user.getIsFirstSortGame()', user.getIsFirstSortGame())
        if (user.getLevel() === 1 && user.getIsFirstSortGame()) {
            this.showHand(); // 显示手势
        }

        setTimeout(() => {
            this.pageRank.init()
        }, 2000);
    }

    // 重置
    onReset() {
        Constants.sortGameManager.init()
    }

    // 声音
    onSound() {
        this._isSupportSound = !this._isSupportSound
        let url = 'texture/sound';
        url += this._isSupportSound ? '/icon-sound-enabled' : '/icon-sound-disable'
        url += '/spriteFrame'
        // console.log('url', url)

        if (this._isSupportSound) {
            // 音乐打开
            Constants.audioManager.onSound()
            // Constants.audioManager.playBgm()
        } else {
            // 音乐关闭
            Constants.audioManager.offSound()
            // Constants.audioManager.stopBgm()
        }
        resources.load(url, SpriteFrame, (err, spriteFrame) => {
            // console.log(err, spriteFrame)
            if (spriteFrame) {
                const sprite = this.soundRoot.getChildByName('icon').getComponent(Sprite)
                if (sprite) {
                    sprite.spriteFrame = spriteFrame;
                }
            }
        })
    }

    // 回退
    onWithdraw() {
        if (this._user.getWithdrawNum() < 1) {
            // Constants.tipManager.showModal({
            //     msg: '道具不足，请先购买',
            //     confirm: () => { this.onShop() }
            // })
            Constants.tipManager.showTipLabel('道具不足，请先购买', () => {
                this.onShop()
            })
            return
        }
        Constants.sortGameManager.returnBackLastStep(() => {
            // 提示
            Constants.tipManager.showTipLabel('回撤成功')
            this._user.setWithdrawNum(this._user.getWithdrawNum() - 1)
        })
    }

    // 加管 
    onAddTube() {
        if (this._user.getAddTubeNum() < 1) {
            // Constants.tipManager.showModal({
            //     msg: '道具不足，请先购买',
            //     confirm: () => { this.onShop() }
            // })
            Constants.tipManager.showTipLabel('道具不足，请先购买', () => {
                this.onShop()
            })
            return
        }
        Constants.sortGameManager.addEmptyTube(() => {
            // 提示
            Constants.tipManager.showTipLabel('加管成功')
            this._user.setAddTubeNum(this._user.getAddTubeNum() - 1)
        })
    }

    // 加时
    onAddTimeClick() {
        if (this._user.getAddTimeNum() < 1) {
            // Constants.tipManager.showModal({
            //     msg: '道具不足，请先购买',
            //     confirm: () => { this.onShop() }
            // })
            Constants.tipManager.showTipLabel('道具不足，请先购买', () => {
                this.onShop()
            })
            return
        }
        this._user.setAddTimeNum(this._user.getAddTimeNum() - 1)
        this._time += this._limitTime;
        this._totalTime += this._limitTime;

        // 显示倒计时
        this.showTimeClock(this._time);
        // 水球倒计时
        this.waterUp.init(this._time);
        // 提示
        Constants.tipManager.showTipLabel('加时成功')
    }

    // 商店
    onShop() {
        this.pageShopRoot.active = true
    }

    /** 开启倒计时 */
    startTimeClock() {
        this.unschedule(this.setTimeClock);
        this.schedule(this.setTimeClock, 1);
        // 水球倒计时
        this.waterUp.startCountdown();
    }

    showTimeClock(time: number) {
        const m = Math.floor(time / 60);
        const s = time % 60;
        const mStr = `${m < 10 ? `0${m}` : m}`;
        const sStr = `${s < 10 ? `0${s}` : s}`;
        const timeStr = `${mStr}:${sStr}`;
        // 设置倒计时
        this.timeNode.getComponent(Label).string = `${timeStr}`;
    }

    setTimeClock() {
        this._time--;
        if (this._time < 0) {
            this.stopTimeClock();

            console.log('游戏超时');
            // Constant.dialogManager.showTipLabel('游戏超时', () => {
            //     Constant.gameManager.gameOver();
            // });
            Constants.sortGameManager.gameOver(Constants.GAME_FINISH_TYPE.TIME_OUT);
        } else {
            this.showTimeClock(this._time);
        }
    }

    stopTimeClock() {
        this.unschedule(this.setTimeClock);
        this.waterUp.stopCountdown();
    }

    getGameUsedTime() {
        return this._totalTime - this._time;
    }

    showUserInfo() {
        this.powerLabel.getComponent(Label).string = `${this._user.getPowerPoint()}`;
        // this.goldLabel.getComponent(Label).string = `${this._user.getGold()}`;
    }

    onShowPowerRank() {
        this.pageRank.showNode();
    }

    showHand() {
        this.handNode.active = true;
    }

    hideHand() {
        this.handNode.active = false;
    }

}

