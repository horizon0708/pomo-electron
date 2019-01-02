import { Guid } from "guid-typescript";
import { Color } from "csstype";
import Tag from "./tag";
import { observable } from "mobx";

export default class Project {
    @observable id: string = Guid.create().toString()
    @observable name: string = "Untitled Project"
    @observable color: string = "red"
    @observable status: ProjectStatus = ProjectStatus.inProgress
    @observable goal: number = 60 * 10 // minutes
    @observable tags: Tag[] = []
    @observable category: Tag | null  = null


    constructor(name?: string) {
        name && (this.name = name)
    }

    build(opt: ProjectOption) {
        opt.id && (this.id = opt.id)
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