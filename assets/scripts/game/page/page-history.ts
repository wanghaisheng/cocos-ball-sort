import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { Utils } from '../../utils/util';
import { HistItem, IHistItem } from '../history/hist-item';
import { HistoryData } from '../../data/history-data';
import { Constants } from '../../utils/const';
const { ccclass, property } = _decorator;



@ccclass('PageHistory')
export class PageHistory extends Component {

    @property(Node)
    listContentNode: Node = null
    @property(Prefab)
    listItemPrefab: Prefab = null

    @property(Node)
    btnBack: Node = null


    @property(Node)
    scrollviewNode: Node = null

    @property(Node)
    emptyNode: Node = null

    private _generateList: IHistItem[] = []
    private _debounceFunc: Function = null

    start() {

    }

    protected onEnable(): void {
        // this.updateListItem()
        if (!this._generateList.length) {
            this.emptyNode.active = true
        }

        this._debounceFunc = Utils.debounce(() => {
            console.log("debounce")
            this.createListItem()
        }, 300)

        this.btnBack.on(Node.EventType.TOUCH_END, this.hideNode, this)
        this.scrollviewNode.on("bounce-bottom", this._debounceFunc, this)
        Constants.eventTarget.on(Constants.EventName.CLOSE_USER_HISTORY, this.hideNode, this)
    }

    protected onDisable(): void {
        this.emptyNode.active = false
        this.btnBack.off(Node.EventType.TOUCH_END, this.hideNode, this)
        this.scrollviewNode.on("bounce-bottom", this._debounceFunc, this)
        Constants.eventTarget.off(Constants.EventName.CLOSE_USER_HISTORY, this.hideNode, this)
    }

    update(deltaTime: number) {

    }

    createListItem(len: number = 10) {
        const historyList = HistoryData.instance().getHistoryList();
        console.log("historyList", historyList)
        const lastList = this._generateList
        const n = historyList.length
        if (n > 0) {
            this.emptyNode.active = false
        }
        const startIndex = lastList.length > 0 ? lastList.length - 1 : 0
        for (let i = startIndex; i < startIndex + len && i < n; i++) {
            const item = historyList[i]
            // console.log('item', i, item)
            const itemComp = this.generateListItem(item)
            this._generateList.push(itemComp)
        }
    }


    generateListItem(item: IHistItem) {
        const listItem = instantiate(this.listItemPrefab)
        listItem.parent = this.listContentNode
        const itemComp = listItem.getComponent(HistItem)
        itemComp.setItemProp(item)
        return itemComp
    }

    hideNode() {
        this.node.active = false
    }

    showNode() {
        this.node.active = true
        this.createListItem()
    }
}

