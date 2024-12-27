import { math } from "cc";

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
  /** 特殊球设置 */
  spec?: IObject;
  /** 提示信息 */
  tips?: string;
}

export default class LevelData {
  /** 
   * 获取关卡数据
   * */
  static getData(level: number) {
    const levelList: IData[] = [
      {
        // skinCount: 2,
        limitTime: 180,
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
        // skinCount: 3,
        limitTime: 120,
        levelName: '关卡 2',
        name: '',
        desc: '',
        list: [
          [1, 2, 2],
          [3, 3, 1],
          [2, 1, 3],
          [0, 0, 0],
        ],
      },
      {
        // skinCount: 2,
        limitTime: 120,
        levelName: '关卡 3',
        name: '',
        desc: '',
        list: [
          [1, 2, 1, -1],
          [2, 1, 2, 1],
          [0, 0, 0, 0],
        ],
        spec: {
          '0-3': 2
        },
      },
      {
        // skinCount: 4,
        limitTime: 120,
        levelName: '关卡 4',
        name: '',
        desc: '',
        list: [
          [1, 4, 2],
          [3, 4, 1],
          [2, 4, 3],
          [2, 1, 3],
          [0, 0, 0],
          [0, 0, 0],
        ],
      },
      {
        // skinCount: 3,
        limitTime: 120,
        levelName: '关卡 5',
        name: '',
        desc: '',
        list: [
          [1, 2, 3, 1],
          [2, -1, 3, 1],
          [3, 1, 2, 3],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
        spec: {
          '1-1': 2
        },
      },
      {
        // skinCount: 3,
        limitTime: 120,
        levelName: '关卡 6',
        name: '',
        desc: '',
        list: [
          [1, 1, 1, 2],
          [1, 2, 3, 3],
          [2, 2, 3, 3],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
      },
      {
        // skinCount: 3,
        limitTime: 120,
        levelName: '关卡 7',
        name: '',
        desc: '',
        list: [
          [1, 4, 1],
          [1, 4, 3],
          [2, 2, 3],
          [3, 4, 2],
          [0, 0, 0],
          [0, 0, 0],
        ],
      },
      {
        // skinCount: 3,
        limitTime: 120,
        levelName: '关卡 8',
        name: '',
        desc: '',
        list: [
          [1, 2, 2, 2],
          [4, 4, 4, 1],
          [3, 5, 1, 5],
          [5, 1, 3, 4],
          [3, 5, 3, 2],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
      },
      {
        // skinCount: 3,
        limitTime: 180,
        levelName: '关卡 9',
        name: '',
        desc: '',
        list: [
          [1, 2, 2, 3],
          [1, 2, 4, 5],
          [2, 3, 4, 4],
          [1, 3, 3, 5],
          [1, 4, 5, 5],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
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
          [4, 3, 2, 1],
          [5, 5, 5, 4],
          [5, 1, 3, 3],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
      },
      {
        // skinCount: 3,
        limitTime: 180,
        levelName: '关卡 11',
        name: '',
        desc: '',
        list: [
          [2, 3, 1, 1],
          [4, 2, 1, 5],
          [3, 1, 5, 5],
          [4, 3, 3, 2],
          [4, 2, 4, 5],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
      },
      {
        // skinCount: 3,
        limitTime: 180,
        levelName: '关卡 12',
        name: '',
        desc: '',
        list: [
          [2, 5, 1],
          [4, 2, 1],
          [3, 1, 2],
          [4, 3, 3],
          [6, 5, 6],
          [6, 5, 4],
          [0, 0, 0],
          [0, 0, 0],
        ],
      },
      {
        // skinCount: 3,
        limitTime: 180,
        levelName: '关卡 13',
        name: '',
        desc: '',
        list: [
          [2, 3, 1, 1],
          [4, 2, 1, 5],
          [3, 1, 5, 5],
          [4, 3, 3, 2],
          [4, 2, 4, 5],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
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
          [1, 2, 2, 5],
          [4, 3, 3, 1],
          [1, 5, 5, 5],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
      },
      {
        // skinCount: 3,
        limitTime: 180,
        levelName: '关卡 15',
        name: '',
        desc: '',
        list: [
          [4, 2, 1, 3, 4],
          [2, 1, 1, 2, 3],
          [3, 1, 2, 4, 3],
          [4, 4, 3, 1, 2],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
      },
      {
        // skinCount: 3,
        limitTime: 180,
        levelName: '关卡 16',
        name: '',
        desc: '',
        list: [
          [4, 1, 2, 2, 3],
          [2, 1, 4, 2, 4],
          [3, 1, 2, 4, 3],
          [4, 3, 3, 1, 1],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
      },
      {
        // skinCount: 3,
        limitTime: 180,
        levelName: '关卡 17',
        name: '',
        desc: '',
        list: [
          [1, 1, 3, 4, 4],
          [2, 2, 1, 5, 4],
          [3, 2, 1, 4, 5],
          [4, 5, 3, 5, 1],
          [2, 2, 3, 3, 5],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
      },
      {
        // skinCount: 3,
        limitTime: 180,
        levelName: '关卡 18',
        name: '',
        desc: '',
        list: [
          [1, 2, 3, 2, 2],
          [2, 1, 4, 4, 4],
          [3, 2, 5, 4, 5],
          [1, 5, 4, 1, 1],
          [5, 3, 3, 3, 5],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
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
          [4, 1, 2, 5],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
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
          [4, 2, 5, 4],
          [4, 5, 6, 2],
          [5, 5, 3, 6],
          [4, 1, 3, 6],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
      },
    ]

    let data = levelList[0]
    if (level <= levelList.length && level > 0) {
      data = levelList[level - 1]
    } else if (level < 25) {
      if (level % 2 === 0) {
        data.list = LevelData.generateData(5, 7)
      } else {
        data.list = LevelData.generateData(3, 8)
        data.list.splice(4, 1)
      }
      data.limitTime = 180
    } else if (level < 30) {
      if (level % 2 === 0) {
        data.list = LevelData.generateData(6, 5)
      } else {
        data.list = LevelData.generateData(6, 7)
      }
      data.limitTime = 180
    } else if (level < 32) {
      data.list = LevelData.generateData(7, 4)
      data.limitTime = 240
    } else if (level < 35) {
      data.list = LevelData.generateData(7, 5)
      data.limitTime = 240
    } else if (level < 40) {
      if (level % 2 === 0) {
        data.list = LevelData.generateData(8, 4)
      } else {
        data.list = LevelData.generateData(7, 7)
      }
      data.limitTime = 240
    } else if (level < 45) {
      data.list = LevelData.generateData(9, 4)
      data.limitTime = 300
    } else if (level < 50) {
      data.list = LevelData.generateData(10, 4)
      data.limitTime = 360
    } else if (level < 55) {
      data.list = LevelData.generateData(11, 4)
      data.limitTime = 600
    } else {
      data.list = LevelData.generateData(12, 4)
      data.limitTime = 600
    }

    data.level = level
    data.levelName = `关卡 ${level}`

    return {
      list: data.list,
      data,
    }
  }

  static generateData(len: number, typeNum: number) {
    if (len <= 0 || typeNum <= 0) {
      return []
    }
    let res = Array.from({ length: len + 2 }, () => Array.from({ length: typeNum }, () => 0))

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

  static swap(a: number, b: number) {
    
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


