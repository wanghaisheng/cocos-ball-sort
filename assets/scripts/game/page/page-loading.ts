import { _decorator, Component, director, log, Node, ProgressBar, Scene, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PageLoading')
export class PageLoading extends Component {
    @property(Node)
    progressRoot: Node = null

    @property(Node)
    ballNode: Node = null

    private _progress: number = 0;

    start() {
        const t = tween(this.ballNode)
        .to(0.8, { position: new Vec3(10, -110, 0), angle: 360 })
        .to(1.2, { position: new Vec3(0, 60, 0), angle: 360 })
        .to(0.8, { position: new Vec3(-10, -110, 0), angle: 360 })
        .to(1, { position: new Vec3(0, 40, 0), angle: 360 })
        .union() 
        .repeatForever()

        t.start()

        this.schedule(this.updateProgressNode, 0.5)
        director.preloadScene("sort", function () {
            log("Next scene preloaded");
        });
    }

    update(deltaTime: number) {
        
    }

    // 更新进度
    updateProgressNode() {
        const value = this._progress + 0.3
        this.progressRoot.getComponent(ProgressBar).progress = value
        if (value >= 1) {
            this.unschedule(this.updateProgressNode)
            director.loadScene("sort")
        } else {
            this._progress = value
        }
    }
}

