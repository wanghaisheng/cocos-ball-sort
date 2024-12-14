import { _decorator, Component, Node } from 'cc';
import { getLocalStorage, setLocalStorage } from '../utils/util';
import { Constants } from '../utils/const';
const { ccclass, property } = _decorator;

@ccclass('User')
export class User {
    // 等级金币信息
    private level: number = 1
    private gold: number = 0
    private losed: number = 0
    /** 战力值 */
    private powerPoint: number = 100

    // 物资
    /** 回撤次数 */ 
    private withdrawNum: number = 0
    /** 溶解次数 */ 
    private dissolveNum: number = 0
    /** 加管次数 */ 
    private addTubeNum: number = 0
    /** 加时次数 */ 
    private addTimeNum: number = 0
    private static _instance: User = null

    public static instance() {
        if (!this._instance) {
            const user = getLocalStorage('user')
            if (user) {
                this._instance = new User(user)
            } else {
                this._instance = new User()
            }
        }
        return this._instance
    }

    constructor(user?: { level: number, gold: number, losed: number, withdrawNum: number, dissolveNum: number, addTubeNum: number, addTimeNum: number, powerPoint: number }) {
        this.level = user?.level || 1
        this.gold = user?.gold || 0
        this.losed = user?.losed || 0
        this.powerPoint = user?.powerPoint || 100
        this.withdrawNum = user?.withdrawNum || 0
        this.dissolveNum = user?.dissolveNum || 0
        this.addTubeNum = user?.addTubeNum || 0
        this.addTimeNum = user?.addTimeNum || 0
    }

    public getLevel() {
        return this.level
    }

    public setLevel(level: number) {
        let newLevel = level
        // if (this.level > Constants.USER_PROTECT_MIN_LEVEL) {
        //     newLevel = level < Constants.USER_PROTECT_MIN_LEVEL ? Constants.USER_PROTECT_MIN_LEVEL : level
        // }
        this.level = newLevel >= 1 ? newLevel : 1
        setLocalStorage('user', this)
    }

    public getPowerPoint() {
        return this.powerPoint
    }

    public setPowerPoint(powerPoint: number) {
        this.powerPoint = powerPoint >= 0 ? powerPoint : 0
        setLocalStorage('user', this)
    }

    public getGold() {
        return this.gold
    }

    public setGold(gold: number) {
        this.gold = gold >= 0 ? gold : 0
        setLocalStorage('user', this)
    }

    public getLosed() {
        return this.losed
    }

    public setLosed() {
        if (this.losed >= Constants.USER_PROTECT_LEVEL_TIME) {
            this.losed = 0
            const level = this.level - 1
            this.setLevel(level)
        } else {
            this.losed += 1
        }
        setLocalStorage('user', this)
    }

    public getWithdrawNum() {
        return this.withdrawNum
    }

    public setWithdrawNum(num: number) {
        this.withdrawNum = num
        setLocalStorage('user', this)
    }

    public getDissolveNum() {
        return this.dissolveNum
    }

    public setDissolveNum(num: number) {
        this.dissolveNum = num
        setLocalStorage('user', this)
    }

    public getAddTimeNum() {
        return this.addTimeNum
    }

    public setAddTimeNum(num: number) {
        this.addTimeNum = num
        setLocalStorage('user', this)
    }

    public getAddTubeNum() {
        return this.addTubeNum
    }

    public setAddTubeNum(num: number) {
        this.addTubeNum = num
        setLocalStorage('user', this)
    }
}

