import { math } from "cc"

/**
 * 初始化二维数组
 * @param x 
 * @param y 
 * @param defaultVal 
 * @returns 
 */
export function initArray(x: number, y: number, defaultVal: any = 0) {
  let list = []
  for(let i = 0; i < x; i++) {
    list[i] = []
    for(let j = 0; j < y; j++) {
      list[i][j] = defaultVal
    }
  }
  return list
}

/**
 * 获取固定相同数值的随机列表
 * @param arr 
 * @param max 
 * @returns 
 */
export function getRandList(arr: any[], max: number) {
  let i = math.randomRangeInt(0, arr.length)
  if (!arr[i]) {
      arr[i] = 1
  } else {
      arr[i]++
  }
  if (arr[i] && arr[i] > max) {
      return getRandList(arr, max)
  }
  return i
}