import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
import { Constants } from '../../utils/const';
const { ccclass, property } = _decorator;

interface IAudioMap {
    [name: string]: AudioClip
 }
 // 声音资源文件管理，飞机和背景的是单独管理
 @ccclass('AudioManager')
 export class AudioManager extends Component {
    @property([AudioClip])
    public audioList: AudioClip[] = []
 
    private _audioDict: IAudioMap = {}
    private _audioSource: AudioSource = null

    __preload () {
        Constants.audioManager = this
    }
 
    start () {
        for (let index = 0; index < this.audioList.length; index++) {
            const element = this.audioList[index];
            this._audioDict[element.name] = element
        }
        this._audioSource = this.getComponent(AudioSource)
    }
 
    public play(name: string) {
        const audio = this._audioDict[name]
        if (audio) {
            this._audioSource.playOneShot(audio)
        }
    }
 }