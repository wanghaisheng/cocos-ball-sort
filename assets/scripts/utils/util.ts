import { math, log } from "cc"
import { WECHAT, BYTEDANCE, BAIDU } from "cc/env"

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