import { _decorator, Component, instantiate, Node, resources, Sprite, SpriteFrame, Texture2D, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Ball')
export class Ball extends Component {

    ballType: string = ''
    
    start() {

    }

    update(deltaTime: number) {
        
    }

    setBallProp(ballType: string) {
        this.ballType = ballType
    }

    // 获取球的位置
    getBallPosition() {
        return this.node.position
    }

    // 球弹出
    ballPop(h: number) {
        let pos = this.node.getPosition()
        pos.y += h
        this.node.setPosition(pos)
    }

    // 球沉
    ballPush(h: number) {
        let pos = this.node.getPosition()
        pos.y -= h
        this.node.setPosition(pos)
    }

    // 移动球
    moveBall(x: number) {
        let pos = this.node.getPosition()
        pos.x += x
        this.node.setPosition(pos)
    }
}

