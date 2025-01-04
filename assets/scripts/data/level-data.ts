import { math } from "cc";
import { Constants } from "../utils/const";

interface IObject {
  [key: string]: number
}
interface IData {
  /** 等级信息 */
  level?: number;
  /** 超时限制，单位为秒 */
  limitTime: number;
  /** 皮肤个数 */
  skinCount?: number;
  /** 等级名称 */
  levelName: string;
  /** 任务名称 */
  name: string;
  /** 描述信息 */
  desc: string;
  /** 显示网格列表，-1表示占位，-5表示不能移动 */
  list: number[][];
  /** 未知球设置 */
  spec?: IObject;
  /** 难度等级，0:普通，1:困难，2:噩梦 */
  levelType?: number;
  /** 提示信息 */
  tips?: string;
}

const emptyLen = 2;
export default class LevelData {
  /** 
   * 获取关卡数据
   * */
  static getData(level: number) {
    const levelList: IData[] = [
      {
        // skinCount: 2,
        limitTime: 120,
        levelName: '关卡 1',
        name: '',
        desc: '',
        list: [
          [1, 2, 2],
          [2, 1, 1],
          [0, 0, 0],
        ],
      },
      {
        // skinCount: 2,
        limitTime: 60,
        levelName: '关卡 2',
        name: '',
        desc: '',
        list: [
          [5, 2, 3, 2, 2, 2, 2, 1],
          [2, 1, 4, 4, 4, 1, 1, 2],
          [3, 3, 2, 4, 1, 5, 3, 3],
          [1, 1, 1, 3, 3, 3, 4, 4],
          [5, 4, 5, 5, 5, 4, 5, 5],
          [0, 0, 0, 0, 0, 0, 0, 0],
        ],
      },
      {
        // skinCount: 3,
        limitTime: 120,
        levelName: '关卡 3',
        name: '',
        desc: '',
        list: [
          [1, 2, 1],
          [2, 1, 3],
          [3, 3, 2],
          [3, 2, 2],
          [4, 1, 2],
          [4, 3, 1],
          [3, 4, 2],
          [2, 1, 2],
          [3, 4, 3],
          [3, 4, 4],
          [0, 0, 0],
        ],
      },
      {
        // skinCount: 4,
        limitTime: 120,
        levelName: '关卡 4',
        name: '',
        desc: '',
        list: [
          [1, 4, 2],
          [3, 4, 5],
          [2, 4, 1],
          [2, 5, 3],
          [1, -1, 2],
          [1, 5, 1],
          [4, 3, 4],
          [2, 4, 5],
          [2, 5, 2],
          [5, 2, 1],
          [0, 0, 0],
          [0, 0, 0],
        ],
        spec: {
          '4-1': 2
        },
      },
      {
        // skinCount: 3,
        limitTime: 150,
        levelName: '关卡 5',
        name: '',
        desc: '',
        list: [
          [1, 2, 3, 1],
          [2, -1, 3, 1],
          [3, 1, 2, 3],
          [1, 4, 5, 1],
          [4, 3, 5, 4],
          [4, 3, 1, 4],
          [3, 3, 2, 3],
          [5, 4, 1, 5],
          [5, 4, 5, 5],
          [2, 4, 4, 2],
          [3, 4, 1, 3],
          [1, 3, 1, 1],
          [4, 5, 2, 4],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
        spec: {
          '1-1': 2
        },
      },
      {
        // skinCount: 3,
        limitTime: 150,
        levelName: '关卡 6',
        name: '',
        desc: '',
        list: [
          [1, 4, 1, 2],
          [1, -1, 3, 3],
          [2, 4, 1, 3],
          [5, 4, 1, 1],
          [1, 1, 5, 1],
          [3, 2, 2, 3],
          [1, 2, 2, 1],
          [-1, 4, 1, 3],
          [3, 2, 4, 3],
          [1, 4, 2, 1],
          [5, 2, 2, 5],
          [3, 2, 1, 3],
          [3, 4, 4, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
        spec: {
          '1-1': 2,
          '7-0': 3
        },
      },
      {
        // skinCount: 3,
        limitTime: 180,
        levelName: '关卡 7',
        name: '',
        desc: '',
        list: [
          [1, 4, 1],
          [4, 2, 3],
          [3, 5, 3],
          [2, 3, -1],
          [3, 4, 4],
          [3, 1, 5],
          [1, 5, 1],
          [3, 2, 3],
          [5, 3, 5],
          [4, 1, 4],
          [0, 0, 0],
        ],
        spec: {
          '3-2': 5
        },
      },
      {
        // skinCount: 3,
        limitTime: 120,
        levelName: '关卡 8',
        name: '',
        desc: '',
        list: [
          [1, 2, 6, 2, 1],
          [4, 2, 4, 1, 2],
          [3, 5, 1, -1, 3],
          [5, 1, 3, 4, 4],
          [3, 3, 2, -1, 5],
          [2, 6, 4, 2, 3],
          [6, 6, 2, 3, 3],
          [3, 5, 3, 2, 6],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        spec: {
          '2-3': 5,
          '4-3': 2
        },
      },
      {
        // skinCount: 3,
        limitTime: 180,
        levelName: '关卡 9',
        name: '',
        desc: '',
        list: [
          [6, 2, 2, 3],
          [1, 2, -1, 5],
          [2, 3, 4, 4],
          [1, 3, 3, 5],
          [1, 4, 5, 5],
          [1, 1, 6, 5],
          [7, 1, 6, 5],
          [2, 2, 6, 6],
          [5, 2, 6, 3],
          [3, -1, 7, 1],
          [3, 3, 6, 7],
          [1, 7, 5, 2],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
        spec: {
          '1-2': 4,
          '9-1': 6,
        },
      },
      {
        // skinCount: 3,
        limitTime: 180,
        levelName: '关卡 10',
        name: '',
        desc: '',
        list: [
          [1, 2, 2, 3],
          [1, 4, 2, 4],
          [4, -1, 2, 1],
          [5, -1, 5, 4],
          [5, 1, 3, 3],
          [5, 6, 4, 5],
          [3, 4, 6, 5],
          [2, 1, 4, 2],
          [2, 4, 6, 2],
          [6, 1, 1, 3],
          [3, 6, 1, 6],
          [3, 7, 7, 6],
          [5, 7, 6, 7],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
        spec: {
          '2-1': 3,
          '3-1': 5,
        },
      },
      {
        // skinCount: 3,
        limitTime: 180,
        levelName: '关卡 11',
        name: '',
        desc: '',
        levelType: 2,
        list: [
          [2, 3, 1, 1, 1],
          [4, 2, 1, 5, 2],
          [3, 1, 5, 5, 3],
          [4, -1, 3, 2, 4],
          [4, 2, 4, 5, 5],
          [2, 2, 1, 5, 1],
          [1, 5, 2, 3, 2],
          [3, 3, 1, 5, 1],
          [5, 5, 3, 2, 3],
          [0, 0, 0, 0, 0],
        ],
        spec: {
          '3-1': 3,
        },
      },
      {
        // skinCount: 3,
        limitTime: 120,
        levelName: '关卡 12',
        name: '',
        desc: '',
        list: [
          [2, 5, 1],
          [4, 2, 1],
          [3, -1, 2],
          [4, 3, 3],
          [6, 5, 6],
          [-1, 5, 4],
          [1, 7, 8],
          [8, 4, 2],
          [2, 7, 1],
          [8, 4, 7],
          [2, 2, 7],
          [7, 8, 4],
          [8, 2, 7],
          [1, 8, 2],
          [0, 0, 0],
          [0, 0, 0],
        ],
        spec: {
          '2-1': 1,
          '5-0': 6,
        },
      },
      {
        // skinCount: 3,
        limitTime: 180,
        levelName: '关卡 13',
        name: '',
        desc: '',
        list: [
          [4, 2, 1, 3, 4],
          [2, -1, 1, -1, 3],
          [3, 1, 2, 4, 3],
          [4, 4, 3, 1, 2],
          [6, 5, 3, 6, 5],
          [3, 2, 6, 2, 3],
          [5, 2, 5, 3, 2],
          [6, 3, 2, 5, 6],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        spec: {
          '1-1': 1,
          '1-3': 2,
        },
      },
      {
        // skinCount: 3,
        limitTime: 180,
        levelName: '关卡 14',
        name: '',
        desc: '',
        list: [
          [4, 3, 2, 1],
          [4, 3, 4, 2],
          [1, -1, 2, 5],
          [4, 3, 3, 1],
          [1, 5, -1, 5],
          [4, 3, 3, 4],
          [4, 2, 3, 4],
          [4, 3, 3, 6],
          [6, 7, 2, 4],
          [4, 3, 7, 6],
          [4, 2, 6, 6],
          [5, 6, 2, 4],
          [4, 7, 3, 5],
          [5, 3, 6, 4],
          [4, 6, 7, 5],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
        spec: {
          '2-1': 2,
          '4-2': 5,
        },
      },
      {
        // skinCount: 3,
        limitTime: 180,
        levelName: '关卡 15',
        name: '',
        desc: '',
        levelType: 2,
        list: [
          [2, 2, 3, 1],
          [4, 2, 1, 4],
          [3, 4, -1, 4],
          [1, 3, 1, 2],
          [1, 2, 4, 4],
          [3, 4, 3, 2],
          [2, 3, 1, 4],
          [1, 1, 3, 2],
          [4, 1, 3, 4],
          [2, 3, 3, 4],
          [1, 3, 3, 4],
          [0, 0, 0, 0],
        ],
        spec: {
          '2-2': 1,
        },
      },
      {
        // skinCount: 3,
        limitTime: 180,
        levelName: '关卡 16',
        name: '',
        desc: '',
        list: [
          [1, 1, 3, 4],
          [2, 2, 1, 5],
          [3, 2, 4, 4],
          [8, 5, 3, 4],
          [5, 2, 3, 5],
          [7, -1, 2, 4],
          [1, 6, 4, 7],
          [7, 6, 7, 2],
          [1, 7, 4, 4],
          [6, 3, 7, 4],
          [4, 6, 2, 7],
          [-1, 7, 4, 8],
          [1, 3, 8, 4],
          [3, 1, 2, 8],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
        spec: {
          '5-1': 1,
          '11-0': 3,
        },
      },
      {
        // skinCount: 3,
        limitTime: 180,
        levelName: '关卡 17',
        name: '',
        desc: '',
        levelType: 2,
        list: [
          [4, 1, 2, 2, 3],
          [2, -1, 4, 2, 4],
          [3, 1, 2, 4, 5],
          [4, 5, 3, 1, 1],
          [1, 1, 4, 2, 1],
          [1, 2, 4, 2, 1],
          [5, 4, 2, 5, 3],
          [3, 2, 4, 2, 5],
          [3, 5, 3, 5, 5],
          [3, 5, 4, 5, 3],
          [0, 0, 0, 0, 0],
        ],
        spec: {
          '1-1': 1,
        },
      },
      {
        // skinCount: 3,
        limitTime: 180,
        levelName: '关卡 18',
        name: '',
        desc: '',
        list: [
          [2, 5, 2],
          [8, 2, 1],
          [3, 1, 1],
          [8, 3, 3],
          [-1, 5, 6],
          [6, 5, 8],
          [-1, 4, 8],
          [8, 7, 2],
          [2, 6, 1],
          [6, 4, 2],
          [2, 7, 6],
          [8, 8, 4],
          [8, 2, 7],
          [1, 8, 2],
          [0, 0, 0],
          [0, 0, 0],
        ],
        spec: {
          '4-0': 6,
          '6-0': 1,
        },
      },
      {
        // skinCount: 3,
        limitTime: 180,
        levelName: '关卡 19',
        name: '',
        desc: '',
        list: [
          [6, 2, 3, 2],
          [6, 1, 4, 4],
          [3, 2, 5, 4],
          [1, 5, 6, 1],
          [5, 3, 3, 6],
          [-1, 9, 2, 5],
          [9, 9, 6, 2],
          [4, 1, 2, 6],
          [-1, 4, 6, 6],
          [9, 8, 3, 2],
          [4, 8, 3, 7],
          [4, 1, 3, 7],
          [1, 8, 7, 3],
          [8, 1, 2, 7],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
        spec: {
          '5-0': 4,
          '8-0': 1,
        },
      },
      {
        // skinCount: 3,
        limitTime: 180,
        levelName: '关卡 20',
        name: '',
        desc: '',
        list: [
          [2, 3, 3, 2],
          [6, 1, 1, 1],
          [4, 2, -1, 4],
          [4, 5, 6, 2],
          [5, 5, -1, 6],
          [4, -1, 3, 6],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
        spec: {
          '3-2': 5,
          '4-2': 3,
          '5-1': 1,
        },
      },
    ]

    let data = levelList[0]
    if (level <= levelList.length && level > 0) {
      data = levelList[level - 1]
    } else if (level < 25) {
      if (level % 2 === 0) {
        data.list = LevelData.generateList(5, 7)
      } else {
        data.list = LevelData.generateList(3, 8)
        data.list.splice(4, 1)
      }
      data.limitTime = 180
    } else if (level < 30) {
      if (level % 2 === 0) {
        data.list = LevelData.generateList(6, 5)
      } else {
        data.list = LevelData.generateList(6, 7)
      }
      data.limitTime = 180
    } else if (level < 32) {
      data.list = LevelData.generateList(7, 4)
      data.limitTime = 240
    } else if (level < 35) {
      data.list = LevelData.generateList(7, 5)
      data.limitTime = 240
    } else if (level < 40) {
      if (level % 2 === 0) {
        data.list = LevelData.generateList(8, 4)
      } else {
        data.list = LevelData.generateList(7, 7)
      }
      data.limitTime = 240
    } else if (level < 45) {
      data.list = LevelData.generateList(9, 4)
      data.limitTime = 300
    } else if (level < 50) {
      data.list = LevelData.generateList(10, 4)
      data.limitTime = 360
    } else if (level < 55) {
      data.list = LevelData.generateList(11, 4)
      data.limitTime = 600
    } else {
      data.list = LevelData.generateList(12, 4)
      data.limitTime = 600
    }

    if (!data.spec && level > 20) {
      data.spec = LevelData.generateSpec(data.list, 3)
    }

    data.level = level
    data.levelName = `关卡 ${level}`

    return {
      list: data.list,
      data,
    }
  }

  static generateList(len: number, typeNum: number) {
    if (len <= 0 || typeNum <= 0) {
      return []
    }
    let res = Array.from({ length: len + emptyLen }, () => Array.from({ length: typeNum }, () => 0))

    for (let i = 0; i < len; i++) {
      for(let j = 0; j < typeNum; j++) {
        res[i][j] = i + 1
      }
    }

    for (let i = 0; i < len; i++) {
      LevelData.translate(res, len, typeNum)
      LevelData.translate(res, len, typeNum)
    }

    return res
  }

  /**
   * 获取未知球的列表
   * 注意：会改变list元素
   * @param list 
   * @param count 未知球的个数
   * @returns 
   */
  static generateSpec(list: number[][], count: number) {
    if (!list || list.length <= emptyLen || count <= 0) return null
    
    let n = list.length - emptyLen, m = list[0].length
    let res = {}, num = count

    while(num > 0 && num <= n * m) {
      let i = math.randomRangeInt(0, n)
      let j = math.randomRangeInt(0, m)
      
      if (res[`${i}-${j}`]) continue

      res[`${i}-${j}`] = list[i][j]
      list[i][j] = Constants.BALL_SKIN_LOCK

      num--
    }

    return res
  }

  static translate(res: number[][], n: number, m: number) {
    let i = math.randomRangeInt(0, 1000)
    let j = math.randomRangeInt(0, 1000)
    let r = math.randomRangeInt(0, 1000)
    let c = math.randomRangeInt(0, 1000)
    i = i % n
    j = j % m

    r = r % n
    c = c % m


    let temp = res[i][j]
    res[i][j] = res[r][c]
    res[r][c] = temp
  }
}


