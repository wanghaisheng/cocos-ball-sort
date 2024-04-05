import { _decorator, Component, equals, instantiate, math, Node, resources, Sprite, SpriteFrame, Texture2D, tween, v3, Vec3 } from 'cc';
import { Constants } from '../../utils/const';
const { ccclass, property } = _decorator;

@ccclass('Ball')
export class Ball extends Component {

    public ballType: string = ''
    
    start() {

    }

    update(deltaTime: number) {

    }

    setBallProp(ballType: string, visible: boolean) {
        this.ballType = ballType
        this.node.active = visible
    }

    setVisible(visible: boolean) {
        this.node.active = visible
    }

    // 获取球的位置
    getBallPosition() {
        return this.node.position
    }

    setPosition(pos: Vec3) {
        this.node.setPosition(pos)
    }

    moveUp(pos: Vec3, isExceed: boolean = false) {
        const t = tween(this.node)
            .to(0.05, { position: pos })
            .delay(0.1)
        return isExceed ? t.start() : t
    }

    moveX(pos: Vec3, isExceed: boolean = false) {
        const t = tween(this.node)
            .to(0.05, { position: pos })
            .delay(0.1)
        return isExceed ? t.start() : t
    }

    moveDown(pos: Vec3, cb: Function, isExceed: boolean = false) {
        const t = tween(this.node)
            .to(0.05, { position: pos })
            .by(0.05, { position: new Vec3(0, 1, 0)})
            .by(0.05, { position: new Vec3(0, -1, 0)})
            // .by(0.05, { position: new Vec3(0, 0.8, 0)})
            // .by(0.05, { position: new Vec3(0, -0.8, 0)})
            .by(0.05, { position: new Vec3(0, 0.5, 0)})
            .by(0.05, { position: new Vec3(0, -0.5, 0)})
            .call(() => { cb() })
        return isExceed ? t.start() : t
    }

    jumpDown(pos: Vec3, cb: Function, isExceed: boolean = false) {
        const t = tween(this.node)
            .to(0.5, { position: pos }, { easing: "backIn" })
            .by(0.1, { position: new Vec3(0, 2, 0)})
            .by(0.1, { position: new Vec3(0, -2, 0)})
            .by(0.1, { position: new Vec3(0, 1, 0)})
            .by(0.1, { position: new Vec3(0, -1, 0)})
            .by(0.1, { position: new Vec3(0, 0.5, 0)})
            .by(0.1, { position: new Vec3(0, -0.5, 0)})
            .call(() => { cb() })
        return isExceed ? t.start() : t
    }

    moveBall(posList: Vec3[], cb: Function) {
        if (posList.length === 0) return
        const t1 = this.moveUp(posList[0])
        const t2 = this.moveX(posList[1])
        const t3 = this.moveDown(posList[2], cb)
        tween(this.node).sequence(t1, t2, t3).start()
    }
}

