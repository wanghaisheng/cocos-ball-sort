import { _decorator, Component, Label, Node, NodeEventType } from 'cc';
const { ccclass, property } = _decorator;

export interface IHistItem {
    /** 第几关 */
    level: number;
    /** 用时 */
    time: number;
    /** 步数 */
    step: number;
    /** 获得战力 */
    power: number;
}

@ccclass('HistItem')
export class HistItem extends Component {
    @property(Node)
    levelNode: Node = null
    @property(Node)
    timeNode: Node = null
    @property(Node)
    stepNode: Node = null
    @property(Node)
    powerNode: Node = null

    @property(Node)
    btnRetry: Node = null

    public level: number = 0
    public time: number = 0
    public step: number = 0
    public power: number = 0

    start() {

    }

    protected onEnable(): void {
        this.btnRetry.on(Node.EventType.TOUCH_END, this.onRetry, this)
    }

    protected onDisable(): void {
        this.btnRetry.off(Node.EventType.TOUCH_END, this.onRetry, this)
    }

    update(deltaTime: number) {

    }

    setItemProp(prop?: IHistItem) {
        this.level = prop.level || 1
        this.time = prop.time || 0
        this.step = prop.step || 0
        this.power = prop.power || 0
        this.updateItemInfo()
    }

    updateItemInfo() {
        this.levelNode.getComponent(Label).string = this.level.toString()
        this.timeNode.getComponent(Label).string = this.time.toString() + ' 秒'
        this.stepNode.getComponent(Label).string = this.step.toString()
        this.powerNode.getComponent(Label).string = this.power.toString()
    }

    onRetry() {
        
    }
}

