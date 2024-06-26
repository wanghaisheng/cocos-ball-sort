import { _decorator, Component, Label, Node, tween, Vec3 } from 'cc';
import { Constants } from '../../utils/const';
const { ccclass, property } = _decorator;

@ccclass('TipManager')
export class TipManager extends Component {
    @property(Node)
    MsgTip: Node = null

    @property(Node)
    LevelTip: Node = null

    __preload () {
        Constants.tipManager = this
    }

    start() {
        this.hideLevelTip()
    }

    update(deltaTime: number) {
        
    }

    showTipLabel(tip: string, cb: Function = () => {}) {
        const label = this.MsgTip.getComponent(Label)
        label.string = tip
        
        tween(this.MsgTip)
        .to(0.01, { position: new Vec3(0, 0, 0), scale: new Vec3(1, 1, 1) }) 
        .call(() => {
            this.MsgTip.active = true
            this.hideTipLabel(cb)
        })
        .start()
    }
    
    hideTipLabel(cb: Function = () => {}) {
        tween(this.MsgTip)
        .delay(1)
        .to(0.5, { position: new Vec3(0, 30, 0), scale: new Vec3(0, 0, 0) }, { 
            easing: "fade",
        }) 
        .call(() => {
            this.MsgTip.active = false
            cb()
        })
        .start()
    }

    showLevelTip(level: number, target: number) {
        const label = this.LevelTip.getChildByName('Level').getComponent(Label)
        label.string = `第 ${level} 关     目标 ${target}`
        
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

}

