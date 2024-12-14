import { _decorator, Component, Label, math, Node } from 'cc';
import { User } from '../../data/user';
import { Constants } from '../../utils/const';
import { activeShare, getLocalStorage } from '../../utils/util';
const { ccclass, property } = _decorator;

@ccclass('PageSuccess')
export class PageSuccess extends Component {
    @property(Node)
    public tipLabel: Node = null
    @property(Node)
    public powerLabel: Node = null
    @property(Node)
    public goldLabel: Node = null

    private _prizeGold: number = 0
    private _prizePowerPoint: number = 0

    start() {

    }

    protected onEnable(): void {
        const prizeNum = Constants.GAME_PRIZE_TYPE.successNormal
        const gold = math.randomRangeInt(prizeNum - 10, prizeNum + 11)
        this._prizeGold = gold
        const powerNum = Constants.GAME_POWER_POINT_TYPE.success - User.instance().getLevel() * 10;
        const powerCount = math.absMax(Constants.GAME_POWER_POINT_TYPE.pex, powerNum);
        const power = math.randomRangeInt(powerCount - 10, powerCount + 11)
        this._prizePowerPoint = power
        let step = 1, time = 0
        let tip = ``
        if (getLocalStorage('scene') == 'GameManager') {
            step = Constants.gameManager.finishStep || step
            tip = `共用了 ${step} 步！`
        } else {
            time = Constants.sortGameManager.usedTime || time
            const m = Math.floor(time / 60);
            const s = time % 60;
            step = Constants.sortGameManager.finishStep || step
            tip = m > 0 ? `共用了 ${step} 步，用时 ${m} 分 ${s} 秒！` : `共用了 ${step} 步，用时 ${s} 秒！` 
        }

        
        
        // 显示金币
        this.tipLabel.getComponent(Label).string = tip
        this.goldLabel.getComponent(Label).string = gold.toString()
        this.powerLabel.getComponent(Label).string = power.toString()
        
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

    hideNode() {
        this.node.active = false
        if (getLocalStorage('scene') == 'GameManager') {
            Constants.gameManager.init()
        } else {
            Constants.sortGameManager.init()
        }
    }
}

