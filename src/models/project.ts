import { Guid } from "guid-typescript";
import { Color } from "csstype";
import Tag from "./tag";

export default class Project {
    id: Guid = Guid.create()
    name: string = "Untitled Project"
    color: string = "red"
    status: ProjectStatus = ProjectStatus.inProgress
    goal: number = 60 * 10 // minutes
    tags: Tag[] = []
    category: Tag | null  = null


    constructor(name?: string) {
        name && (this.name = name)
    }

    build(opt: ProjectOption) {
        opt.id && (this.id = Guid.parse(opt.id))
        opt.name && (this.name = opt.name)
        opt.color && (this.color = opt.color)
        opt.status && (this.status = opt.status)
        opt.goal && (this.goal = opt.goal)
        opt.tags && (this.tags = opt.tags)
        opt.category && (this.category = opt.category)
        return this
    }

}

interface ProjectOption {
    id?: string
    name?: string
    color?: string
    status?: ProjectStatus
    goal?: number // minutes
    tags? : Tag[]
    category?: Tag
}

export enum ProjectStatus {
    inProgress,
    done,
    archived,
}