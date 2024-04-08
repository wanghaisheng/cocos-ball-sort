import { _decorator, Button, Component, Label, Node } from 'cc';
import { User } from '../../utils/user';
import { Constants } from '../../utils/const';
const { ccclass, property } = _decorator;

@ccclass('PageShop')
export class PageShop extends Component {
    @property(Node)
    public goldLabel: Node = null
    @property(Node)
    public closeNode: Node = null
    @property(Node)
    public withdrawNumNode: Node = null
    @property(Node)
    public buyWithdrawCoinNode: Node = null
    @property(Node)
    public dissolveNumNode: Node = null
    @property(Node)
    public buyDissolveCoinNode: Node = null
    @property(Node)
    public addTubeNumNode: Node = null
    @property(Node)
    public buyTubeCoinNode: Node = null

    start() {

    }

    protected onEnable(): void {
        this.init()
        // 绑定事件
        // this.closeNode.on(Node.EventType.TOUCH_END, this.closePage, this)
        this.buyWithdrawCoinNode.on(Node.EventType.TOUCH_END, this.buyWithdrawCoin, this)
        this.buyDissolveCoinNode.on(Node.EventType.TOUCH_END, this.buyDissolveCoin, this)
        this.buyTubeCoinNode.on(Node.EventType.TOUCH_END, this.buyTubeCoin, this)
    }

    protected onDisable(): void {
        // 解绑事件
        // this.closeNode.off(Node.EventType.TOUCH_END, this.closePage, this)
        this.buyWithdrawCoinNode.off(Node.EventType.TOUCH_END, this.buyWithdrawCoin, this)
        this.buyDissolveCoinNode.off(Node.EventType.TOUCH_END, this.buyDissolveCoin, this)
        this.buyTubeCoinNode.off(Node.EventType.TOUCH_END, this.buyTubeCoin, this)
    }

    update(deltaTime: number) {
        
    }

    init() {
        const user = User.instance()
        const totalGold = user.getGold()
        // 设置属性  
        this.goldLabel.getComponent(Label).string = user.getGold() + ''
        this.withdrawNumNode.getComponent(Label).string = user.getWithdrawNum() + ''
        this.dissolveNumNode.getComponent(Label).string = user.getDissolveNum() + ''
        this.addTubeNumNode.getComponent(Label).string = user.getAddTubeNum() + ''

        const withdrawPrice = Constants.PROP_COIN.withdraw
        const dissolvePrice = Constants.PROP_COIN.dissolve
        const tubePrice = Constants.PROP_COIN.addTube
        // 设置价格
        this.buyWithdrawCoinNode.getChildByName('coin').getComponent(Label).string = withdrawPrice + ''
        this.buyDissolveCoinNode.getChildByName('coin').getComponent(Label).string = dissolvePrice + ''
        this.buyTubeCoinNode.getChildByName('coin').getComponent(Label).string = tubePrice + ''


        // 设置显示属性
        if (totalGold < Constants.PROP_COIN.withdraw) {
            this.buyWithdrawCoinNode.getComponent(Button).interactable = false
        }

        if (totalGold < Constants.PROP_COIN.dissolve) {
            this.buyDissolveCoinNode.getComponent(Button).interactable = false
        }

        if (totalGold < Constants.PROP_COIN.addTube) {
            this.buyTubeCoinNode.getComponent(Button).interactable = false
        }
        
    } 

    closePage() {
        this.node.active = false
    }

    // 购买道具回退
    buyWithdrawCoin() {
        const user = User.instance()
        const totalGold = user.getGold()
        if (totalGold < Constants.PROP_COIN.withdraw) {
            return
        }
        user.setGold(totalGold - Constants.PROP_COIN.withdraw)
        user.setWithdrawNum(user.getWithdrawNum() + 1)
        this.init()
    }

    // 购买道具溶解
    buyDissolveCoin() {
        const user = User.instance()
        const totalGold = user.getGold()

        if (totalGold < Constants.PROP_COIN.dissolve) {
            return
        }
        user.setGold(totalGold - Constants.PROP_COIN.dissolve)
        user.setDissolveNum(user.getDissolveNum() + 1)
        this.init()
    }

    // 购买道具加管
    buyTubeCoin() {
        const user = User.instance()
        const totalGold = user.getGold()

        if (totalGold < Constants.PROP_COIN.addTube) {
            return
        }
        user.setGold(totalGold - Constants.PROP_COIN.addTube)
        user.setAddTubeNum(user.getAddTubeNum() + 1)
        this.init()
    }

}

