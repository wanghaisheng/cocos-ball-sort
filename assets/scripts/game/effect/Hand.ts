import { _decorator, Component, math, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Hand')
export class Hand extends Component {
    
    minScale: number = 0.8; // 最小缩放比例
    maxScale: number = 1.2; // 最大缩放比例
    duration: number = 1; // 动画持续时间
    

    start() {

    }

    protected onEnable(): void {
        this.animateScale();
    }

    protected onDisable(): void {
        this.node.scale = new Vec3(this.minScale, this.minScale, 1);
    }

    update(deltaTime: number) {
        
    }

    animateScale() {
        tween(this.node)
            .to(this.duration, { scale: new Vec3(this.maxScale, this.maxScale, 1) }, { easing: 'sineInOut' })
            .to(this.duration, { scale: new Vec3(this.minScale, this.minScale, 1) }, { easing: 'sineInOut' })
            .union()
            .repeatForever()
            .start();
    }
}

