import { Guid } from "guid-typescript";

export default class PomoInterruption {
    id: Guid = Guid.create()
    reason?: Guid  
    note: string = ""
    timestamp: Date = new Date()
}

export class PomoInterruptionReason {
    id: Guid = Guid.create()
    name: string = "" 

    constructor(name: string) {
        this.name = name
    }
}