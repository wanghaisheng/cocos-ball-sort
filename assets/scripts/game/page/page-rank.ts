import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { User } from '../../data/user';
import { Constants } from '../../utils/const';
import { PowerItem, IPowerItem } from '../power/power-item';
// import { PoolManager } from '../../utils/pool-manager';
import { PowerData } from '../../data/power-data';
import { Utils } from '../../utils/util';
import { PageHistory } from './page-history';
const { ccclass, property } = _decorator;

@ccclass('PageRank')
export class PageRank extends Component {
    @property(Node)
    listContentNode: Node = null
    @property(Prefab)
    listItemPrefab: Prefab = null


    @property(Node)
    btnHistory: Node = null
    @property(PageHistory)
    pageHistory: PageHistory = null

    @property(Node)
    userItemNode: Node = null
    @property(Node)
    btnInvite: Node = null

    @property(Node)
    btnClose: Node = null


    @property(Node)
    scrollviewNode: Node = null


    private _generateList: PowerItem[] = []
    private _userItemComp: PowerItem = null
    private _debounceFunc: Function = null

    start() {
        
    }

    protected onEnable(): void {
        this.updateListItem()

        this._debounceFunc = Utils.debounce(() => {
            console.log("debounce")
            this.createListItem()
        }, 300)

        this.btnInvite.on(Node.EventType.TOUCH_END, this.onInvite, this)
        this.btnClose.on(Node.EventType.TOUCH_END, this.onClose, this)
        this.btnHistory.on(Node.EventType.TOUCH_END, this.onShowHistory, this)
        this.scrollviewNode.on("bounce-bottom", this._debounceFunc, this)
    }

    protected onDisable(): void {
        this.btnInvite.off(Node.EventType.TOUCH_END, this.onInvite, this)
        this.btnClose.off(Node.EventType.TOUCH_END, this.onClose, this)
        this.btnHistory.off(Node.EventType.TOUCH_END, this.onShowHistory, this)
        this.scrollviewNode.on("bounce-bottom", this._debounceFunc, this)
    }

    update(deltaTime: number) {
        
    }

    init() {
        this.createListItem()
    }

    showNode() {
        this.node.active = true
    }

    getUserPowerItem(powerList: PowerItem[] = []) {
        const power = User.instance().getPowerPoint()
        const item = powerList.find(item => item.nickName === Constants.USER_NICK_NAME)
        return item || PowerData.instance().getUserPowerItem(power)
    }

    getPowerList(count: number = 100) {
        const powerData = PowerData.instance()
        const power = User.instance().getPowerPoint()
        const powerList = powerData.getPowerList(count, power)
        return powerList
    }

    createListItem(len: number = 10) {
        const powerList = this.getPowerList()
        const lastList = this._generateList
        const n = powerList.length
        const startIndex = lastList.length > 0 ? lastList.length - 1 : 0
        for(let i = startIndex; i < startIndex + len && i < n; i++) {
            const item = powerList[i]
            // console.log('item', i, item)
            const itemComp = this.generateListItem(item)
            this._generateList.push(itemComp)
        }
        // console.log('createListItem')
    }

    generateListItem(item: IPowerItem) {
        // const listItem = PoolManager.instance().getNode(this.listItemPrefab, this.listContentNode)
        const listItem = instantiate(this.listItemPrefab)
        listItem.parent = this.listContentNode
        const itemComp = listItem.getComponent(PowerItem)
        itemComp.setItemProp(item)
        itemComp.setCapLine(true)
        return itemComp
    }

    updateListItem() {
        const powerList = this.getPowerList()
        const userItem = this.getUserPowerItem(powerList)
        const lastList = this._generateList
        if (lastList.length > 0 && lastList[lastList.length - 1]?.power <= userItem.power) {
            const powerIndex = powerList.indexOf(item => item.nickName === userItem.nickName)
            if (powerIndex > -1 && lastList.length > powerIndex) {
                lastList.forEach((item, index) => {
                    if (index === powerIndex) {
                        // userItem.hideCapLine = true
                        item.setItemProp(userItem)
                    } else if (item.nickName === userItem.nickName) {
                        item.nickName = Utils.getRandomStr(8)
                        // item.hideCapLine = false
                        item.setItemProp(item)
                    }
                })
            }
        }
        this.updateUserPowerInfo(userItem)
    }

    updateUserPowerInfo(item: IPowerItem) {
        if (this._userItemComp) {
            this._userItemComp.setItemProp(item)
        } else {
            const listItem = instantiate(this.listItemPrefab)
            listItem.parent = this.userItemNode
            const itemComp = listItem.getComponent(PowerItem)
            itemComp.setItemProp(item)
            itemComp.setCapLine(false)
            this._userItemComp = itemComp
        }
    }

    onInvite() {
        // 调用分享接口
        Utils.activeShare()
        this.onClose()
    }

    onClose() {
        this.node.active = false
    }

    onShowHistory() {
        this.onClose()
        this.pageHistory.showNode()
    }
}

