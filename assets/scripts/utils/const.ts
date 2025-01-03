import { _decorator, EventTarget } from "cc";
import { GameManager } from "../game/game-manager";
import { BallControl } from "../game/ball/ball-control";
import { TipManager } from "../game/page/tip-manager";
import { AudioManager } from "../game/audio/audio-manager";
import { EffectManager } from "../game/effect/EffectManager";
import { SortGameManager } from "../game/sort-game-manager";

export interface ThemeItem {
   /** key */
   code: string;
   /** 价格 */
   price: number;
   /** 皮肤纹理地址 */
   spriteFrameUrl: string;
   /** 皮肤材质地址 */
   materialUrl: string;
   /** 是否已拥有 */
   isOwn?: boolean;
 }

enum GAME_STATUS {
   /**
    * @zh 初始化
    */
   INIT = 1,
   /**
    * @zh 已准备
    */
   READY = 3,
   /**
    * @zh 游戏中
    */
   PLAYING = 5,
   /**
    * @zh 暂停
    */
   PAUSE = 7,
   /**
    * @zh 游戏结束
    */
   GAMEOVER = 9,
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
   /**
    * @zh 游戏超时
    */
   TIME_OUT = 4,
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

// 道具价格
const PROP_PRICE = {
   withdraw: 100, // 回撤
   dissolve: 120, // 溶解
   addTime: 200, // 加时
   addTube: 800, // 添加试管
}

// 结束金币奖励
const GAME_PRIZE_TYPE = {
   successNormal: 40, // 成功
   failNormal: 8, // 失败
}

// 结束战力奖励
const GAME_POWER_POINT_TYPE = {
   success: 200, // 成功
   fail: 200, // 失败
   pex: 40, // 最小
}

// 球皮肤管理
const BALL_SKIN_TYPE = {
   Style1: 'ball/ball-skin-',
}


const DEFAULT_THEME = 'default'

// 主题皮肤管理
const THEME_SKIN_LIST: ThemeItem[] = [
   {
      code: DEFAULT_THEME,
      price: 0,
      spriteFrameUrl: `texture/bg/${DEFAULT_THEME}/spriteFrame`,
      materialUrl: 'theme/' + DEFAULT_THEME,
   },
   {
      code: 'theme1',
      price: 998,
      spriteFrameUrl: 'texture/bg/theme1/spriteFrame',
      materialUrl: 'theme/theme1',
   },
   {
      code: 'theme2',
      price: 1998,
      spriteFrameUrl: 'texture/bg/theme2/spriteFrame',
      materialUrl: 'theme/theme2',
   },
   {
      code: 'theme3',
      price: 2499,
      spriteFrameUrl: 'texture/bg/theme3/spriteFrame',
      materialUrl: 'theme/theme3',
   },
]


/** 事件管理，处理跨组件通信 */
const eventTarget = new EventTarget();
// 事件名称
enum EventName {
   // 更新金币
   UPDATE_GOLD_LABEL = 'update-page-shop-gold',
   // 更新金币
   UPDATE_USER_INFO = 'update-gage-sort-game-info',
   // 主题皮肤使用
   USE_THEME = 'use-theme',
   // 关闭商店
   COLOSE_SHOP_PAGE = 'close-page-shop',
}

export class Constants {
   static sortGameManager: SortGameManager;
   static gameManager: GameManager;
   static ballControl: BallControl;
   static tipManager: TipManager;
   static audioManager: AudioManager;
   static effectManager: EffectManager;

   // score
   static MAX_SCORE = 0; // 历史最高

   // 游戏
   static GAME_FINISH_TYPE = GAME_FINISH_TYPE // 游戏结束类型
   static GAME_STATUS = GAME_STATUS; // 游戏状态枚举

   // 道具
   static PROP_PRICE = PROP_PRICE; // 道具价格

   // 奖励
   static GAME_PRIZE_TYPE = GAME_PRIZE_TYPE; // 结束奖励
   static GAME_POWER_POINT_TYPE = GAME_POWER_POINT_TYPE; // 结束战力奖励

   // tube
   static TUBE_TYPE = TUBE_TYPE // 试管类型
   static TUBE_LEVEL = TUBE_LEVEL // 目标试管等级
   static TUBE_LINE_NUM_MAX = 6; // 试管一行的最大数量
   static TUBE_ADD_NUM = 1 // 试管添加次数

   // ball
   static BALL_RADIUS = 1.5; // 球的半径
   static BALL_JUMP_TYPE = BALL_JUMP_TYPE // 球运动类型
   static BALL_TYPE_MAX = 15 // 球的类型最大值
   static BALL_SKIN_TYPE = BALL_SKIN_TYPE // 球皮肤
   static BALL_SKIN_LOCK = -1 // 球皮肤锁
   static BALL_DEFAULT_SKIN = 'Style1' // 球默认皮肤类型


   // user
   static USER_PROTECT_MIN_LEVEL = 2 // 用户最低保护等级
   static USER_PROTECT_LEVEL_TIME = 2 // 用户等级保护最低次数
   static USER_NICK_NAME = 'you' // 用户昵称

   // event
   static eventTarget = eventTarget // 事件中心
   static EventName = EventName // 事件类型

   // theme
   static THEME_SKIN_LIST = THEME_SKIN_LIST
   static DEFAULT_THEME = DEFAULT_THEME

   // daily 日常任务
   static DAILY_SHARE_COUNT = 3 // 每天分享次数
   static DAILY_LOGIN_PRIZE_GOLD = 50 // 每天登录奖励金币

   // advert
   static ADVERT_STATUS = 0 // 广告接入状态
}