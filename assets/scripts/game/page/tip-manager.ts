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

    showMsgTip(msg: string, cb: Function = () => {}) {
        const label = this.LevelTip.getChildByName('Level').getComponent(Label)
        label.string = msg

        tween(this.LevelTip)
            .to(0.01, { position: new Vec3(0, 0, 0), scale: new Vec3(1, 1, 1) })
            .call(() => {
                this.LevelTip.active = true
                this.hideLevelTip(cb)
            })
            .start()
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

    hideLevelTip(cb: Function = () => {}) {
        tween(this.LevelTip)
            .delay(1.2)
            .to(0.1, { position: new Vec3(500, 0, 0), scale: new Vec3(0.1, 0.1, 0.1) }, {
                easing: "smooth",
            })
            .call(() => {
                this.LevelTip.active = false
                cb()
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

