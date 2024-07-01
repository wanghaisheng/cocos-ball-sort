import { _decorator, Button, Component, Label, Node } from 'cc';
import { User } from '../../data/user';
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
    public addTimeNumNode: Node = null
    @property(Node)
    public buyTimeCoinNode: Node = null
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
        this.buyTimeCoinNode.on(Node.EventType.TOUCH_END, this.buyTimeCoin, this)
        this.buyTubeCoinNode.on(Node.EventType.TOUCH_END, this.buyTubeCoin, this)
    }

    protected onDisable(): void {
        // 解绑事件
        // this.closeNode.off(Node.EventType.TOUCH_END, this.closePage, this)
        this.buyWithdrawCoinNode.off(Node.EventType.TOUCH_END, this.buyWithdrawCoin, this)
        this.buyDissolveCoinNode.off(Node.EventType.TOUCH_END, this.buyDissolveCoin, this)
        this.buyTimeCoinNode.off(Node.EventType.TOUCH_END, this.buyTimeCoin, this)
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
        this.addTimeNumNode.getComponent(Label).string = user.getAddTimeNum() + ''
        this.addTubeNumNode.getComponent(Label).string = user.getAddTubeNum() + ''

        const withdrawPrice = Constants.PROP_PRICE.withdraw
        const dissolvePrice = Constants.PROP_PRICE.dissolve
        const timePrice = Constants.PROP_PRICE.addTime
        const tubePrice = Constants.PROP_PRICE.addTube
        // 设置价格
        this.buyWithdrawCoinNode.getChildByName('coin').getComponent(Label).string = withdrawPrice + ''
        this.buyDissolveCoinNode.getChildByName('coin').getComponent(Label).string = dissolvePrice + ''
        this.buyTimeCoinNode.getChildByName('coin').getComponent(Label).string = timePrice + ''
        this.buyTubeCoinNode.getChildByName('coin').getComponent(Label).string = tubePrice + ''


        // 设置显示属性
        if (totalGold < Constants.PROP_PRICE.withdraw) {
            this.buyWithdrawCoinNode.getComponent(Button).interactable = false
        }

        if (totalGold < Constants.PROP_PRICE.dissolve) {
            this.buyDissolveCoinNode.getComponent(Button).interactable = false
        }

        if (totalGold < Constants.PROP_PRICE.addTime) {
            this.buyTimeCoinNode.getComponent(Button).interactable = false
        }

        if (totalGold < Constants.PROP_PRICE.addTube) {
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
        if (totalGold < Constants.PROP_PRICE.withdraw) {
            return
        }
        user.setGold(totalGold - Constants.PROP_PRICE.withdraw)
        user.setWithdrawNum(user.getWithdrawNum() + 1)
        this.init()
    }

    // 购买道具溶解
    buyDissolveCoin() {
        const user = User.instance()
        const totalGold = user.getGold()

        if (totalGold < Constants.PROP_PRICE.dissolve) {
            return
        }
        user.setGold(totalGold - Constants.PROP_PRICE.dissolve)
        user.setDissolveNum(user.getDissolveNum() + 1)
        this.init()
    }

    // 购买道具加时
    buyTimeCoin() {
        const user = User.instance()
        const totalGold = user.getGold()

        if (totalGold < Constants.PROP_PRICE.addTime) {
            return
        }
        user.setGold(totalGold - Constants.PROP_PRICE.addTime)
        user.setAddTimeNum(user.getAddTimeNum() + 1)
        this.init()
    }

    // 购买道具加管
    buyTubeCoin() {
        const user = User.instance()
        const totalGold = user.getGold()

        if (totalGold < Constants.PROP_PRICE.addTube) {
            return
        }
        user.setGold(totalGold - Constants.PROP_PRICE.addTube)
        user.setAddTubeNum(user.getAddTubeNum() + 1)
        this.init()
    }

}

