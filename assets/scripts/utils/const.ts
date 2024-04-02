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

export class Constants {
   static gameManager: GameManager;

   // score
   static MAX_SCORE = 0; // 历史最高

   // 状态
   static GAME_STATUS = GAME_STATUS; // 游戏状态枚举

   // tube
   static TUBE_NUM = 3; // 试管个数
   static TUBE_POSITION = [0.8, 0.6, 0.5, 0.4, 0.3, 0.2, 0.15, 0.1, 0.05, 0.03]; // 试管位置

   // ball
   static BALL_NUM = 4; // 每支试管球的个数
   static BALL_CALIBER = 1.6; // 球的直径
}