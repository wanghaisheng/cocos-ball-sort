import { _decorator, Component, instantiate, Material, math, MeshRenderer, Node, Prefab, resources, Sprite, SpriteFrame, Texture2D, tween, Vec3 } from 'cc';
import { Constants } from '../../utils/const';
import { PoolManager } from '../../utils/pool-manager';
import { getBallOnTubeY, getRandList } from '../../utils/util';
import { Ball } from './ball';
import { Tube } from '../tube/tube';
import { BallControl } from './ball-control';
const { ccclass, property } = _decorator;

@ccclass('BallManager')
export class BallManager extends Component {
    @property(Prefab)
    prefab: Prefab = null

    @property
    buttomSpace: number = 0

    public validTubeCount: number = 0

    private _materialAssetsPrefix = 'ball/'
    private _texturePrefix = 'ball-skin0'
    private _BottomY: number = 0 

    onLoad() {
        // this.loadAllTexture()
    }

    start() {
        
    }

    update(deltaTime: number) {
        
    }

    createBallList(tubeList: Tube[], ballCount: number, ballTypeNum: number) {
        const len = tubeList.length
        let ballTypeList = this.getBallTypeList([0, ballTypeNum - 1])
        // let ballTypeCount = math.bits.min(len, Constants.BALL_TYPE_MAX)
        const ballTypeCount = len
        if (len <= 0) return
        // 有效的试管个数
        this.validTubeCount = ballTypeCount
        const validBallCount = tubeList[0] && tubeList[0].ballCountMax <= ballCount ? tubeList[0].ballCountMax : ballCount
        const exists = new Array(ballTypeList.length).fill(validBallCount)
        for(let i = 0; i < ballTypeCount; i++) {
            const tube = tubeList[i]
            const pos = tube.getTubePosition()
            const tubeHeight = tube.getTubeHeight()
            // const initY = getBallOnTubeY(pos.y, tubeHeight)
            // 底部的位置
            const bottomY = this.getBottomY(pos.y, tubeHeight)
            for(let j = 0; j < validBallCount; j++) {
                // 纹理颜色随机，但生成相同的纹理个数有上限
                let randIndex = getRandList(exists)
                let ballType = ballTypeList[randIndex]
                
                // 位置固定
                const y = bottomY + Constants.BALL_RADIUS * j
                // const initPos = new Vec3(pos.x, initY, pos.z)
                const newPos = new Vec3(pos.x, y, pos.z)
                const ball = this._createBall(newPos, ballType)
                tube.pushBall(ball)
            }
            if (tube.isAllSameTube()) {
                console.log('生成颜色完全相同')
                // tube.setIsFinish(true)
            }
        }
    }

    dispatchBall(ballControl: BallControl, totalCount: number, ballTypeNum: number, tubeList: Tube[], cb: Function) {
        // 有效试管
        let targetTubeList = this.getDispatchTubeList(totalCount, tubeList)
        let ballCount = totalCount
        if (targetTubeList === null) {// 有效位置已经不够
            targetTubeList = tubeList.filter(item => !item.isFull())
            ballCount = targetTubeList.reduce((pre, cur) => pre + cur.getEmptyBallCount(), 0)
        }
        const tubeLen = targetTubeList.length
        // 发球个数，颜色个数
        const dispatchBallList = this.createDispatchBallList(ballCount, ballTypeNum)
        // 塞入试管，并查找每个球的目标位置
        const newPosList = []
        for(let i = 0; i < dispatchBallList.length; i++) {
            const ball = dispatchBallList[i]
            let loopCount = 0
            let index = i % tubeLen
            let targetTube = targetTubeList[index]
            while (targetTube.isFull()) {
                index++
                loopCount++
                if (index >= tubeLen) {
                    index = 0
                }
                if (loopCount > 2 * tubeLen) {// 理论上不会出现，但防止死循环做一次判断
                    break
                }
                targetTube = targetTubeList[index]
            }
            if (targetTube.isFull()) {
                console.warn('dispatch ball error')
                // 放弃本次派发，并清空已创建的球，防止内存泄露
                return dispatchBallList.map(item => {
                    item.node.destroy()
                })
            }
            const pos = targetTube.getTubePosition()
            const posX = pos.x
            const posY = ballControl.getDownBallPosY(this, targetTube)
            newPosList.push(new Vec3(posX, posY, 0))
            // 先塞入，但不设置球位置
            targetTube.pushBall(ball)
        }
        // 设置每个球的目标位置
        dispatchBallList.forEach((item, index) => {
            if (index === dispatchBallList.length - 1) {
                item.dispatchBallAction(newPosList[index], cb, true)
            } else {
                item.dispatchBallAction(newPosList[index], () => {}, true)
            }
        })
    }

    // 找出有效试管
    getDispatchTubeList(totalCount: number, tubeList: Tube[]) {
        // 先找非空的
        const primaryTubeList = tubeList.filter(item => item.haveBallNotFull())
        if (primaryTubeList.length >= totalCount) {
            return primaryTubeList.slice(0, totalCount + 1)
        }
        const num = primaryTubeList.reduce((pre, cur) => pre + cur.getEmptyBallCount(), 0)
        if (num >= totalCount) {
            return primaryTubeList
        }
        // 开始找空试管
        const emptyTubeList = tubeList.filter(item => item.isEmpty())
        let total = num, emptyList = []
        for(let i = 0; i < emptyTubeList.length; i++) {
            total += emptyTubeList[i].ballCountMax
            if (total >= totalCount) {
                emptyList = emptyTubeList.slice(0, i + 1)
                return primaryTubeList.concat(emptyList)
            }
        }
        return null
    }

    createDispatchBallList(ballCount: number, ballTypeNum: number) {
        const ballList: Ball[] = []
        const ballTypeList = this.getBallTypeList([0, ballTypeNum -1])
        for(let i = 0; i < ballCount; i++) {
            // 起始位置，大概是派发按钮的位置
            const initPos = new Vec3(6, -15, 0)
            const ballType = ballTypeList[i % ballTypeList.length]
            const ball = this._createBall(initPos, ballType, true)
            ball.node.setScale(new Vec3(0.1, 0.1, 0.1))
            ballList.push(ball)
        }
        return ballList
    }

    // 获取材质类型
    getBallTypeList(typeIndexRange: number[]) {
        const ballTypeList: string[] = []
        const [min, max] = typeIndexRange
        for(let i = min; i <= max; i++) {
            let j = i % Constants.BALL_TYPE_MAX
            j = j === 0 ? Constants.BALL_TYPE_MAX : j
            ballTypeList.push(this._texturePrefix + j)
        }
        return ballTypeList
    }

    getBottomY(tubeY: number, tubeHeight: number) {
        return tubeY - tubeHeight / 2 + Constants.BALL_RADIUS + this.buttomSpace
    }

    private _setMaterial(ball: Node, ballTexture: string) {

        const ballTextPath = this._materialAssetsPrefix + ballTexture
        const ballNode = ball ? ball.children[0] : null
        if (ballNode) {
            resources.load(ballTextPath, Material, (err, material) => {
                ballNode.getComponent(MeshRenderer).material = material;
            });
        }
    }

    private _createBall(pos: Vec3, ballTexture: string, visible: boolean = false) {
        const ball = instantiate(this.prefab)
        // const ball = PoolManager.instance().getNode(this.prefab, this.node)
        this._setMaterial(ball, ballTexture)
        ball.setParent(this.node)
        ball.setPosition(pos)
        const ballComp = ball.getComponent(Ball)
        ballComp.setBallProp(ballTexture, visible)

        return ballComp
    }

    clearBalls() {
        const children = this.node.children
        if (children && children.length) {
            for(let i = children.length - 1; i >= 0; i--) {
                // PoolManager.instance().putNode(children[i])
                children[i].removeFromParent()
            }
        }
    }

}

