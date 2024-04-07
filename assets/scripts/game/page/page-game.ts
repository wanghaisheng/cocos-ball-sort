import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {
    @property(Node)
    public bloodFace: Node = null
    @property(Node)
    public bloodRoot: Node = null

    start() {

    }

    update(deltaTime: number) {
        
    }

    init() {
        // this.bloodRoot.active = true
        // // this.bloodFace.setScale(1, 1, 1)
        // this.bloodFace.setScale(0.3 / 1, 1, 1)
    }
}

