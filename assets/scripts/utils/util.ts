import { math } from "cc"

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
