import { math, log, sys, resources, SpriteFrame, Sprite, Node, Material, MeshRenderer } from "cc"
import { WECHAT, BYTEDANCE, BAIDU } from "cc/env"
import { Constants } from "./const"

export class Utils {
  /**
   * 获取固定相同数值的随机列表
   * @param arr 
   * @param max 
   * @returns 
   */
  static getRandList(arr: any[], max: number = 10) {
    let i = math.randomRangeInt(0, arr.length)
    if (arr[i] > 0) {
      arr[i]--
      return i
    } else {
      if (max > 0) {
        return Utils.getRandList(arr, max - 1)
      }
    }
    return 0
  }

  /** 获取随机数 */
  static getRandNum(min: number, max: number) {
    return math.randomRangeInt(min, max)
  }

  /**
   * 获取球在试管上方的位置
   * @param tubeY 试管y位置
   * @param tubeH 试管高度
   * @returns 
   */
  static getBallOnTubeY(tubeY: number, tubeH: number) {
    return tubeY + tubeH / 2 + Constants.BALL_RADIUS * 0.5
  }

  /**
   * 获取试管的类型
   * @param type 
   * @returns 
   */
  static getTubeType(type: number) {
    switch (type) {
      case Constants.TUBE_TYPE.NO3:
      case Constants.TUBE_TYPE.NO4:
      case Constants.TUBE_TYPE.NO5:
      case Constants.TUBE_TYPE.NO7:
      case Constants.TUBE_TYPE.NO8:
        return type
      default:
        return Constants.TUBE_TYPE.NO8
    }
  }

  /**
   * 获取试管的高度
   * @param type 
   * @returns 
   */
  static getTubeHeight(type: number) {
    switch (type) {
      case Constants.TUBE_TYPE.NO3:
        return 7
      case Constants.TUBE_TYPE.NO4:
        return 8
      case Constants.TUBE_TYPE.NO5:
        return 9.5
      case Constants.TUBE_TYPE.NO7:
        return 12
      case Constants.TUBE_TYPE.NO8:
        return 14
      default:
        return 2 * type
    }
  }

  /**
   * 获取试管横向间隔
   * @param type 
   * @param totalCol 当前横向的个数 
   * @returns 
   */
  static getTubeSpaceX(type: number, totalCol: number) {
    switch (type) {
      case Constants.TUBE_TYPE.NO3:
      case Constants.TUBE_TYPE.NO4:
      case Constants.TUBE_TYPE.NO5:
      case Constants.TUBE_TYPE.NO7:
      case Constants.TUBE_TYPE.NO8:
        return totalCol >= 4 ? 3 : 4
      default:
        return 3
    }
  }

  /**
   * 获取试管纵向间隔
   * @param type 
   * @param totalRow 当前纵向的个数（最大为3） 
   * @returns 
   */
  static getTubeSpaceY(type: number, totalRow: number) {
    switch (type) {
      case Constants.TUBE_TYPE.NO3:
        return totalRow >= 3 ? 1.5 : 2.5
      case Constants.TUBE_TYPE.NO4:
        return totalRow >= 3 ? 1 : 2
      case Constants.TUBE_TYPE.NO5:
        return totalRow > 1 ? 1.5 : 2
      case Constants.TUBE_TYPE.NO7:
        return 1.5
      case Constants.TUBE_TYPE.NO8:
      default:
        return 2
    }
  }

  /**
   * 调用振动效果
   */
  static vibrateShort() {
    if (WECHAT && typeof (<any>window).wx !== undefined) {// 微信
      (<any>window).wx.vibrateShort({
        type: 'heavy',
        success: () => log('调用振动成功'),
        fail: (err) => log('调用振动失败', err),
      });
    }
    if (BYTEDANCE && typeof (<any>window).tt !== undefined) {// 字节
      (<any>window).tt.vibrateShort({
        success: () => log('调用振动成功'),
        fail: (err) => log('调用振动失败', err),
      });
    }
    if (BAIDU && typeof (<any>window).swan !== undefined) {// 百度
      (<any>window).swan.vibrateShort({
        success: () => log('调用振动成功'),
        fail: (err) => log('调用振动失败', err),
      });
    }
  }

  /**
   * 调用主动分享
   */
  static activeShare() {
    // 主动分享按钮
    if (WECHAT && typeof (<any>window).wx !== undefined) {// 微信
      (<any>window).wx.shareAppMessage({
        // imageUrl: '',
        query: 'shareMsg=' + 'share user1'  // query最大长度(length)为2048
      });
    }
  }

  /**
   * 被动分享
   */
  static passiveShare() {
    if (WECHAT && typeof (<any>window).wx !== undefined) {// 微信
      // 显示当前页面的转发按钮
      (<any>window).wx.showShareMenu({
        withShareTicket: false,
        menus: ['shareAppMessage', 'shareTimeline'],
        success: (res) => {
          console.log('开启被动转发成功！');
        },
        fail: (res) => {
          console.log(res);
          console.log('开启被动转发失败！');
        }
      });

      // // 监听用户点击右上角分享按钮
      // (<any>window).wx.onShareAppMessage((res) => {
      //     console.log('用户点击右上角分享按钮', res);
      //     return {
      //       // title: '',
      //       query: 'shareMsg='+'share user2'  // query最大长度(length)为2048
      //     }
      // })
      // 监听用户点击右上角分享按钮
      (<any>window).wx.onShareTimeline((res) => {
        console.log('用户点击右上角分享按钮', res);
        return {
          // title: '', 
          query: 'shareMsg=' + 'share user3'  // query最大长度(length)为2048
        }
      })
    }
  }

  /**
   * 获取微信分享数据
   * 当其他玩家从分享卡片上点击进入时，获取query参数
   * @returns 
   */
  static getWXQuery() {
    if (WECHAT && typeof (<any>window).wx !== undefined) {// 微信
      let object = (<any>window).wx.getLaunchOptionsSync();
      let shareMsg = object.query['shareMsg'];
      console.log(shareMsg);
      return shareMsg;
    }
  }

  /**
   * 设置本地数据
   * @param key 
   * @param data 
   */
  static setLocalStorage(key: string, data: any) {
    try {
      sys.localStorage.setItem(key, JSON.stringify(data))
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * 获取本地数据
   * @param key 
   */
  static getLocalStorage(key: string) {
    try {
      const dataStr = sys.localStorage.getItem(key)
      if (dataStr) {
        const data = JSON.parse(dataStr)
        return data
      }
    } catch (e) {
      console.error(e)
    }
    return null
  }

  /** 判断是否属于当日 */
  static isToday(timestamp: number) {
    // 获取当前日期对象
    const now = new Date();

    // 获取今天的开始时间（00:00:00）
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    // 获取今天的结束时间（23:59:59）
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();

    // 判断时间戳是否在今天的时间范围内
    return timestamp >= startOfToday && timestamp <= endOfToday;
  }

  /** 获取指定长度的随机数字和字母 */
  static getRandomStr(length: number) {
    let result = '';
    const character1 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const character2 = '0123456789';
    const characters = character1 + character2;
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      if (i === 0) {
        result += character1.charAt(Math.floor(Math.random() * character1.length));
      } else {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
    }
    return result;
  }

  /** 防抖 */
  static debounce(func: Function, wait: number) {
    let timeout: null | number = null;
    return function (...args: any[]) {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, wait);
    };
  }

  /**
   * 替换皮肤材质
   * @param node 
   * @param url 
   */
  static setSpriteFrame(node: Node, url: string) {
    if (!node || !url) return
    resources.load(url, SpriteFrame, (err, spriteFrame) => {
      // console.log(err, spriteFrame)
      if (spriteFrame) {
        const sprite = node.getComponent(Sprite)
        if (sprite) {
          sprite.spriteFrame = spriteFrame;
        }
      }
    })
  }

  /**
   * 替换材质
   * @param node 
   * @param url 
   * @returns 
   */
  static setMaterial(node: Node, url: string) {
    if (!node || !url) return
    resources.load(url, Material, (err, material) => {
      if (material) {
        node.getComponent(MeshRenderer).material = material;
      }
    });
  }
}