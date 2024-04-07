import { _decorator, Vec3 } from "cc";
import { GameManager } from "../game/game-manager";
import { BallControl } from "../game/ball/ball-control";
import { TipManager } from "../game/page/tip-manager";
import { AudioManager } from "../game/audio/audio-manager";

enum GAME_STATUS {
   /**
    * @zh 准备中
    */
   READY = 'READY',
   /**
    * @zh 游戏中
    */
   PLAYING = 'PLAYING',
   /**
    * @zh 暂停
    */
   PAUSE = 'PAUSE',
   /**
    * @zh 游戏结束
    */
   GAMEOVER = 'GAMEOVER',
}

enum TUBE_TYPE {
   /**
    * @zh 3极管
    */
   NO3 = 3,
   /**
    * @zh 4极管
    */
   NO4 = 4,
   /**
    * @zh 5极管
    */
   NO5 = 5,
   /**
    * @zh 7极管
    */
   NO7 = 7,
   /**
    * @zh 8极管
    */
   NO8 = 8,
   /**
    * @zh 12极管
    */
   NO12 = 12,
}

enum BALL_JUMP_TYPE {
   /**
    * @zh 弹出
    */
   UP = 'UP',
   /**
    * @zh 下沉
    */
   DOWN = 'DOWN',
   /**
    * @zh 左移
    */
   MOVE_LEFT = 'MOVE_LEFT',
   /**
    * @zh 右移
    */
   MOVE_RIGHT = 'MOVE_RIGHT',
}

enum GAME_FINISH_TYPE {
   /**
    * @zh 游戏输了
    */
   FAIL = 1,
   /**
    * @zh 游戏通关
    */
   PASS = 2,
   /**
    * @zh 游戏结束
    */
   FINISH = 3,
}

enum TUBE_LEVEL {
   /**
    * @zh 默认不符合
    */
   NONE = 0,
   /**
    * @zh 基本符合
    */
   POOR = 3,
   /**
    * @zh 非常符合
    */
   GOOD = 10,
   /**
    * @zh 高度符合
    */
   EXCELLENT = 99,
}

export class Constants {
   static gameManager: GameManager;
   static ballControl: BallControl;
   static tipManager: TipManager;
   static audioManager: AudioManager;

   // score
   static MAX_SCORE = 0; // 历史最高

   // 游戏
   static GAME_FINISH_TYPE = GAME_FINISH_TYPE // 游戏结束类型
   static GAME_STATUS = GAME_STATUS; // 游戏状态枚举

   // tube
   static TUBE_TYPE = TUBE_TYPE // 试管类型
   static TUBE_LEVEL = TUBE_LEVEL // 目标试管等级

   // ball
   static BALL_RADIUS = 1.5; // 球的半径
   static BALL_JUMP_TYPE = BALL_JUMP_TYPE // 球运动类型
}