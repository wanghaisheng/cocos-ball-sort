import { math, log } from "cc"
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