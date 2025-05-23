import { _decorator, Button, Component, instantiate, Label, Material, MeshRenderer, Node, Prefab, resources, Sprite, SpriteFrame } from 'cc';
import { User } from '../../data/user';
import { Constants, ThemeItem } from '../../utils/const';
import { Utils } from '../../utils/util';
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
            Constants.tipManager.showModal({
                msg: '金币不足，每天登录和分享赚取更多金币！',
                btnText: '去分享',
                confirm: () => {
                    Constants.eventTarget.emit(Constants.EventName.SHARE)
                    this.refreshGold()
                }
            })
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
        // this.setMaterial(this.themeNode, item.materialUrl)
        Utils.setMaterial(this.themeNode, item.materialUrl)
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

                // const totalGold = User.instance().getGold()
                // console.log('btnBuy.getComponent(Button)', btnBuy.getComponent(Button))
                // btnBuy.getComponent(Button).interactable = false

                const price = btnBuy.getChildByName('price')
                price.getComponent(Label).string = `${item.price}`

                btnBuy.on(Node.EventType.TOUCH_END, () => {
                    this.buyTheme(item)
                }, this)
            }
            const spriteNode = content?.getChildByName('theme')
            Utils.setSpriteFrame(spriteNode, item.spriteFrameUrl)
            // this.setSpriteFrame(content, item.spriteFrameUrl)
        } catch (error) {
            console.error(error)
        }
    }

}

