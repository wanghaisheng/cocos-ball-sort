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

    let list = []
    if (!hasLoginToday || !data) {// 同一天的数据不会发生变化
      list = this.generateListData(total, [2600, 4380], userPower)
    } else {
      list = this.updatePowerData(data, userPower)
    }

    Utils.setLocalStorage('powerData', list)

    return list
  }

  public generateListData(total: number, range: number[], userPower: number): IPowerItem[] {
    let data: IPowerItem[] = []
    // 根据IPowerItem生成1000个listItem
    let power = range[1]
    let hasInsert = false
    for (let i = 0; i < total; i++) {
      // power值随机生成，值递减
      const randCount = i < 5 ? Math.random() * 100 : Math.random() * 20 
      if (i > 0) {
        power = power - Utils.getRandNum(1, randCount)
        power = Math.max(power, range[0])
      }

      const item: IPowerItem = {
        rankNum: i + 1,
        nickName: Utils.getRandomStr(8),
        power,
        hideCapLine: false,
      }

      if (!hasInsert && userPower && userPower >= power) {
        item.nickName = this.userNickName
        item.power = userPower
        item.hideCapLine = true
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
    list.forEach(item => {
      if (item.nickName === this.userNickName) {
        item.nickName = Utils.getRandomStr(8)
        item.hideCapLine = false
      }

      if (!hasInsert && userPower >= item.power) {
        item.nickName = this.userNickName
        item.power = userPower
        item.hideCapLine = true
        hasInsert = true
      }
    })

    return list
  }

}