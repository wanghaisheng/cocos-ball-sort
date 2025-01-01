import { _decorator, Component, Node, Size, Sprite, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WaterUp')
export class WaterUp extends Component {
    
    currentTime: number = 0;
    isCounting: boolean = false;
    contentSize: Readonly<import("cc").math.Size>;
    originalHeight: number = 0;
    countdownDuration: number = 0;

    onLoad() {
        
    }

    start() {
       this.init(null) 
    }

    update(deltaTime: number) {
        
    }

    init(data: any) {
        const { delayTime } = data || {};
        // this.countdownDuration = delayTime || 60;
        // 初始化倒计时
        this.currentTime = 0; // 当前时间
        this.isCounting = false; // 控制倒计时状态
        this.contentSize = this.node.getComponent(UITransform).contentSize;
        this.originalHeight = this.contentSize.height; // 初始高度

        this.setCountdownDuration(60); // 设置倒计时时长
    }

    // 启动倒计时并动态设置时长
    startCountdown(newDuration) {
        if (newDuration) {
            this.countdownDuration = newDuration;  // 动态设置倒计时时长
        }

        this.isCounting = true;
        this.currentTime = 0;  // 重置当前时间
        this.schedule(this.updateCountdown, 1 / 60); // 60FPS更新一次
    }

    updateCountdown() {
        if (!this.isCounting) return;

        // 增加当前时间
        this.currentTime += 1 / 60;

        // 计算当前高度，映射到 [0, 100]
        let progress = this.currentTime / this.countdownDuration;
        progress = Math.min(progress, 1); // 防止超过 1（即 100%）

        // 动态计算图片的高度
        let newHeight = this.originalHeight * progress;
        
        // 更新图片高度
        this.node.getComponent(UITransform).contentSize = new Size(this.contentSize.width, newHeight);

        // 如果倒计时结束，停止更新
        if (progress === 1) {
            this.isCounting = false;
            this.unschedule(this.updateCountdown); // 停止定时器
        }
    }

    // 动态设置倒计时时长并重新启动倒计时
    setCountdownDuration(newDuration) {
        // 停止当前倒计时
        this.isCounting = false;
        this.unschedule(this.updateCountdown);

        // 启动新的倒计时
        this.startCountdown(newDuration);
    }
}

