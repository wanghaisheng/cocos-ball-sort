import { _decorator } from "cc";
import { IPowerItem } from "../game/power/power-item";
import { Utils } from "../utils/util";
import { User } from "./user";
import { Constants } from "../utils/const";
const { ccclass, property } = _decorator;

@ccclass('PowerData')
export class PowerData {

  public userNickName: string = Constants.USER_NICK_NAME

  private static _instance: PowerData = null

  public static instance() {
    if (!this._instance) {
      this._instance = new PowerData()
    }
    return this._instance
  }

  constructor() {
    // this._instance = null
  }

  public getUserPowerItem(userPower: number): IPowerItem {
    const item: IPowerItem = {
      rankNum: '未上榜',
      nickName: this.userNickName,
      power: userPower,
      hideCapLine: false,
      level: User.instance().getLevel(),
    }
    return item
  }
  
  /**
   * 获取战力榜数据
   * @param total list长度
   * @param userPower 用户战力
   * @returns 
   */
  public getPowerList(total: number, userPower: number) {
    const hasLoginToday = User.instance().hasLoginToday()
    const data = Utils.getLocalStorage('powerData')

    // console.log('getPowerList', hasLoginToday, data)

    let list = []
    if (!hasLoginToday || !data) {// 同一天的数据不会发生变化
      const powerRange = [2100, 3890]
      const levelRange = [21, 38]
      powerRange[0] = powerRange[0] - Utils.getRandNum(1, 100)
      powerRange[1] = powerRange[1] - Utils.getRandNum(1, 100)
      list = this.generateListData(total, powerRange, levelRange, userPower)
    } else {
      list = this.updatePowerData(data, userPower)
    }

    Utils.setLocalStorage('powerData', list)

    return list
  }

  public generateListData(total: number, powerRange: number[], levelRange: number[], userPower: number): IPowerItem[] {
    let data: IPowerItem[] = []
    // 根据IPowerItem生成1000个listItem
    let power = powerRange[1]
    let level = levelRange[1]
    let hasInsert = false
    for (let i = 0; i < total; i++) {
      // power值随机生成，值递减
      const randCount = i < 5 ? Math.random() * 100 : Math.random() * 20 
      if (i > 0) {
        power = power - Utils.getRandNum(1, randCount)
        power = Math.max(power, powerRange[0])

        level = level - Utils.getRandNum(0, 2)
        level = Math.max(level, levelRange[0])
      }

      const item: IPowerItem = {
        rankNum: i + 1,
        nickName: Utils.getRandomStr(8),
        power,
        level,
        hideCapLine: false,
      }

      if (!hasInsert && userPower && userPower >= power) {
        item.nickName = this.userNickName
        item.power = userPower
        item.hideCapLine = true
        item.level = User.instance().getLevel()
        power = userPower
        hasInsert = true
      }

      data.push(item)
    }
    return data
  }

  /** 更新战力榜 */
  public updatePowerData(data: IPowerItem[], userPower: number) {
    if (!data || data.length <= 0) {
      return data
    }
    const lastItem = data[data.length - 1]
    if (lastItem.power > userPower) {
      return data
    }

    let hasInsert = false
    const list = [...data]
    list.forEach((item, i) => {
      if (item.nickName === this.userNickName) {
        item.nickName = Utils.getRandomStr(8)
        item.level = i > 1 ? item[i - 1].level : item[0].level
        item.hideCapLine = false
      }

      if (!hasInsert && userPower >= item.power) {
        item.nickName = this.userNickName
        item.power = userPower
        item.level = User.instance().getLevel()
        item.hideCapLine = true
        hasInsert = true
      }
    })

    return list
  }

}