import { _decorator, Component, EventTouch, Input, input, Label, Node, ProgressBar, resources, Sprite, SpriteFrame } from 'cc';
import { Constants } from '../../utils/const';
import { User } from '../../utils/user';
const { ccclass, property } = _decorator;

@ccclass('PageGame')
export class PageGame extends Component {
    @property(Node)
    public goldLabel: Node = null
    @property(Node)
    public levelRoot: Node = null
    @property(Node)
    public targetRoot: Node = null
    @property(Node)
    public progressRoot: Node = null
    @property(Node)
    public soundRoot: Node = null
    @property(Node)
    public pageShopRoot: Node = null

    private _isSupportSound: boolean = true

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
        Constants.gameManager.init()
        // 更新用户金币
        this.refreshGold()
        // 更新等级
        this.levelRoot.getComponent(Label).string = user.getLevel() + ''
    }
    
    // 更新进度
    updateProgressNode(value: number, total: number) {
        this.targetRoot.getComponent(Label).string = `${value} / ${total}`
        this.progressRoot.getComponent(ProgressBar).progress = value / total
    }

    refreshGold() {
        const user = User.instance()
        this.goldLabel.getComponent(Label).string = user.getGold() + ''
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
        const url = 'texture/common/icon-sound/icon-sound'
        // resources.load(url, SpriteFrame, (err: any, spriteFrame) => {
        //     console.log('spriteFrame', err, spriteFrame)
        //     if (spriteFrame) {
        //         const sprite = this.soundRoot.getChildByName('icon').getComponent(Sprite)
        //         sprite.spriteFrame = spriteFrame;
        //     }
        // });
        resources.load("texture/common/spriteFrame", SpriteFrame, (err,spriteFrame)=>{
            console.log('spriteFrame',err,spriteFrame)
        })
    }

    // 回退
    onWithdraw() {
        Constants.gameManager.returnBackLastStep(() => {
            console.log('回退成功')
        })
    }

    // 清空
    onDissolve() {
        Constants.gameManager.dissolveTube()
    }

    // 加管 
    onAddTube() {
        Constants.gameManager.addEmptyTube(() => {
            console.log('加管成功')
        })
    }

    // 商店
    onShop() {
        this.pageShopRoot.active = true
    }
}

