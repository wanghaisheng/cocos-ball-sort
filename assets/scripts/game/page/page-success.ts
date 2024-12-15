import { _decorator, Component, Label, math, Node, tween, Vec3, v3 } from 'cc';
import { User } from '../../data/user';
import { Constants } from '../../utils/const';
import { activeShare, getLocalStorage } from '../../utils/util';
const { ccclass, property } = _decorator;

@ccclass('PageSuccess')
export class PageSuccess extends Component {
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
    public goldPos: Node = null


    @property(Node)
    public shareBtn: Node = null
    @property(Node)
    public giveUpBtn: Node = null

    private _prizeGold: number = 0
    private _prizePowerPoint: number = 0
    private _goldOriginPos: Vec3 = null
    private _powerOriginPos: Vec3 = null

    start() {
        this._goldOriginPos = this.goldEffect.position.clone()
        this._powerOriginPos = this.powerEffect.position.clone()
    }

    protected onEnable(): void {
        this.shareBtn.on(Node.EventType.TOUCH_END, this.onShare, this)
        this.giveUpBtn.on(Node.EventType.TOUCH_END, this.onGiveUp, this)

        const user = User.instance()
        const level = user.getLevel()
        const prizeNum = Constants.GAME_PRIZE_TYPE.successNormal
        const gold = math.randomRangeInt(prizeNum - 10, prizeNum + 11)
        this._prizeGold = gold
        const powerNum = Constants.GAME_POWER_POINT_TYPE.success - level * 10;
        const powerCount = math.absMax(Constants.GAME_POWER_POINT_TYPE.pex, powerNum);
        const power = math.randomRangeInt(powerCount - 10, powerCount + 11)
        this._prizePowerPoint = power

        const step = Constants.sortGameManager?.finishStep || 1
        const time = Constants.sortGameManager?.usedTime || 0
        const percent = this.getUpPercent(step, time, level)
        let tip = ``
        if (getLocalStorage('scene') == 'GameManager') {
            tip = `共用了 ${step} 步！`
        } else {
            const m = Math.floor(time / 60);
            const s = time % 60;
            tip = m > 0 ? `共用了 ${step} 步，用时 ${m} 分 ${s} 秒！` : `共用了 ${step} 步，用时 ${s} 秒！` 
        }

        this.tipLabel.getComponent(Label).string = tip
        this.percentLabel.getComponent(Label).string = `${percent}%`
        this.goldLabel.getComponent(Label).string = gold.toString()
        this.powerLabel.getComponent(Label).string = power.toString()
        this.powerEffect.getComponent(Label).string = power.toString()
    }

    protected onDisable(): void {
        this.shareBtn.off(Node.EventType.TOUCH_END, this.onShare, this)
        this.giveUpBtn.off(Node.EventType.TOUCH_END, this.onGiveUp, this)
        this.avatarPos.active = false
        this.goldPos.active = false
        this.powerEffect.scale = v3(1, 1, 1)
        this.goldEffect.scale = v3(1, 1, 1)
        this.powerEffect.position = this._powerOriginPos
        this.goldEffect.position = this._goldOriginPos
    }

    update(deltaTime: number) {
        
    }

    onNormalReceive() {
        const user = User.instance()
        user.setGold(this._prizeGold + user.getGold())
        user.setPowerPoint(user.getPowerPoint() + this._prizePowerPoint)
        user.setLevel(user.getLevel() + 1)
        this.hideNode()
    }

    onMoreReceive() {
        // 调用分享接口
        activeShare()
        const user = User.instance()
        user.setGold(this._prizeGold * 3 + user.getGold())
        user.setPowerPoint(user.getPowerPoint() + this._prizePowerPoint)
        user.setLevel(user.getLevel() + 1)
        this.hideNode()
    }

    onShare() {
        this.showEffect(() => {
            this.onMoreReceive()
        })
    }

    onGiveUp() {
        this.showEffect(() => {
            this.onNormalReceive()
        })
    }

    showEffect(cb: Function) {
        this.avatarPos.active = true
        this.goldPos.active = true

        const goldEndPos = this.goldPos.position
        const powerEndPos = this.avatarPos.position
        const t1 = tween(this.powerEffect)
            .to(0.1, { scale: v3(2, 2, 2) })
            .delay(0.3)
            .to(0.5, { scale: v3(0.1, 0.1, 0.1), position: powerEndPos }, { easing: "sineOutIn" })

        const t2 = tween(this.goldEffect)
            .to(0.1, { scale: v3(2, 2, 2) })
            .delay(0.3)
            .to(0.5, { scale: v3(0.1, 0.1, 0.1), position: goldEndPos }, { easing: "sineOutIn" })
            .call(() => { cb() })
        
        t1.start()
        return t2.start()
    }

    getUpPercent(step: number, time: number, level: number) {
        // 用时，步数越小，分数越高
        const up = 100 - (step / 10) * level - (time / 30)
        return Math.floor(up);
    }

    hideNode() {
        this.node.active = false
        if (getLocalStorage('scene') == 'GameManager') {
            Constants.gameManager.init()
        } else {
            Constants.sortGameManager.init()
        }
    }
}

