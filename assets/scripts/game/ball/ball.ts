import { _decorator, Component, instantiate, Node, resources, Sprite, SpriteFrame, Texture2D, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Ball')
export class Ball extends Component {
    
    start() {

    }

    update(deltaTime: number) {
        
    }

    generateBall(pos: Vec3) {
        // const randZ = math.randomRangeInt(0, 5)
        // const newBall = instantiate(this.ball)
        // newBall.setPosition(pos)
        // this.Tubes.addChild(newTube)
    }

    setTexture(ballTexture: string) {
        const ballTextPath = "ball/" + ballTexture
        resources.load(ballTextPath, Texture2D, (err: any, texture: Texture2D) => {
            const spriteFrame = new SpriteFrame();
            spriteFrame.texture = texture;
            this.node.getComponent(Sprite).spriteFrame = spriteFrame;
        });
    }

    createBall(pos: Vec3, ballTexture: string) {
    //    const enemy = instantiate(prefab)
    //     enemy.setParent(this.node)
    //     const enemy = PoolManager.instance().getNode(prefab, this.bulletRoot)
    //     const randX = math.randomRangeInt(-23, 23)
    //     enemy.setPosition(randX, 0, -50)
    //     const enemyComp = enemy.getComponent(EnemyPlane)
    //     enemyComp.setEnemySpeed(this, speed, true)
    }
 
    removeBall() {
        // const children = this.Tubes.children
        // if (children && children.length) {
        //     for(let i = 0; i < children.length; i++) {
        //         this.Tubes.children[0].removeFromParent()
        //     }
        // }
    }
}

