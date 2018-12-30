import { schemaPomo, schemaTimestamp,   } from "../stores/database";
import { Pomo, PomoTimestamp, PomoStatus } from "../models/pomo";
import { Guid } from "guid-typescript";
import { string } from "prop-types";
import Project, { ProjectStatus } from "../models/project";
import PomoInterruption from "../models/pomoInterruption";
import { schemaInterruption } from "../stores/interruptionSchema";

export default class PomoBuilder {

    // redundant for now
    buildFromJSON(json: any): Pomo {
        let pomo = new Pomo()
        try {
            pomo.id = json.id.value
            pomo.timestamp = json.timestamp && this.timestampFromJSON(json.timestamp) || new PomoTimestamp()
            pomo.breakTimestamp = json.breakTimestamp && this.timestampFromJSON(json.breakTimestamp)
            pomo.pauseTimestamps = json.pauseTimestamps
                && json.pauseTimestamps.map((x: string) => this.timestampFromJSON(x))
            pomo.project = json.project
            pomo.status = json.status
            pomo.currentTime = json.currentTime
            pomo.previousStatus = json.previousStatus
            console.log(json.currentTime)
            return pomo
        } catch (error) {
            console.error(error)
            return new Pomo()
        }
    }

    // converting to json implicitly converts date string into ISO format that screws stuff up.
    private timestampFromJSON(ts: any) {
        if (ts.startTime && ts.endTime) {
            return new PomoTimestamp(new Date(ts.startTime), new Date(ts.endTime))
        }
        // probably better way than
        console.error("date format error")
        return undefined
    }

    buildFromSchema(item: schemaPomo): Pomo {
        let pomo = new Pomo()
        pomo.id = Guid.parse(item.id)
        pomo.timestamp = item.timestamp && this.convertTimestampFromDB(item.timestamp)
        pomo.breakTimestamp = item.breakTimestamp && this.convertTimestampFromDB(item.breakTimestamp)
        pomo.pauseTimestamps = item.pauseTimestamps && item.pauseTimestamps.map(ts => this.convertTimestampFromDB(ts)) || []
        pomo.project = item.project && Guid.parse(item.project) || undefined
        pomo.status = (<any>PomoStatus)[item.status]
        pomo.currentTime = item.currentTime
        pomo.previousStatus = (<any>PomoStatus)[item.previousStatus]
        pomo.rating = item.rating
        pomo.interruptions = item.interruptions.map(x => Guid.parse(x))
        return pomo
    }

    exportToSchema(pomo: Pomo): schemaPomo {
        return {
            id: pomo.id && pomo.id.toString() || "error",
            timestamp: this.convertTimestampForDB(pomo.timestamp),
            breakTimestamp: pomo.breakTimestamp && this.convertTimestampForDB(pomo.breakTimestamp) || undefined,
            pauseTimestamps: this.convertPausesForDB(pomo.pauseTimestamps),
            project: pomo.project && pomo.project.toString(),
            status: pomo.status,
            rating: pomo.rating,
            interruptions: pomo.interruptions.map(x=> x.toString()),
            currentTime: pomo.currentTime,
            previousStatus: pomo.previousStatus
        }
    }

    private convertPausesForDB(ts: PomoTimestamp[]): schemaTimestamp[] {
        return ts.map(ts => this.convertTimestampForDB(ts))
    }

    private convertTimestampForDB(ts: PomoTimestamp): schemaTimestamp {
        return {
            startTime: ts.startTime.toString(),
            endTime: ts.endTime.toString()
        }
    }

    private convertTimestampFromDB(ts: schemaTimestamp): PomoTimestamp {
        return new PomoTimestamp(new Date(ts.startTime), new Date(ts.endTime))

    }


}