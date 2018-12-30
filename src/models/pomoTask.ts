import { Guid } from "guid-typescript";
import { observable } from "mobx";
import Tag from "./tag";
import { Pomo } from "./pomo";
import Project from "./project";

export default class PomoTask {
    @observable id = Guid.create().toString
    @observable pomos: Pomo[] = [] 
    @observable project: Project | null = null
    @observable name = "Unnamed Task"
    @observable created = Date.now()
    @observable tags: Tag[] = []
    @observable category: Tag | null = null
    @observable note: string = ""
    @observable isDone = false
    @observable isHidden = false
}