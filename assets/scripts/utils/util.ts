import { math, log, url } from "cc"
import { WECHAT, BYTEDANCE, BAIDU } from "cc/env"
import { Constants } from "./const"

/**
 * 获取固定相同数值的随机列表
 * @param arr 
 * @param max 
 * @returns 
 */
export function getRandList(arr: any[], max: number = 10) {
  let i = math.randomRangeInt(0, arr.length)
  if (arr[i] > 0) {
      arr[i]--
      return i
  } else {
    if (max > 0) {
      return getRandList(arr, max - 1)
    }
  }
  return 0
}

/**
 * 获取球在试管上方的位置
 * @param tubeY 试管y位置
 * @param tubeH 试管高度
 * @returns 
 */
export function getBallOnTubeY(tubeY: number, tubeH: number) {
  return tubeY + tubeH / 2 + Constants.BALL_RADIUS * 0.5
}

/**
 * 获取试管的高度
 * @param type 
 * @returns 
 */
export function getTubeHeight(type: number) {
  switch(type) {
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
export function getTubeSpaceX(type: number, totalCol: number) {
  switch(type) {
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
 * 设置本地数据
 * @param key 
 * @param data 
 */
export function setLocalStorage(key: string, data: any) {
  try {
      localStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
      console.error(e)
  }
}

/**
 * 获取本地数据
 * @param key 
 */
export function getLocalStorage(key: string) {
  try {
    const dataStr = localStorage.getItem(key)
    if (dataStr) {
        const data = JSON.parse(dataStr)
        return data
    }
  } catch(e) {
    console.error(e)
  }
  return null
}

/**
 * 获取试管纵向间隔
 * @param type 
 * @param totalRow 当前纵向的个数（最大为3） 
 * @returns 
 */
export function getTubeSpaceY(type: number, totalRow: number) {
  switch(type) {
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
export function vibrateShort() {
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
export function activeShare() {
  // 主动分享按钮
  if (WECHAT && typeof (<any>window).wx !== undefined) {// 微信
    (<any>window).wx.shareAppMessage({
      // imageUrl: '',
      query: 'shareMsg='+'share user1'  // query最大长度(length)为2048
    });
  }
}

/**
 * 被动分享
 */
export function passiveShare() {
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
          query: 'shareMsg='+'share user3'  // query最大长度(length)为2048
        }
    })
  }
}

/**
 * 获取微信分享数据
 * 当其他玩家从分享卡片上点击进入时，获取query参数
 * @returns 
 */
export function getWXQuery() {
  if (WECHAT && typeof (<any>window).wx !== undefined) {// 微信
    let object = (<any>window).wx.getLaunchOptionsSync();
    let shareMsg = object.query['shareMsg'];
    console.log(shareMsg);
    return shareMsg;
  }
}