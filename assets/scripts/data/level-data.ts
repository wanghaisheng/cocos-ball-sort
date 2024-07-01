interface IData {
  /** 等级信息 */
  level?: number;
  /** 超时限制，单位为秒 */
  limitTime: number;
  /** 皮肤个数 */
  skinCount: number;
  /** 等级名称 */
  levelName: string;
  /** 任务名称 */
  name: string;
  /** 描述信息 */
  desc: string;
  /** 显示网格列表，-1表示占位，-5表示不能移动 */
  list: number[][];
}

export default class LevelData {
  /** 
   * 获取关卡数据
   * */
  static getData(level: number) {
    const levelList: IData[] = [
      {
        skinCount: 2,
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
        skinCount: 3,
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
        skinCount: 4,
        limitTime: 120,
        levelName: '关卡 2',
        name: '',
        desc: '',
        list: [
          [1, 4, 2],
          [3, 4, 1],
          [2, 4, 3],
          [2, 1, 3],
          [0, 0, 0],
        ],
      },
    ]

    let data = levelList[0]
    if (level <= levelList.length && level > 0) {
      data = levelList[level - 1]
      data.level = level
    }

    return {
      list: data.list,
      data,
    }
  }
}


