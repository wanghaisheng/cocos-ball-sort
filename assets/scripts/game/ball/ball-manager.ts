import { _decorator, Component, instantiate, Material, math, MeshRenderer, Node, Prefab, resources, Sprite, SpriteFrame, Texture2D, Vec3 } from 'cc';
import { Constants } from '../../utils/const';
const { ccclass, property } = _decorator;

@ccclass('BallManager')
export class BallManager extends Component {
    @property(Prefab)
    prefab: Prefab = null

    // private _ballTextureAssets: Material[] = []
    private _texturePrefix = 'ball-skin0'
    private BALL_TYPE_MAX = 3

    onLoad() {
        // this.loadAllTexture()
    }

    start() {
        
    }

    update(deltaTime: number) {
        
    }

    createBallList(posList: Vec3[], num: number, textures: string[] = []) {
        const len = posList.length
        let textureList = textures
        if (len <= 0) return
        if (!textureList.length || len !== textures.length) {
            let n = math.bits.min(len, this.BALL_TYPE_MAX)
            for(let i = 1; i <= n; i++) {
                textureList.push(this._texturePrefix + i)
            }
        }
        const exists = new Array(textureList.length)
        for(let i = 0; i < len; i++) {
            const pos = posList[i]
            for(let j = 0; j < Constants.BALL_NUM; j++) {
                // 纹理颜色随机，但生成相同的纹理个数有上限
                let randIndex = this._getRand(exists, Constants.BALL_NUM)
                let texture = textureList[randIndex]
                
                // 位置固定
                let y = pos.y + 0.2
                if (j > 1) {
                    y -= (Constants.BALL_CALIBER * (j-1))
                } else {
                    y += (Constants.BALL_CALIBER * j)
                }
                const newPos = new Vec3(pos.x, y, pos.z)
                this._createBall(newPos, texture)
            }
        }
        // this._createBall(posList[0], this._texturePrefix + '1')
    }

    private _getRand(arr: any[], max: number) {
        let i = math.randomRangeInt(0, arr.length)
        if (!arr[i]) {
            arr[i] = 1
        } else {
            arr[i]++
        }
        if (arr[i] && arr[i] > max) {
            return this._getRand(arr, max)
        }
        return i
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
        const ball = instantiate(this.prefab)
        this._setMaterial(ball, ballTexture)
        ball.setParent(this.node)
        ball.setPosition(pos)
    }

}

