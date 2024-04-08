import { _decorator, Component, Node } from 'cc';
import { getLocalStorage, setLocalStorage } from './util';
import { Constants } from './const';
const { ccclass, property } = _decorator;

@ccclass('User')
export class User {
    // 等级金币信息
    private level: number = 0
    private gold: number = 0
    private losed: number = 0

    // 物资
    // 回撤次数
    private withdrawNum: number = 0
    // 溶解次数
    private dissolveNum: number = 0
    // 加管次数
    private addTubeNum: number = 0
    private static _instance: User = null

    public static instance() {
        if (!this._instance) {
            const user = getLocalStorage('user')
            if (user) {
                this._instance = new User(user.level, user.gold, user.losed, user.withdrawNum, user.dissolveNum, user.addTubeNum)
            } else {
                this._instance = new User()
            }
        }
        return this._instance
    }

    constructor(level: number = 1, gold: number = 100, losed: number = 0, withdrawNum: number = 0, dissolveNum: number = 0, addTubeNum: number = 0) {
        this.level = level
        this.gold = gold
        this.losed = losed
        this.withdrawNum = withdrawNum
        this.dissolveNum = dissolveNum
        this.addTubeNum = addTubeNum
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

    public getAddTubeNum() {
        return this.addTubeNum
    }

    public setAddTubeNum(num: number) {
        this.addTubeNum = num
        setLocalStorage('user', this)
    }
}

