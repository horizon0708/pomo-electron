import { Pomo, PomoStatus, PomoTimestamp } from "../models/pomo";
import PomoConfig from "../models/pomoConfig";
import { autorun, reaction, action, observable, computed, when } from "mobx";
import { timerStatus } from "../models/pomoStatus";
import PomoCache from '../stores/pomoCache';
import PomoRepository from '../stores/pomoRepository';


export class PomoManager {
    @observable private pomos: Pomo[]
    private config: PomoConfig
    private timer?: number
    private timerStartTime: Date = new Date()
    private currentPause?: PomoTimestamp
    private cache = new PomoCache()
    private _currentPomo?: Pomo
    private repo: PomoRepository

    constructor(pomos: Pomo[], config: PomoConfig, repo: PomoRepository) {
        this.pomos = pomos
        this.config = config
        this.repo = repo
        // autorun(() => {
        //     this.onStateChange(this.currentPomo.previousStatus, this.currentPomo.status)
        // })

        reaction(()=> {
            return {
                prev: this.currentPomo.previousStatus,
                next: this.currentPomo.status
            }
        }, o =>{
            console.log(o.prev + "->" + o.next)
            this.onStateChange(o.prev, o.next)
        })

        reaction(()=> this.currentPomo.currentTime, ()=> {
            this.onTimeUp()
        })

        // when(()=> this.isBreaktimeUp, ()=> {
        //     this.onTimeUp()
        // })
    }

    @computed get isBreaktimeUp() {
        return this.currentPomo.status === PomoStatus.inBreak && this.currentPomo.currentTime >= this.config.breakDuration
    }

    get currentPomo() {
        if(this._currentPomo) return this._currentPomo
        this._currentPomo = this.cache.load()
        console.log(this._currentPomo)
        return this._currentPomo
    }

    public to(state: PomoStatus) {
        this.currentPomo.to(state)
        console.log("to: " + state)
    }

    addPomo(): Pomo {
        const pomoToAdd = new Pomo()
        this.pomos.forEach(p => {
            if (p.status !== PomoStatus.allDone && p.status !== PomoStatus.deleted) {
                p.status = PomoStatus.allDone
            }
        })
        this.pomos.unshift(pomoToAdd)
        return pomoToAdd
    }

    onTimeUp() {
        const pomo = this.currentPomo
        if (pomo.status === PomoStatus.inProgress && pomo.currentTime >= this.config.pomoDuration) {
            if (this.config.notifyOnEnd) {
                //notify
            }
        }
        if (pomo.status === PomoStatus.inBreak && pomo.currentTime >= this.config.breakDuration) {
            console.log('on time up')
            this.to(PomoStatus.allDone)
        }
    }

    onStateChange(previousStatus: PomoStatus, status: PomoStatus) {
        // start timer
        if (previousStatus === PomoStatus.start && status === PomoStatus.inProgress) {
            this.onStart()
        }
        if (previousStatus !== PomoStatus.inPause && status === PomoStatus.inPause) {
            this.onPause()
        }
        if (previousStatus === PomoStatus.inPause && status === PomoStatus.inProgress) {
            this.onResume()
        }
        if (previousStatus === PomoStatus.inProgress && status === PomoStatus.inBreak) {
            this.onBreak()
        }
        if (previousStatus !== PomoStatus.allDone && status === PomoStatus.allDone) {
            this.onAllEnd()
        }

        previousStatus = status
    }

    onStart() {
        console.log('statechange')
        this.timerStartTime = this.currentPomo.timestamp.startTime
        this.timer = window.setInterval(() => {
            if (this.currentPomo.status !== PomoStatus.inPause) {
                const time = (new Date().getTime() - this.timerStartTime.getTime()) + this.currentPomo.workDurations
                console.log(this.currentPomo)
                this.currentPomo.currentTime = time
            }
        }, 333)
    }

    onPause() {
        this.currentPause = new PomoTimestamp(new Date())
        this.currentPomo.pauseTimestamps.push(this.currentPause)
    }

    onResume() {
        if (!this.currentPause) {
            console.error("pause object not set")
            return null
        }
        this.currentPause.endTime = new Date()
        this.timerStartTime = new Date()
    }

    onBreak() {
        console.log("BREAK START")
        clearInterval(this.timer)
        this.timerStartTime = new Date()
        this.timer = window.setInterval(() => {
            if (this.currentPomo.status !== PomoStatus.inPause) {
                const time = (new Date().getTime() - this.timerStartTime.getTime())
                this.currentPomo.currentTime = time
            }
        }, 333)
    }

    public get isOvertime() {
        if (this.currentPomo.status === PomoStatus.inProgress) {
            return this.currentPomo.currentTime >= this.config.pomoDuration
        }
        return false
    }

    onAllEnd() {
        console.log("END")
        this.nextPomo()
        clearInterval(this.timer)
    }

    skipPomo() {
        // when user ends pomo early, do things ?
        
    }

    nextPomo() {
        // send pomo to db, and start a new pomo in localStorage/  memory
        this.repo.addPomo(this.currentPomo) 
        this.cache.reset()
        this._currentPomo = new Pomo()
    }
}