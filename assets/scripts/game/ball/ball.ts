import { _decorator, Component, equals, instantiate, math, Node, resources, Sprite, SpriteFrame, Texture2D, v3, Vec3 } from 'cc';
import { Constants } from '../../utils/const';
const { ccclass, property } = _decorator;

@ccclass('Ball')
export class Ball extends Component {

    ballType: string = ''

    private _gravity: number = 10
    private _vy: number = 100
    private _vx: number = 100
    private _jumpTime: number = 0
    private _passTime: number = 0
    private _isMoving: boolean = false
    private _moveType: string = Constants.BALL_JUMP_TYPE.UP

    
    start() {

    }

    update(deltaTime: number) {
        let dt = deltaTime
        if (this._isMoving === false) {
            return
        }

        this._passTime += dt
        if (this._passTime > this._jumpTime) {
            dt -= this._passTime - this._jumpTime 
        }

        const pos = this.node.getPosition()
        if (this._moveType === Constants.BALL_JUMP_TYPE.UP) {
            pos.y += this._vy * dt
            // pos.y += (this._vy * dt - 0.5 * this._gravity * dt * dt)
            // this._vy -= this._gravity * dt
        }
        if (this._moveType === Constants.BALL_JUMP_TYPE.DOWN) {
            pos.y -= this._vy * dt
            // pos.y -= (this._vy * dt + 0.5 * this._gravity * dt * dt)
            // this._vy -= this._gravity * dt
        }
        if (this._moveType === Constants.BALL_JUMP_TYPE.MOVE_LEFT) {
            pos.x -= this._vx * dt
        }
        if (this._moveType === Constants.BALL_JUMP_TYPE.MOVE_RIGHT) {
            pos.x += this._vx * dt
        }

        this.node.setPosition(pos)
        // console.log('pos', pos)
        if (this._passTime >= this._jumpTime) {// 跳跃完成
            this._isMoving = false
            Constants.gameManager.JumpBall(this)
        }
    }

    // 小球跳跃
    jumpBall(dst: Vec3, moveType: string) {
        if (this._isMoving) {
            return
        }
        const pos = this.node.getPosition()
        const tx = Math.abs(dst.x - pos.x) / this._vx
        const ty = Math.abs(dst.y - pos.y) / this._vy

        

        if (equals(dst.x, pos.x) && equals(dst.y, pos.y)) {
            this._isMoving = false
            return
        }
        
        if (Constants.BALL_JUMP_TYPE.DOWN === moveType || Constants.BALL_JUMP_TYPE.UP === moveType) {
            this._jumpTime =  ty
        } else {
            this._jumpTime =  tx
        }

        this._moveType = moveType
        this._isMoving = true
        this._passTime = 0
        console.log('ddd', this._moveType, pos, dst)
    }

    setBallProp(ballType: string) {
        this.ballType = ballType
    }

    // 获取球的位置
    getBallPosition() {
        return this.node.position
    }

}

