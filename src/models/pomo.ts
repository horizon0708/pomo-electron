import {Guid } from "guid-typescript"

export class Pomo {
    public id: Guid
    public timestamp: PomoTimestamp
    public breakTimestamp: PomoTimestamp
    public pausesTimestamp: PomoTimestamp[]
    public projects: ProjectTime[]
    public status: PomoStatus

    constructor(startingProject?: ProjectTime) {
        this.id = Guid.create()
        this.timestamp = new PomoTimestamp()
        this.breakTimestamp = new PomoTimestamp()
        this.pausesTimestamp = []
        this.projects = startingProject ? [startingProject] : []
        this.status = PomoStatus.inProgress
    }
}

export class ProjectTime {
    public ratio: number
    public projectId: string

    constructor(projectId: string, ratio:number) {
        this.projectId = projectId
        this.ratio = ratio > 1 ? 1 : ratio
    }
}

export enum PomoStatus {
    inProgress,
    break,
    done,
    deleted
}

export class PomoTimestamp {
    public startTime: Date
    public endTime: Date
    public get duration() {
        return this.endTime.getTime() - this.startTime.getTime()
    }

    constructor(startTime?: Date, endTime?: Date){
        this.startTime = startTime || new Date()
        this.endTime = endTime || new Date()
    }
}