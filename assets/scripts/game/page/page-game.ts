import { _decorator, Component, EventTouch, Input, input, Label, Node, ProgressBar, resources, Sprite, SpriteFrame } from 'cc';
import { Constants } from '../../utils/const';
import { User } from '../../utils/user';
const { ccclass, property } = _decorator;

@ccclass('PageGame')
export class PageGame extends Component {
    @property(Node)
    public goldLabel: Node = null
    @property(Node)
    public targetRoot: Node = null
    @property(Node)
    public progressRoot: Node = null
    @property(Node)
    public soundRoot: Node = null
    @property(Node)
    public pageShopRoot: Node = null

    private _isSupportSound: boolean = true
    private _user: User = null

    start() {
        this.init()
    }

    protected onEnable(): void {
        this.soundRoot.on(Node.EventType.TOUCH_END, this.onSound, this)
    }

    protected onDisable(): void {
        this.soundRoot.off(Node.EventType.TOUCH_END, this.onSound, this)
    }

    update(deltaTime: number) {
        
    }

    init() {
        const user = User.instance()
        this._user = user
        Constants.gameManager.init()
        // 更新用户金币
        this.refreshGold()
    }
    
    // 更新进度
    updateProgressNode(value: number, total: number) {
        this.targetRoot.getComponent(Label).string = `${value} / ${total}`
        this.progressRoot.getComponent(ProgressBar).progress = value / total
    }

    refreshGold() {
        this.goldLabel.getComponent(Label).string = this._user.getGold() + ''
    }

    // 重置
    onReset() {
        this.init()
    }

    // 声音
    onSound() {
        this._isSupportSound = !this._isSupportSound
        // Constants.audioManager.playBgm()
        // iconNode.spriteFrame = Constants.spriteFrameManager.getSpriteFrame('sound_on')
        // iconNode.spriteFrame = 
        // const url = 'texture/common/'+ this._isSupportSound ? 'icon-sound/icon-sound' : 'icon-sound01/icon-sound01';
        const url = 'texture/common/icon-sound-enabled/icon-sound-enabled'
        // const url = 'texture/common/icon-sound/icon-sound'
        // resources.load(url, SpriteFrame, (err: any, spriteFrame) => {
        //     console.log('spriteFrame', err, spriteFrame)
        //     if (spriteFrame) {
        //         const sprite = this.soundRoot.getChildByName('icon').getComponent(Sprite)
        //         sprite.spriteFrame = spriteFrame;
        //     }
        // });
        resources.load(url, SpriteFrame, (err, spriteFrame)=>{
            console.log('spriteFrame',err, spriteFrame)
        })
        // resources.load("texture/common/icon-sound/icon-sound", SpriteFrame, (err,spriteFrame)=>{
        //     console.log('spriteFrame',err,spriteFrame)
        // })
        // resources.load("texture/common/spriteFrame/spriteFrame", SpriteFrame, (err,spriteFrame)=>{
        //     console.log('spriteFrame',err,spriteFrame)
        // })
    }

    // 回退
    onWithdraw() {
        if (this._user.getWithdrawNum() < 1) {
            return this.onShop()
        }
        Constants.gameManager.returnBackLastStep(() => {
            console.log('回退成功')
            this._user.setWithdrawNum(this._user.getWithdrawNum() - 1)
            this._user.setGold(this._user.getGold() - Constants.PROP_PRICE.withdraw)
            this.refreshGold()
        })
    }

    // 清空
    onDissolve() {
        if (this._user.getDissolveNum() < 1) {
            return this.onShop()
        }
        Constants.gameManager.dissolveTube()
    }

    // 清空属于两个动作
    handleDissolveCB() {
        this._user.setDissolveNum(this._user.getDissolveNum() - 1)
        this._user.setGold(this._user.getGold() - Constants.PROP_PRICE.dissolve)
        this.refreshGold()
    }

    // 加管 
    onAddTube() {
        if (this._user.getAddTubeNum() < 1) {
            return this.onShop()
        }
        Constants.gameManager.addEmptyTube(() => {
            console.log('加管成功')
            this._user.setAddTubeNum(this._user.getAddTubeNum() - 1)
            this._user.setGold(this._user.getGold() - Constants.PROP_PRICE.addTube)
            this.refreshGold()
        })
    }

    // 派发球
    onDispatchBall() {
        Constants.gameManager.dispatchBall()
    }

    // 商店
    onShop() {
        this.pageShopRoot.active = true
    }
}

