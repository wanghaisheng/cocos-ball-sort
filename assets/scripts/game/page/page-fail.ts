import { _decorator, Component, Node, math, Label, tween, Vec3, v3 } from 'cc';
import { Constants } from '../../utils/const';
import { User } from '../../data/user';
import { Utils } from '../../utils/util';
const { ccclass, property } = _decorator;

@ccclass('PageFail')
export class PageFail extends Component {
    @property(Node)
    public powerLabel: Node = null
    @property(Node)
    public goldLabel: Node = null

    @property(Node)
    public goldEffect: Node = null
    @property(Node)
    public goldPos: Node = null


    @property(Node)
    public shareBtn: Node = null
    @property(Node)
    public giveUpBtn: Node = null

    private _prizeGold: number = 0
    private _prizePowerPoint: number = 0
    private _goldOriginPos: Vec3 = null

    start() {
        this._goldOriginPos = this.goldEffect.position.clone()
    }

    protected onEnable(): void {
        this.shareBtn.on(Node.EventType.TOUCH_END, this.onShare, this)
        this.giveUpBtn.on(Node.EventType.TOUCH_END, this.onGiveUp, this)

        const prizeNum = Constants.GAME_PRIZE_TYPE.failNormal
        let gold = math.randomRangeInt(0, prizeNum)
        gold = Math.max(1, gold)
        this._prizeGold = gold
        const powerNum = Constants.GAME_POWER_POINT_TYPE.fail - User.instance().getLevel() * 10
        const powerCount = Math.max(Constants.GAME_POWER_POINT_TYPE.pex, powerNum)
        let power = math.randomRangeInt(powerCount - 10, powerCount + 11)
        power = Math.max(1, power)
        const powerPoint = User.instance().getPowerPoint()
        const subPower = powerPoint - power > 0 ? power : 0
        this._prizePowerPoint = subPower;

        // 显示金币
        this.goldLabel.getComponent(Label).string = `+ ${gold}`
        this.powerLabel.getComponent(Label).string = `- ${subPower}`
        
    }

    protected onDisable(): void {
        this.shareBtn.off(Node.EventType.TOUCH_END, this.onShare, this)
        this.giveUpBtn.off(Node.EventType.TOUCH_END, this.onGiveUp, this)
        this.goldPos.active = false
        this.goldEffect.scale = v3(1, 1, 1)
        this.goldEffect.position = this._goldOriginPos
    }

    update(deltaTime: number) {
        
    }

    onNormalReceive() {
        const user = User.instance()
        user.setGold(user.getGold() + this._prizeGold)
        user.setPowerPoint(user.getPowerPoint() - this._prizePowerPoint)
        user.setLosed()
        this.hideNode()
    }

    onMoreReceive() {
        // 调用分享接口
        Utils.activeShare()
        Constants.audioManager.play('reward')
        const user = User.instance()
        user.setGold(this._prizeGold * 5 + user.getGold())
        user.setPowerPoint(user.getPowerPoint() - this._prizePowerPoint)
        user.setLosed()
        this.hideNode()
    }

    onShare() {
        const user = User.instance()
        if (!user.hasDailyShareCount()) {
            Constants.tipManager.showTipLabel('今日分享次数已用完', () => {
              this.onGiveUp()  
            })
        } else {
            const dailyTask = user.getDailyTask()
            dailyTask.shareCount--
            user.setDailyTask(dailyTask)
            
            this.onMoreReceive()
        }
    }

    onGiveUp() {
        this.showEffect(() => {
            this.onNormalReceive()
        })
    }

    showEffect(cb: Function) {
        this.goldPos.active = true

        const goldEndPos = this.goldPos.position
        const t2 = tween(this.goldEffect)
            .to(0.1, { scale: v3(2, 2, 2) })
            .delay(0.3)
            .to(0.5, { scale: v3(0.1, 0.1, 0.1), position: goldEndPos }, { easing: "sineOutIn" })
            .call(() => { cb() })
        
        return t2.start()
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

