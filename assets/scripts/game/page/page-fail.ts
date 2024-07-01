import { _decorator, Component, Node } from 'cc';
import { Constants } from '../../utils/const';
import { User } from '../../data/user';
import { activeShare, getLocalStorage } from '../../utils/util';
const { ccclass, property } = _decorator;

@ccclass('PageFail')
export class PageFail extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }

    onNormalReceive() {
        const user = User.instance()
        const gold = Constants.GAME_PRIZE_TYPE.failNormal
        user.setGold(gold + user.getGold())
        user.setLosed()
        this.hideNode()
    }

    onMoreReceive() {
        // 调用分享接口
        activeShare()
        const user = User.instance()
        const gold = Constants.GAME_PRIZE_TYPE.failNormal
        user.setGold(gold * 5 + user.getGold())
        user.setLosed()
        this.hideNode()
    }

    hideNode() {
        this.node.active = false
        if (getLocalStorage('scene') == 'GameManager') {
            Constants.gameManager.init()
        } else {
            Constants.sortGameManager.init()
        }
    }
}

