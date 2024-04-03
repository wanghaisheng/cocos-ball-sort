import { _decorator, Component, instantiate, Material, math, MeshRenderer, Node, Prefab, resources, Sprite, SpriteFrame, Texture2D, Vec3 } from 'cc';
import { Constants } from '../../utils/const';
import { PoolManager } from '../../utils/pool-manager';
import { getRandList } from '../../utils/util';
import { Ball } from './ball';
import { Tube } from '../tube/tube';
const { ccclass, property } = _decorator;

@ccclass('BallManager')
export class BallManager extends Component {
    @property(Prefab)
    prefab: Prefab = null

    @property
    buttomSpace: number = 0
    @property
    ballTypeMax: number = 0

    private _texturePrefix = 'ball-skin0'

    onLoad() {
        // this.loadAllTexture()
    }

    start() {
        
    }

    update(deltaTime: number) {
        
    }

    createBallList(tubeList: Tube[], ballCount: number) {
        const len = tubeList.length
        let ballTypeList: string[] = []
        let ballTypeCount = math.bits.min(len, this.ballTypeMax)
        if (len <= 0) return
        if (!ballTypeList.length) {
            for(let i = 1; i <= ballTypeCount; i++) {
                ballTypeList.push(this._texturePrefix + i)
            }
        }
        const exists = new Array(ballTypeList.length).fill(ballCount)
        for(let i = 0; i < ballTypeCount; i++) {
            const tube = tubeList[i]
            const pos = tube.getTubePosition()
            const tubeHeight = Tube.getTubeHeight(tube.getTubeType())
            // 底部的位置
            const bottomY = pos.y - tubeHeight / 2 + Constants.BALL_RADIUS + this.buttomSpace
            for(let j = 0; j < ballCount; j++) {
                // 纹理颜色随机，但生成相同的纹理个数有上限
                let randIndex = getRandList(exists)
                let ballType = ballTypeList[randIndex]
                
                // typeList[i][j] = ballType
                // 位置固定
                const y = bottomY + Constants.BALL_RADIUS * j
                const newPos = new Vec3(pos.x, y, pos.z)
                const ball = this._createBall(newPos, ballType)
                tube.pushBall(ball)
            }
        }
        // this._createBall(posList[0], this._texturePrefix + '1')
    }

    private _setMaterial(ball: Node, ballTexture: string) {
        // ball.addComponent(Sprite)
        // const ballTextPath = "ball/" + ballTexture
        // resources.load(ballTextPath, Texture2D, (err: any, texture: Texture2D) => {
        //     const spriteFrame = new SpriteFrame();
        //     spriteFrame.texture = texture;
        //     console.log('texture', texture)
        //     console.log('ball', ball)
        //     // ball.getComponent(Sprite).spriteFrame = spriteFrame;
        // });

        const ballTextPath = "ball/" + ballTexture
        const ballNode = ball ? ball.children[0] : null
        if (ballNode) {
            resources.load(ballTextPath, Material, (err, material) => {
                ballNode.getComponent(MeshRenderer).material = material;
            });
            // let material = this._ballTextureAssets.find(item => item.name === ballTexture)
            // if (!material) {
            //     material = this._ballTextureAssets[math.randomRangeInt(0, this._ballTextureAssets.length - 1)]
            // }
            // ballNode.getComponent(MeshRenderer).material = material
        }
    }

    private _createBall(pos: Vec3, ballTexture: string) {
        // const ball = instantiate(this.prefab)
        const ball = PoolManager.instance().getNode(this.prefab, this.node)
        this._setMaterial(ball, ballTexture)
        // ball.setParent(this.node)
        ball.setPosition(pos)
        const ballComp = ball.getComponent(Ball)
        ballComp.setBallProp(ballTexture)

        return ballComp
    }

    clearBalls() {
        const children = this.node.children
        if (children && children.length) {
            for(let i = children.length - 1; i >= 0; i--) {
                PoolManager.instance().putNode(children[i])
            }
        }
    }

}

