import { _decorator, Component, Label, Node } from 'cc';
import { Constants } from '../../utils/const';
const { ccclass, property } = _decorator;


export interface IPowerItem {
    /** 等级 */
    level: number;
    /** 排名 */
    rankNum: number | string;
    /** 战力值 */
    power: number;
    /** 昵称 */
    nickName: string;
    /** 是否隐藏分割线 */
    hideCapLine?: boolean;
  }

@ccclass('PowerItem')
export class PowerItem extends Component {
    
    @property(Node)
    rankNode: Node = null
    @property(Node)
    charNode: Node = null
    @property(Node)
    nickNameNode: Node = null
    @property(Node)
    powerLabelNode: Node = null


    @property(Node)
    capLineNode: Node = null

    public nickName: string = ''
    public rankNum: number | string = -1
    public power: number = 0
    public level: number = 0
    public hideCapLine: boolean = false

    start() {

    }

    update(deltaTime: number) {
        
    }

    setItemProp(prop?: IPowerItem) {
        this.nickName = prop.nickName || 'unknown'
        this.rankNum = prop.rankNum || -1
        this.power = prop.power || 0
        this.level = prop.level || 0
        this.hideCapLine = prop.hideCapLine || false
        this.updateItemInfo()
    }

    updateItemInfo() {
        this.rankNode.getComponent(Label).string = this.rankNum ? this.rankNum.toString() : ''
        this.powerLabelNode.getComponent(Label).string = this.power.toString()
        this.capLineNode.active = this.hideCapLine

        this.updateNickName(this.nickName)
    }

    updateNickName(nickName: string) {  
        const chars = (nickName || 'unknown').toLocaleUpperCase().split('')   
        const len = chars.length
        const nickNameStr = chars[0] + '****' + chars[len - 1]
        this.charNode.getComponent(Label).string = this.level + ''
        this.nickNameNode.getComponent(Label).string = nickName === Constants.USER_NICK_NAME ? nickName : nickNameStr
    }
}

