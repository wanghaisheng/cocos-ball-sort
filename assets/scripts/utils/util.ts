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