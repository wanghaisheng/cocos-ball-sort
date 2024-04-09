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

    getVisible() {
        return this.node.active
    }

    // 获取球的位置
    getBallPosition() {
        return this.node.position
    }

    setPosition(pos: Vec3) {
        this.node.setPosition(pos)
    }

    dissolve() {
        tween(this.node)
            .by(0.2, { position: new Vec3(0, 0, 0) }, { easing: "fade" })
            .to(0.3, { scale: new Vec3(0, 0, 0) }, { easing: "fade" })
            .call(() => {
                // 销毁节点
                this.node.destroy()
            }).start()
    }

    moveUp(pos: Vec3, delayTime: number = 0.1, isExceed: boolean = false) {
        const t = tween(this.node)
            .to(0.05, { position: pos })
            .delay(delayTime)
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

    jumpBall(posList: Vec3[], cb: Function) {
        if (posList.length === 0) return
        const taskList = []
        if (posList.length === 3) {
            taskList.push(this.moveUp(posList[0]))
            taskList.push(this.moveX(posList[1]))
            taskList.push(this.moveDown(posList[2], cb))
        }
        if (posList.length === 2) {
            taskList.push(this.moveUp(posList[0], 0.5))
            taskList.push(this.moveDown(posList[1], cb))
        }
        tween(this.node).sequence(...taskList).start()
    }

    // 派发球
    dispatchBallAction(pos: Vec3, cb: Function, isExceed: boolean = false) {
        const t = tween(this.node)
            .to(0.5, { position: pos, scale: new Vec3(2.5, 2.5, 2.5) }, { easing: "smooth" })
            .call(() => { cb() })
        return isExceed ? t.start() : t
    }
}

