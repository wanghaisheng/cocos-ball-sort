import { _decorator, Button, Component, instantiate, Label, Material, MeshRenderer, Node, Prefab, resources, Sprite, SpriteFrame } from 'cc';
import { User } from '../../data/user';
import { Constants, ThemeItem } from '../../utils/const';
const { ccclass, property } = _decorator;

@ccclass('PageShop')
export class PageShop extends Component {
    @property(Prefab)
    prefab: Prefab = null

    @property(Node)
    themeNode: Node = null


    private _themeNodeList: Node[] = []

    start() {

    }

    protected onEnable(): void {
        this.init()
    }

    protected onDisable(): void {
        // 解绑事件
    }

    update(deltaTime: number) {

    }

    init() {
        // 更新金额
        this.refreshGold()

        // 皮肤列表
        if (this._themeNodeList && this._themeNodeList.length > 0) {
            // 更新
            this.refreshThemeList()
        } else {
            // 生成
            this.generateThemeList()
        }
    }

    refreshGold() {
        Constants.eventTarget.emit(Constants.EventName.UPDATE_GOLD_LABEL);
    }

    generateThemeList() {
        // 获取皮肤列表
        const themeList = Constants.THEME_SKIN_LIST || []
        const skinKeys = User.instance().getSkinKeys() || []
        // console.log('themeList', themeList)
        for (let i = 0; i < themeList.length; i++) {
            const themeItem = themeList[i]
            themeItem.isOwn = false
            if (skinKeys.indexOf(themeItem.code) > -1) {
                themeItem.isOwn = true
            }
            const themeNode = this.createThemeItem(themeItem)
            this._themeNodeList.push(themeNode)
        }
    }

    refreshThemeList() {
        // 获取皮肤列表
        const themeList = Constants.THEME_SKIN_LIST || []
        const skinKeys = User.instance().getSkinKeys() || []
        for (let i = 0; i < themeList.length; i++) {
            const themeItem = themeList[i]
            themeItem.isOwn = false
            if (skinKeys.indexOf(themeItem.code) > -1) {
                themeItem.isOwn = true
            }
            this.setItemNode(this._themeNodeList[i], themeItem)
        }
    }

    closeShopPage() {
        Constants.eventTarget.emit(Constants.EventName.COLOSE_SHOP_PAGE);
    }

    createThemeItem(item: ThemeItem) {
        const themeItem = instantiate(this.prefab)
        // const themeItem = PoolManager.instance().getNode(this.prefab, this.node)
        this.setItemNode(themeItem, item)
        themeItem.setParent(this.node)
        // this.setItemNode(themeItem, themeItemTexture)
        return themeItem
    }

    buyTheme(item: ThemeItem) {
        const user = User.instance()
        const totalGold = user.getGold()

        if (totalGold < item.price) {
            return
        }
        user.setGold(totalGold - item.price)
        user.setSkinKeys([...user.getSkinKeys(), item.code])
        // 更新
        this.init()
    }

    onApplyTheme(item: ThemeItem) {
        // 设置皮肤
        if (!this.themeNode) return
        this.setMaterial(this.themeNode, item.materialUrl)
        User.instance().setDefaultSkin(item.code)
        this.closeShopPage()
    }

    setItemNode(node: Node, item: ThemeItem) {
        try {
            if (!node) return
            const content = node.getChildByName('content')
            const btnBuy = node.getChildByName('btn-buy')
            const btnShow = node.getChildByName('btn-show')

            if (item.isOwn) {
                btnBuy.active = false
                btnShow.active = true

                btnShow.on(Node.EventType.TOUCH_END, () => {
                    this.onApplyTheme(item)
                }, this)
            } else {
                btnBuy.active = true
                btnShow.active = false

                const price = btnBuy.getChildByName('price')
                price.getComponent(Label).string = `${item.price}`

                btnBuy.on(Node.EventType.TOUCH_END, () => {
                    this.buyTheme(item)
                }, this)
            }
            this.setSpriteFrame(content, item.spriteFrameUrl)
        } catch (error) {
            console.log(error)
        }
    }

    setSpriteFrame(node: Node, url: string) {
        if (!node || !url) return
        resources.load(url, SpriteFrame, (err, spriteFrame) => {
            // console.log(err, spriteFrame)
            if (spriteFrame) {
                const sprite = node.getChildByName('theme').getComponent(Sprite)
                if (sprite) {
                    sprite.spriteFrame = spriteFrame;
                }
            }
        })
    }

    setMaterial(node: Node, url: string) {
        if (!node || !url) return
        resources.load(url, Material, (err, material) => {
            node.getComponent(MeshRenderer).material = material;
        });
    }

}

