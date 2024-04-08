import { _decorator, Component, EventTouch, Input, input, Label, Node, ProgressBar } from 'cc';
import { Constants } from '../../utils/const';
import { User } from '../../utils/user';
const { ccclass, property } = _decorator;

@ccclass('PageGame')
export class PageGame extends Component {
    @property(Node)
    public goldLabel: Node = null
    @property(Node)
    public levelRoot: Node = null
    @property(Node)
    public targetRoot: Node = null
    @property(Node)
    public progressRoot: Node = null
    @property(Node)
    public pageShopRoot: Node = null

    start() {
        this.init()
    }

    update(deltaTime: number) {
        
    }

    init() {
        const user = User.instance()
        Constants.gameManager.init()
        // 更新用户金币
        this.refreshGold()
        // 更新等级
        this.levelRoot.getComponent(Label).string = user.getLevel() + ''
    }
    
    // 更新进度
    updateProgressNode(value: number, total: number) {
        this.targetRoot.getComponent(Label).string = `${value} / ${total}`
        this.progressRoot.getComponent(ProgressBar).progress = value / total
    }

    refreshGold() {
        const user = User.instance()
        this.goldLabel.getComponent(Label).string = user.getGold() + ''
    }

    // 重置
    onReset() {
        this.init()
    }

    // 声音
    onSound() {

    }

    // 回退
    onWithdraw() {
        Constants.gameManager.returnBackLastStep(() => {
            console.log('回退成功')
        })
    }

    // 溶解
    onDissolve() {
        Constants.gameManager.dissolveTube()
    }

    // 加管 
    onAddTube() {
        Constants.gameManager.addEmptyTube(() => {
            console.log('加管成功')
        })
    }

    // 商店
    onShop() {
        this.pageShopRoot.active = true
    }
}

