import { _decorator, Component, Node, math } from 'cc';
import { Constants } from '../../utils/const';
import { User } from '../../data/user';
import { activeShare, getLocalStorage } from '../../utils/util';
const { ccclass, property } = _decorator;

@ccclass('PageFail')
export class PageFail extends Component {
    private _prizePowerPoint: number = 0

    start() {

    }

    protected onEnable(): void {
        const powerNum = Constants.GAME_POWER_POINT_TYPE.success - User.instance().getLevel() * 10;
        const powerCount = math.absMax(50, powerNum);
        const power = math.randomRangeInt(powerCount - 10, powerCount + 11)
        this._prizePowerPoint = power
    }

    update(deltaTime: number) {
        
    }

    onNormalReceive() {
        const user = User.instance()
        const gold = Constants.GAME_PRIZE_TYPE.failNormal
        user.setGold(gold + user.getGold())
        user.setPowerPoint(user.getPowerPoint() - this._prizePowerPoint)
        user.setLosed()
        this.hideNode()
    }

    onMoreReceive() {
        // 调用分享接口
        activeShare()
        const user = User.instance()
        const gold = Constants.GAME_PRIZE_TYPE.failNormal
        user.setGold(gold * 5 + user.getGold())
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

