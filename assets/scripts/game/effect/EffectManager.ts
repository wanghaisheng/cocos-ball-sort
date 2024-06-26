import { _decorator, Component, Node, ParticleSystem2D, Vec3 } from 'cc';
import { Constants } from '../../utils/const';
const { ccclass, property } = _decorator;

@ccclass('EffectManager')
export class EffectManager extends Component {
    @property(Node)
    public flowerNode: Node = null

    __preload () {
        Constants.effectManager = this
    }
 
    start () {
        
    }

    public playFlowerEffect(pos: Vec3) {
        if (!this.flowerNode) return
        // console.log('pos', pos)
        this.flowerNode.setPosition(pos)
        this.flowerNode.active = true
        this.flowerNode.getComponent(ParticleSystem2D).resetSystem()
    }
 }

