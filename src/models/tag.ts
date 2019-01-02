import { Guid } from "guid-typescript";
import { observable } from "mobx";
import { serialize } from "../helper/serializationDecorators";

export default class Tag {
    @serialize id: string = Guid.create().toString()
    @serialize name: string = "unnamed tag"
    @serialize color: string = "red"
    @serialize isTag: boolean = true
    @serialize isProject: boolean = true

    constructor(name: string) {
        this.name = name
    }
}