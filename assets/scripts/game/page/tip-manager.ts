import { _decorator, Component, Label, Node, tween, UITransform, v3, Vec3 } from 'cc';
import { Constants } from '../../utils/const';
const { ccclass, property } = _decorator;

@ccclass('TipManager')
export class TipManager extends Component {
    @property(Node)
    MsgTip: Node = null

    @property(Node)
    LevelTip: Node = null

    @property(Node)
    CongratTip: Node = null

    @property(Node)
    Modal: Node = null
    @property(Node)
    closeModal: Node = null
    @property(Node)
    okModal: Node = null

    _modalCBFunc: Function = null

    __preload() {
        Constants.tipManager = this
    }

    start() {
        this.hideLevelTip()
    }

    protected onEnable(): void {
        this.closeModal.on(Node.EventType.TOUCH_END, this.hideModalOnly, this)
        this.okModal.on(Node.EventType.TOUCH_END, this.hideModal, this)
    }

    protected onDisable(): void {
        this.closeModal.off(Node.EventType.TOUCH_END, this.hideModalOnly, this)
        this.okModal.off(Node.EventType.TOUCH_END, this.hideModal, this)
    }

    update(deltaTime: number) {

    }

    showTipLabel(tip: string, cb: Function = () => { }) {
        const labelNode = this.MsgTip.getChildByName('Label')
        const label = labelNode.getComponent(Label)
        label.string = tip

        tween(this.MsgTip)
            .to(0.01, { position: new Vec3(0, 0, 0), scale: new Vec3(1, 1, 1) })
            .call(() => {
                this.MsgTip.active = true
                this.hideTipLabel(cb)
            })
            .start()
    }

    hideTipLabel(cb: Function = () => { }) {
        const labelNode = this.MsgTip.getChildByName('Label')
        let parentNode = this.MsgTip;

        // 获取原文字信息
        let labelComponent = labelNode.getComponent(Label);
        let text = labelComponent.string;
        let fontSize = labelComponent.fontSize;  // 字体大小

        // 计算文字节点宽度和字符间距
        // let totalWidth = text.length * fontSize;
        let contentSize = labelNode.getComponent(UITransform).contentSize;
        let startX = -contentSize.width / 2;  // 从左侧开始布局

        // 遍历文字内容，创建字符节点
        for (let i = 0; i < text.length; i++) {
            // 创建一个新的字符节点
            let charNode = new Node();
            let charLabel = charNode.addComponent(Label);
            charLabel.string = text[i];  // 设置字符内容
            charLabel.fontSize = fontSize;  // 保持原文字大小
            charNode.position = v3(startX + i * fontSize, labelNode.position.y, 0);  // 设置每个字符的初始位置
            parentNode.addChild(charNode);

            // 动画：向随机方向移动 + 透明度变化
            let randomX = 50 + Math.random() * 10;  // 随机 X 偏移
            let randomY = 3 + Math.random() * 10;       // 随机 Y 偏移
            tween(charNode)
                .parallel(
                    tween().to(1, { position: v3(charNode.position.x + randomX, charNode.position.y + randomY, 0) }),
                    tween().to(1, { opacity: 0 })
                )
                .call(() => {
                    charNode.destroy();  // 动画完成后销毁节点
                })
                .start();
        }


        // 隐藏原文字节点
        labelNode.active = false;
        cb()

        // tween(this.MsgTip)
        //     .delay(0.5)
        //     .to(0.5, { position: new Vec3(0, 30, 0), scale: new Vec3(0, 0, 0) }, {
        //         easing: "fade",
        //     })
        //     .call(() => {
        //         this.MsgTip.active = false
        //         cb()
        //     })
        //     .start()
    }

    showLevelTip(level: number, target: number = 0) {
        const label = this.LevelTip.getChildByName('Level').getComponent(Label)
        let str = `第 ${level} 关`
        if (target > 0) {
            str += `     目标 ${target}`
        }
        label.string = str

        tween(this.LevelTip)
            .to(0.01, { position: new Vec3(0, 0, 0), scale: new Vec3(1, 1, 1) })
            .call(() => {
                this.LevelTip.active = true
                this.hideLevelTip()
            })
            .start()
    }

    hideLevelTip() {
        tween(this.LevelTip)
            .delay(1.2)
            .to(0.2, { position: new Vec3(500, 0, 0), scale: new Vec3(0.1, 0.1, 0.1) }, {
                easing: "smooth",
            })
            .call(() => {
                this.LevelTip.active = false
            })
            .start()
    }

    showCongratTip(str: string, cb: Function = () => { }) {
        const label = this.CongratTip.getChildByName('Content').getComponent(Label)
        label.string = str

        tween(this.CongratTip)
            .to(0.01, { position: new Vec3(0, 0, 0), scale: new Vec3(1, 1, 1) })
            .call(() => {
                this.CongratTip.active = true
                this.hideCongratTip(cb)
            })
            .start()
    }

    hideCongratTip(cb: Function = () => { }) {
        tween(this.CongratTip)
            .delay(2)
            .to(0.2, { position: new Vec3(500, 0, 0), scale: new Vec3(0.1, 0.1, 0.1) }, {
                easing: "smooth",
            })
            .call(() => {
                this.CongratTip.active = false
                cb()
            })
            .start()
    }

    showModal(str: string, cb: Function = () => { }) {
        const label = this.Modal.getChildByName('Content').getComponent(Label)
        label.string = str

        tween(this.Modal)
            .to(0.01, { position: new Vec3(0, 0, 0), scale: new Vec3(1, 1, 1) })
            .call(() => {
                this.Modal.active = true
                this._modalCBFunc = cb
            })
            .start()
    }

    hideModal() {
        tween(this.Modal)
            .to(0.2, { position: new Vec3(500, 0, 0), scale: new Vec3(0.1, 0.1, 0.1) }, {
                easing: "smooth",
            })
            .call(() => {
                this.Modal.active = false
                if (this._modalCBFunc) {
                    this._modalCBFunc()
                    this._modalCBFunc = null
                }
            })
            .start()
    }

    hideModalOnly() {
        tween(this.Modal)
            .to(0.2, { position: new Vec3(500, 0, 0), scale: new Vec3(0.1, 0.1, 0.1) }, {
                easing: "smooth",
            })
            .call(() => {
                this.Modal.active = false
                this._modalCBFunc = null
            })
            .start()
    }



}

