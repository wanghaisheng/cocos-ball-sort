import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { Utils } from '../../utils/util';
import { HistItem, IHistItem } from '../history/hist-item';
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

    private _generateList: IHistItem[] = []
    private _debounceFunc: Function = null

    start() {

    }

    protected onEnable(): void {
        // this.updateListItem()

        this._debounceFunc = Utils.debounce(() => {
            console.log("debounce")
            this.createListItem()
        }, 500)

        this.btnBack.on(Node.EventType.TOUCH_END, this.hideNode, this)
        this.scrollviewNode.on("bounce-bottom", this._debounceFunc, this)
    }

    protected onDisable(): void {
        this.btnBack.off(Node.EventType.TOUCH_END, this.hideNode, this)
        this.scrollviewNode.on("bounce-bottom", this._debounceFunc, this)
    }

    update(deltaTime: number) {

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
    }
}

