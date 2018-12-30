import { schemaInterruption } from "../stores/interruptionSchema";
import PomoInterruption from "../models/pomoInterruption";
import { Guid } from "guid-typescript";

export default class InterruptionBulider {

    buildFromSchema(item: schemaInterruption): PomoInterruption {
        let int = new PomoInterruption()
        int.id = Guid.parse(item.id)        
        int.note = item.note
        int.timestamp = new Date(item.timestamp)
        int.reason = item.reason && Guid.parse(item.reason) || undefined
        return int
    }

    exportToSchema(int: PomoInterruption): schemaInterruption {
        return {
            id: int.id.toString(),
            note: int.note,
            timestamp: int.timestamp.toString(),
            reason: int.reason && int.reason.toString()  
        }
    }
}