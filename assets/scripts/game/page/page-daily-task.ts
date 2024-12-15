import { _decorator, Component, tween } from 'cc';
import { User } from '../../data/user';
import { Constants } from '../../utils/const';
const { ccclass, property } = _decorator;

@ccclass('PageDailyTask')
export class PageDailyTask extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }

    init() {
        // 初始化每日任务页面
        const user = User.instance()
        if (!user.hasLoginToday()) {// 如果没有登录过，则显示登录奖励
            // 初始化每日任务
            user.initDailyTask()
            
            // 延迟显示为了不与其他动画冲突
            tween(this.node)
                .delay(3)  // 延迟 3 秒
                .call(() => {
                    // 延迟显示登录奖励
                    Constants.tipManager.showTipLabel(`今日登录，获得${Constants.DAILY_LOGIN_PRIZE_GOLD}金币`, () => {
                        user.setGold(user.getGold() + Constants.DAILY_LOGIN_PRIZE_GOLD)
                        // 播放奖励音效
                        Constants.audioManager.play('reward')
                        // 更新金币显示
                        Constants.eventTarget.emit(Constants.EventName.UPDATE_USER_INFO)
                    })
                })
                .start();
        }
    }
}

