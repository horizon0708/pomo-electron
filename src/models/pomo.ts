import { Guid } from "guid-typescript"
import { observable, action, computed } from "mobx";

export class Pomo {
    @observable public id: Guid
    @observable public timestamp: PomoTimestamp
    @observable public breakTimestamp?: PomoTimestamp
    @observable public pauseTimestamps: PomoTimestamp[]
    @observable public projects: ProjectTime[]
    @observable public status: PomoStatus
    @observable public currentTime: number
    @observable public previousStatus: PomoStatus
    @computed get workDurations() {
        if (this.pauseTimestamps.length > 0) {
            let total = 0;
            this.pauseTimestamps.forEach((x, i, arr) => {
                if (i === 0) {
                    total += (x.startTime.getTime() - this.timestamp.startTime.getTime())
                } else {
                    total += (x.startTime.getTime() - this.pauseTimestamps[i - 1].endTime.getTime())
                    if(this.breakTimestamp && i === arr.length-1)  {
                        total += this.breakTimestamp.startTime.getTime() - x.endTime.getTime()
                    }
                }
            })
            return total
        }
        return 0
    }

    constructor(startingProject?: ProjectTime) {
        this.id = Guid.create()
        this.timestamp = new PomoTimestamp()
        this.pauseTimestamps = []
        this.projects = startingProject ? [startingProject] : []
        this.status = PomoStatus.start
        this.previousStatus = this.status
        this.currentTime = 0
    }

    @action to(state: PomoStatus) {
        this.previousStatus = this.status
        this.status = state

    }
}

export class ProjectTime {
    public ratio: number
    public projectId: string

    constructor(projectId: string, ratio: number) {
        this.projectId = projectId
        this.ratio = ratio > 1 ? 1 : ratio
    }
}

export enum PomoStatus {
    start = "START",
    inProgress ="IN_PROGRESS",
    inPause="IN_PAUSE",
    inBreak="IN_BREAK",
    workDone="WORK_DONE",
    allDone="ALL_DONE",
    deleted="DELETED"
}

export class PomoTimestamp {
    public startTime: Date
    public endTime: Date
    public get duration() {
        const output = this.endTime.getTime() - this.startTime.getTime()
        return output > 0 ? output : 0
    }

    constructor(startTime?: Date, endTime?: Date) {
        this.startTime = startTime || new Date()
        this.endTime = endTime || new Date()
    }
}