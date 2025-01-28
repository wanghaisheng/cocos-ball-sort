import { _decorator, Component, Label, math, Node, tween, Vec3, v3 } from 'cc';
import { User } from '../../data/user';
import { Constants } from '../../utils/const';
import { Utils } from '../../utils/util';
import { IHistItem } from '../history/hist-item';
import { HistoryData } from '../../data/history-data';
import { PowerData } from '../../data/power-data';
const { ccclass, property } = _decorator;

@ccclass('PageSuccess')
export class PageSuccess extends Component {
    @property(Node)
    public preLabel: Node = null
    @property(Node)
    public tipLabel: Node = null
    @property(Node)
    public percentLabel: Node = null
    @property(Node)
    public powerLabel: Node = null
    @property(Node)
    public goldLabel: Node = null

    @property(Node)
    public powerEffect: Node = null
    @property(Node)
    public goldEffect: Node = null
    @property(Node)
    public avatarPos: Node = null


    @property(Node)
    public shareBtn: Node = null
    @property(Node)
    public giveUpBtn: Node = null

    private _curLevel: number = 1
    private _limitTime: number = 0
    private _userPrizePower: number = 0
    private _userPrizeGold: number = 0
    private _prizeGold: number = 0
    private _prizePowerPoint: number = 0
    private _newPowerPoint: number = 0
    private _goldOriginPos: Vec3 = null
    private _powerOriginPos: Vec3 = null

    start() {
        this._goldOriginPos = this.goldEffect.position.clone()
        this._powerOriginPos = this.powerEffect.position.clone()
    }

    protected onEnable(): void {
        this.shareBtn.on(Node.EventType.TOUCH_END, this.onShare, this)
        this.giveUpBtn.on(Node.EventType.TOUCH_END, this.onGiveUp, this)

        // const user = User.instance()
        const level = this._curLevel
        const step = Constants.sortGameManager?.finishStep || 1
        const time = Constants.sortGameManager?.usedTime || 0

        const preItem = HistoryData.instance().getLevelData(level)
        
        this._prizeGold = Utils.calculateGoldSuccess(this._userPrizeGold);

        const power = Utils.calculatePower(step, time, level, this._userPrizePower);

        this._newPowerPoint = power

        if (preItem) {
            if (preItem.power < power) {
                this._prizePowerPoint = power - preItem.power
            } else {
                this._prizePowerPoint = 0
            }
        } else {
            this._prizePowerPoint = power
        }
        
        const percent = Utils.calculateUpPercent(step, time, level)
        
        let tip = ``
        if (Utils.getLocalStorage('scene') == 'GameManager') {
            tip = `共用了 ${step} 步！`
        } else {
            const m = Math.floor(time / 60);
            const s = time % 60;
            tip = m > 0 ? `共用了 ${step} 步，用时 ${m} 分 ${s} 秒！` : `共用了 ${step} 步，用时 ${s} 秒！` 
        }

        if (preItem) {
            this.preLabel.active = true
            let str = `（上次用 ${preItem.step} 步`
            if (preItem.time > 60) {
                str += ` ${Math.floor(preItem.time / 60)} 分` 
            }
            str += ` ${preItem.time % 60} 秒）`
            this.preLabel.getComponent(Label).string = str
        }
        this.tipLabel.getComponent(Label).string = tip
        this.percentLabel.getComponent(Label).string = `${percent}%`
        this.goldLabel.getComponent(Label).string = `+ ${this._prizeGold}`
        this.powerLabel.getComponent(Label).string = `+ ${this._prizePowerPoint}`
        this.powerEffect.getComponent(Label).string = `+ ${this._prizePowerPoint}`

        // console.log('', this._curLevel, User.instance().getLevel())
        // 添加历史记录
        this.addHistory(step, time);

        // 播放特效
        Constants.effectManager.playSuccessEffect(v3(0, 207, 70))
    }

    protected onDisable(): void {
        this.shareBtn.off(Node.EventType.TOUCH_END, this.onShare, this)
        this.giveUpBtn.off(Node.EventType.TOUCH_END, this.onGiveUp, this)
        this.preLabel.active = false
        this.avatarPos.active = false
        this.powerEffect.scale = v3(1, 1, 1)
        this.goldEffect.scale = v3(1, 1, 1)
        this.powerEffect.position = this._powerOriginPos
        this.goldEffect.position = this._goldOriginPos
        this._userPrizePower = 0
        this._userPrizeGold = 0
    }

    update(deltaTime: number) {
        
    }

    onNormalReceive() {
        const user = User.instance()
        user.setGold(this._prizeGold + user.getGold())
        user.setPowerPoint(user.getPowerPoint() + this._prizePowerPoint)
        if (this._curLevel === user.getLevel()) {
            user.setLevel(user.getLevel() + 1)
        }
        this.hideNode()
    }

    onMoreReceive() {
        // 调用分享接口
        Utils.activeShare()
        // Constants.audioManager.play('reward')
        const user = User.instance()
        user.setGold(this._prizeGold * 3 + user.getGold())
        user.setPowerPoint(user.getPowerPoint() + this._prizePowerPoint)
        if (this._curLevel === user.getLevel()) {
            user.setLevel(user.getLevel() + 1)
        }
        this.hideNode()
    }

    onShare() {
        const user = User.instance()
        if (!user.hasDailyShareCount()) {
            Constants.tipManager.showModal({
                msg: '今日分享次数已用完，请明日再来',
                confirm: () => { this.onGiveUp() }
            })
        } else {
            const dailyTask = user.getDailyTask()
            dailyTask.shareCount--
            user.setDailyTask(dailyTask)
            
            this.onMoreReceive()
        }
    }

    onGiveUp() {
        Constants.audioManager.play('reward')
        this.showEffect(() => {
            this.onNormalReceive()
        })
    }

    showEffect(cb: Function) {
        this.avatarPos.active = true

        const powerEndPos = this.avatarPos.position
        const t1 = tween(this.powerEffect)
            .to(0.1, { scale: v3(2, 2, 2) })
            .delay(0.3)
            .to(0.5, { scale: v3(0.1, 0.1, 0.1), position: powerEndPos }, { easing: "sineOutIn" })

        const t2 = tween(this.goldEffect)
            .to(0.1, { scale: v3(2, 2, 2) })
            .delay(0.3)
            .to(0.5, { scale: v3(0.1, 0.1, 0.1), position: powerEndPos }, { easing: "sineOutIn" })
            .call(() => { cb() })
        
        t1.start()
        return t2.start()
    }

    addHistory(step: number, time: number) {
        const histItem: IHistItem = {
            step,
            time,
            level: this._curLevel,
            power: this._newPowerPoint,
            // createTime: new Date().getTime(),
            updateTime: new Date().getTime(),
        };

        let list = HistoryData.instance().getHistoryList();
        let preItem = list.find((item) => item.level == this._curLevel);
        if (preItem) {
            if (this._prizePowerPoint) {
                const index = list.findIndex((item) => item.level == preItem.level);
                list[index] = {
                    ...list[index],
                    ...histItem,
                };
            }
        } else {
            histItem.createTime = new Date().getTime();
            list.push(histItem);
        }

        const uniqueList = Array.from(
            new Set(list.map(item => item.level))
          ).map(level => list.find(item => item.level === level));

        HistoryData.instance().setHistoryList(uniqueList);
    }

    showNode(level: number, limitTime: number, userPrizePower: number, userPrizeGold: number) {
        this._curLevel = level || 1
        this._limitTime = limitTime
        this._userPrizePower = userPrizePower
        this._userPrizeGold = userPrizeGold
        this.node.active = true
        console.log('showNode', level, this._curLevel)
    }

    hideNode() {
        this.node.active = false
        if (Utils.getLocalStorage('scene') == 'GameManager') {
            Constants.gameManager.init()
        } else {
            Constants.sortGameManager.init()
        }
    }
}

