import { _decorator, Vec3 } from "cc";
import { GameManager } from "../game/game-manager";

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
    * @zh 8极管
    */
   NO8 = 8,
   /**
    * @zh 12极管
    */
   NO12 = 12,
}

export class Constants {
   static gameManager: GameManager;

   // score
   static MAX_SCORE = 0; // 历史最高

   // 状态
   static GAME_STATUS = GAME_STATUS; // 游戏状态枚举

   // tube
   public static TUBE_TYPE = TUBE_TYPE // 试管类型

   // ball
   static BALL_RADIUS = 1.5; // 球的半径
}