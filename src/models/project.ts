import { Guid } from "guid-typescript";
import { Color } from "csstype";

export default class Project {
    id: Guid
    name: string
    color: string
    status: ProjectStatus
    goal: number // minutes


    constructor(opt?: ProjectOption) {
        this.id = opt && opt.id ? Guid.parse(opt.id) : Guid.create()
        this.name = opt && opt.name || "untitled project"
        this.color = opt && opt.color || "red"
        this.status = opt && opt.status || ProjectStatus.inProgress
        this.goal = opt && opt.goal || 60 * 10
    }

}

interface ProjectOption {
    id?: string
    name?: string
    color?: string
    status?: ProjectStatus
    goal?: number // minutes
}

export enum ProjectStatus {
    inProgress = "IN_PROGRESS",
    done = "DONE",
    archived = "ARCHIVED"
}