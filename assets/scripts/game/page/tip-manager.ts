import { _decorator, Component, Label, Node, tween, UIOpacity, UITransform, v2, v3, Vec3 } from 'cc';
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
    btnCloseModal: Node = null
    @property(Node)
    btnOkModal: Node = null

    _modalCBFunc: Function = null

    __preload() {
        Constants.tipManager = this
    }

    start() {
        this.hideLevelTip()
    }

    protected onEnable(): void {
        this.btnCloseModal.on(Node.EventType.TOUCH_END, this.hideModalOnly, this)
        this.btnOkModal.on(Node.EventType.TOUCH_END, this.hideModal, this)
    }

    protected onDisable(): void {
        this.btnCloseModal.off(Node.EventType.TOUCH_END, this.hideModalOnly, this)
        this.btnOkModal.off(Node.EventType.TOUCH_END, this.hideModal, this)
    }

    update(deltaTime: number) {

    }

    showTipLabel(tip: string, cb: Function = () => { }) {
        const labelNode = this.MsgTip.getChildByName('Label')
        const label = labelNode.getComponent(Label)
        labelNode.getComponent(UIOpacity).opacity = 255
        label.string = tip

        tween(this.MsgTip)
            .to(0.01, { position: new Vec3(0, 0, 0), scale: new Vec3(1, 1, 1) }, {
                easing: "smooth",
            })
            .call(() => {
                this.MsgTip.active = true
                this.hideTipLabel(cb)
            })
            .start()
    }

    hideTipLabel(cb: Function = () => {}) {
        tween(this.MsgTip)
            .delay(0.5)
            .to(0.5, { position: new Vec3(0, 0, 0), scale: new Vec3(0, 0, 0) }, {
                easing: "smooth",
            })
            .call(() => {
                this.MsgTip.active = false
                cb()
            })
            .start()
    }

    // showTipLabel(tip: string, cb: Function = () => { }) {
    //     const labelNode = this.MsgTip.getChildByName('Label')
    //     const label = labelNode.getComponent(Label)
    //     labelNode.getComponent(UIOpacity).opacity = 255
    //     label.string = tip

    //     tween(this.MsgTip)
    //         .to(0.01, { position: new Vec3(0, 0, 0), scale: new Vec3(1, 1, 1) })
    //         .call(() => {
    //             this.MsgTip.active = true
    //             this.hideTipLabel(cb)
    //         })
    //         .start()
    // }

    // hideTipLabel(cb: Function = () => { }) {

    //     const hideEffect = () => {
    //         const labelNode = this.MsgTip.getChildByName('Label')
    //         labelNode.getComponent(UIOpacity).opacity = 0
    //         let parentNode = this.MsgTip;

    //         // 获取原文字信息
    //         let labelComponent = labelNode.getComponent(Label);
    //         let text = labelComponent.string;
    //         let fontSize = labelComponent.fontSize;  // 字体大小

    //         // 计算文字节点宽度和字符间距
    //         // let totalWidth = text.length * fontSize;
    //         let contentSize = labelNode.getComponent(UITransform).contentSize;
    //         let startX = -contentSize.width / 2;  // 从左侧开始布局

    //         // 获取节点最左边的 X 坐标
    //         let leftX = -375 / 2;
    //         let rightX = 375 / 2;

    //         // 计算文字中间分割位置
    //         let midIndex = Math.floor(text.length / 2);

    //         // 左侧部分
    //         let leftText = text.slice(0, midIndex);
    //         // 右侧部分
    //         let rightText = text.slice(midIndex);

    //         // 创建左侧部分文字
    //         for (let i = 0; i < leftText.length; i++) {
    //             let charNode = new Node();
    //             let charLabel = charNode.addComponent(Label);
    //             charLabel.string = leftText[i];
    //             charLabel.fontSize = fontSize;
    //             charNode.position = v3(startX + i * fontSize, labelNode.position.y, 0);
    //             parentNode.addChild(charNode);

    //             tween(charNode)
    //                 .to(0.5 * (i + 1), { position: v3(leftX, labelNode.position.y, 0), scale: v3(2, 2, 2) }, {
    //                     easing: 'bounceOut'
    //                 })
    //                 .call(() => {
    //                     charNode.destroy();  // 动画完成后销毁节点
    //                 })
    //                 .start();
    //         }

    //         // 创建右侧部分文字
    //         let rightStartX = startX + leftText.length * fontSize;
    //         for (let i = 0; i < rightText.length; i++) {
    //             let charNode = new Node();
    //             let charLabel = charNode.addComponent(Label);
    //             charLabel.string = rightText[i];
    //             charLabel.fontSize = fontSize;
    //             charNode.position = v3(rightStartX + i * fontSize, labelNode.position.y, 0);
    //             parentNode.addChild(charNode);

    //             tween(charNode)
    //                 .parallel(
    //                     tween().to(1, { position: v3(rightX, labelNode.position.y, 0), scale: v3(2, 2, 2) }),
    //                     tween().to(1, { opacity: 0 })
    //                 )
    //                 .call(() => {
    //                     charNode.destroy();
                        
    //                     if (i === rightText.length - 1) {
    //                         this.MsgTip.active = false;
    //                         cb();
    //                     }
    //                 })
    //                 .start();
    //         }
    //     }

    //     hideEffect();
        


    //     // tween(this.MsgTip)
    //     //     .delay(0.5)
    //     //     .to(0.5, { position: new Vec3(0, 30, 0), scale: new Vec3(0, 0, 0) }, {
    //     //         easing: "fade",
    //     //     })
    //     //     .call(() => {
    //     //         this.MsgTip.active = false
    //     //         cb()
    //     //     })
    //     //     .start()
    // }

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
            .to(0.1, { position: new Vec3(500, 0, 0), scale: new Vec3(0.1, 0.1, 0.1) }, {
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
            .to(0.01, { position: new Vec3(0, 0, 0), scale: new Vec3(1, 1, 1) }, {
                easing: "bounceInOut",
            })
            .call(() => {
                this.CongratTip.active = true
                this.hideCongratTip(cb)
            })
            .start()
    }

    hideCongratTip(cb: Function = () => { }) {
        tween(this.CongratTip)
            .delay(2)
            .to(0.2, { position: new Vec3(120, -265, 0), scale: new Vec3(0.1, 0.1, 0.1) }, {
                easing: "bounceInOut",
            })
            .call(() => {
                this.CongratTip.active = false
                cb()
            })
            .start()
    }

    showModal(prop: {
        msg: string, 
        btnText?: string,
        showCloseIcon?: boolean, 
        confirm?: Function
    }) {
        const { msg, btnText = '确 定', showCloseIcon = true, confirm = () => {} } = prop || {}
        this.btnCloseModal.active = showCloseIcon
        const msgLabel = this.Modal.getChildByName('Content').getComponent(Label)
        const okLabel = this.btnOkModal.getChildByName('btnLabel').getComponent(Label)

        msgLabel.string = msg
        okLabel.string = btnText

        tween(this.Modal)
            .to(0.01, { position: new Vec3(0, 0, 0), scale: new Vec3(1, 1, 1) })
            .call(() => {
                this.Modal.active = true
                this._modalCBFunc = confirm
            })
            .start()
    }

    hideModal() {
        tween(this.Modal)
            .to(0.01, { position: new Vec3(0, 0, 0), scale: new Vec3(1, 1, 1) }, {
                easing: "fade",
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
            .to(0.01, { position: new Vec3(0, 0, 0), scale: new Vec3(1, 1, 1) }, {
                easing: "fade",
            })
            .call(() => {
                this.Modal.active = false
                this._modalCBFunc = null
            })
            .start()
    }



}

