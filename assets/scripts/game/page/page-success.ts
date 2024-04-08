import { _decorator, Component, Node } from 'cc';
import { User } from '../../utils/user';
import { Constants } from '../../utils/const';
const { ccclass, property } = _decorator;

@ccclass('PageSuccess')
export class PageSuccess extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }

    onNormalReceive() {
        const user = User.instance()
        const gold = Constants.GAME_PRIZE_TYPE.successNormal
        user.setGold(gold + user.getGold())
        user.setLevel(user.getLevel() + 1)
        this.hideNode()
    }

    onMoreReceive() {
        // 调用分享接口
    }

    hideNode() {
        this.node.active = false
    }
}

