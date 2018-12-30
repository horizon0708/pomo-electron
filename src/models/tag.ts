import { Guid } from "guid-typescript";
import { observable } from "mobx";

export default class Tag {
    @observable id: Guid = Guid.create()
    @observable name: string = "unnamed tag"
    @observable color: string = "red"
    @observable isTag: boolean = true

    constructor(name: string) {
        this.name = name
    }
}