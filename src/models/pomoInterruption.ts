import { Guid } from "guid-typescript";
import { observable } from "mobx";

export default class PomoInterruption {
    @observable id: string = Guid.create().toString()
    @observable reason?: PomoInterruptionReason  
    @observable note: string = ""
    @observable timestamp: Date = new Date()
}

export class PomoInterruptionReason {
    @observable id: string = Guid.create().toString()
    @observable name: string = "" 
    @observable color: string = "red"

    constructor(name: string) {
        this.name = name
    }
}