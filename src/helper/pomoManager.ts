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
    @observable private _currentPomo?: Pomo
    private repo: PomoRepository

    constructor(pomos: Pomo[], config: PomoConfig, repo: PomoRepository) {
        this.pomos = pomos
        this.config = config
        this.repo = repo
        // autorun(() => {
        //     this.onStateChange(this.currentPomo.previousStatus, this.currentPomo.status)
        // })

        reaction(() => {
            return {
                prev: this.currentPomo.previousStatus,
                next: this.currentPomo.status
            }
        }, o => {
            console.log(o.prev + "->" + o.next)
            this.onStateChange(o.prev, o.next)
        })

        reaction(() => this.currentPomo.currentTime, () => {
            this.onTimeUp()
        })

        // reaction(() => this._currentPomo, t => {
        //     if (t) {
        //         this.cache.save(t)
        //     }
        // })



        // when(()=> this.isBreaktimeUp, ()=> {
        //     this.onTimeUp()
        // })
    }

    @computed get isBreaktimeUp() {
        return this.currentPomo.status === PomoStatus.inBreak && this.currentPomo.currentTime >= this.config.breakDuration
    }

    @computed get currentPomo(): Pomo {
        if (this._currentPomo) return this._currentPomo
        this._currentPomo = this.cache.load()
        // this._currentPomo = new Pomo()

        this.currentPause = [...this._currentPomo.pauseTimestamps].pop()
        return this._currentPomo
    }

    public to(state: PomoStatus) {
        if(state === PomoStatus.inBreak){
            this.currentPomo.currentTime = 0    
        }
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
            console.log(pomo.currentTime)
            clearInterval(this.timer)
            this.to(PomoStatus.allDone)
        }
    }

    onStateChange(previousStatus: PomoStatus, status: PomoStatus) {
        // start timer
        console.log("STATE CHANGE: " + previousStatus.toString() + "-->" + status.toString())


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
        this.currentPomo.timestamp.startTime = new Date()
        this.timer = this.startTimer(this.currentPomo.timestamp.startTime)
    }

    startTimer(startTime: Date): number {
        console.log(" ** TIMER STARTED ** ")
        this.timerStartTime = startTime
        return window.setInterval(() => {
            if (this.currentPomo.status !== PomoStatus.inPause) {
                const time = (new Date().getTime() - this.timerStartTime.getTime()) + this.currentPomo.workDurations
                this.currentPomo.currentTime = time
                this.cache.save(this.currentPomo)
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
        if (!this.timer) {
            // this.startTimer(new Date())
        }
    }

    onBreak() {
        console.log("BREAK START")
        clearInterval(this.timer)
        this.timerStartTime = new Date()
        this.currentPomo.currentTime = 0
        this.timer = window.setInterval(() => {
            if (this.currentPomo.status !== PomoStatus.inPause && this.currentPomo.status === PomoStatus.inBreak) {
                const time = (new Date().getTime() - this.timerStartTime.getTime())
                this.currentPomo.currentTime = time
            console.log(this.currentPomo.currentTime)
                this.cache.save(this.currentPomo)
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
        this.to(PomoStatus.start)
        console.log(this.timer)
    }

    resetCurrentPomo() {
        this._currentPomo = new Pomo()
    }

    skipPomo() {
        // when user ends pomo early, do things ?

    }

    nextPomo() {
        // send pomo to db, and start a new pomo in localStorage/  memory
        this.repo.addPomo(this.currentPomo)
        this.cache.reset()
        this._currentPomo = new Pomo()
        console.log(this._currentPomo)
    }
}