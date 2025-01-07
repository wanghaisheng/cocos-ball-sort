import { _decorator } from "cc";
import { Utils } from "../utils/util";
import { IHistItem } from "../game/history/hist-item";
const { ccclass, property } = _decorator;

@ccclass('HistoryData')
export class HistoryData {  
  private static _instance: HistoryData = null

  public static instance() {
    if (!this._instance) {
      this._instance = new HistoryData()
    }
    return this._instance
  }

  constructor() {
    // this._instance = null
  }
  
  /**
   * 获取历史数据
   * @returns 
   */
  public getHistoryList() {
    return Utils.getLocalStorage('historyData') || []
  }

  public setHistoryList(list: IHistItem[]) {
    Utils.setLocalStorage('historyData', list)
  }

  public getLevelData(level: number) {
    const list = this.getHistoryList()
    return (list || []).find(item => item.level === level) as IHistItem
  }
}