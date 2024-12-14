import { _decorator, Component, Node, math, Label } from 'cc';
import { Constants } from '../../utils/const';
import { User } from '../../data/user';
import { activeShare, getLocalStorage } from '../../utils/util';
const { ccclass, property } = _decorator;

@ccclass('PageFail')
export class PageFail extends Component {
    @property(Node)
    public powerLabel: Node = null
    @property(Node)
    public goldLabel: Node = null

    private _prizePowerPoint: number = 0
    private _prizeGold: number = 0

    start() {

    }

    protected onEnable(): void {
        const prizeNum = Constants.GAME_PRIZE_TYPE.failNormal
        const gold = math.randomRangeInt(0, prizeNum)
        this._prizeGold = gold
        const powerNum = Constants.GAME_POWER_POINT_TYPE.fail - User.instance().getLevel() * 10
        const powerCount = math.absMax(Constants.GAME_POWER_POINT_TYPE.pex, powerNum)
        const power = math.randomRangeInt(powerCount - 10, powerCount + 11)
        const powerPoint = User.instance().getPowerPoint()
        const subPower = powerPoint - power > 0 ? power : 0
        this._prizePowerPoint = subPower;

        // 显示金币
        this.goldLabel.getComponent(Label).string = gold.toString()
        this.powerLabel.getComponent(Label).string = subPower.toString()
        
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
        activeShare()
        const user = User.instance()
        user.setGold(this._prizeGold * 5 + user.getGold())
        user.setPowerPoint(user.getPowerPoint() - this._prizePowerPoint)
        user.setLosed()
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

