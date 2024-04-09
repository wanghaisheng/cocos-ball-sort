import { _decorator, Component, Label, math, Node } from 'cc';
import { User } from '../../utils/user';
import { Constants } from '../../utils/const';
const { ccclass, property } = _decorator;

@ccclass('PageSuccess')
export class PageSuccess extends Component {
    @property(Node)
    public tipLabel: Node = null

    @property(Node)
    public prizeGoldLabel: Node = null

    private _prizeGold: number = 0

    start() {

    }

    protected onEnable(): void {
        const prizeNum = Constants.GAME_PRIZE_TYPE.successNormal
        const gold = math.randomRangeInt(prizeNum - 10, prizeNum + 11)
        this._prizeGold = gold
        const step = Constants.gameManager.finishStep || 1

        // 显示金币
        this.prizeGoldLabel.getComponent(Label).string = gold.toString()
        this.tipLabel.getComponent(Label).string = `太棒了，本局共用了 ${step} 步`
    }

    update(deltaTime: number) {
        
    }

    onNormalReceive() {
        const user = User.instance()
        user.setGold(this._prizeGold + user.getGold())
        user.setLevel(user.getLevel() + 1)
        this.hideNode()
    }

    onMoreReceive() {
        // 调用分享接口
    }

    hideNode() {
        Constants.gameManager.init()
        this.node.active = false
    }
}

