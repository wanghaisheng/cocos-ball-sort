import { _decorator, Button, Color, Component, Label, Node, Sprite } from 'cc';
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
    public btnToolTab: Node = null
    @property(Node)
    public btnThemeTab: Node = null

    @property(Node)
    public toolTab: Node = null
    @property(Node)
    public themeTab: Node = null

    start() {

    }

    protected onEnable(): void {
        this.showToolTab()
        this.refreshGold()
        // 绑定事件
        this.btnToolTab.on(Node.EventType.TOUCH_END, this.showToolTab, this)
        this.btnThemeTab.on(Node.EventType.TOUCH_END, this.showThemeTab, this)
        Constants.eventTarget.on(Constants.EventName.UPDATE_GOLD_LABEL, this.refreshGold, this)
        Constants.eventTarget.on(Constants.EventName.COLOSE_SHOP_PAGE, this.closePage, this)
    }

    protected onDisable(): void {
        // 解绑事件
        this.btnToolTab.off(Node.EventType.TOUCH_END, this.showToolTab, this)
        this.btnThemeTab.off(Node.EventType.TOUCH_END, this.showThemeTab, this)
        Constants.eventTarget.off(Constants.EventName.UPDATE_GOLD_LABEL, this.refreshGold, this)
        Constants.eventTarget.off(Constants.EventName.COLOSE_SHOP_PAGE, this.closePage, this)
    }

    update(deltaTime: number) {
        
    }

    refreshGold() {
        // 设置属性  
        this.goldLabel.getComponent(Label).string = User.instance().getGold() + ''
    }

    closePage() {
        this.node.active = false
    }

    showToolTab() {
        this.toolTab.active = true
        this.themeTab.active = false
        this.setNodeOpacity(this.btnToolTab, 255)
        this.setNodeOpacity(this.btnThemeTab, 100)
    }

    showThemeTab() {
        this.toolTab.active = false
        this.themeTab.active = true
        this.setNodeOpacity(this.btnToolTab, 100)
        this.setNodeOpacity(this.btnThemeTab, 255)
    }

    setNodeOpacity(node: Node, opacity: number) {
        if (!node) return
        node.getComponent(Sprite).color = new Color(63, 251, 255, opacity)
    }

}

