import { schemaPomo, schemaTimestamp } from "../stores/database";
import { Pomo, PomoTimestamp, PomoStatus } from "./pomo";
import { Guid } from "guid-typescript";

export default class PomoBuilder {

    buildFromSchema(item: schemaPomo): Pomo {
        let pomo = new Pomo()
        pomo.id = Guid.parse(item.id)
        pomo.timestamp = item.timestamp && this.convertTimestampFromDB(item.timestamp)
        pomo.breakTimestamp = item.breakTimestamp && this.convertTimestampFromDB(item.breakTimestamp)
        pomo.pauseTimestamps = item.pauseTimestamps && item.pauseTimestamps.map(ts => this.convertTimestampFromDB(ts)) || []
        pomo.projects = item.projects.map(p => {
            const { ratio, projectId } = p
            return {
                ratio, projectId
            }
        })
        pomo.status = (<any>PomoStatus)[item.status]
        pomo.currentTime = item.currentTime
        pomo.previousStatus = (<any>PomoStatus)[item.previousStatus]
        return pomo
    }


    exportToSchema(pomo: Pomo): schemaPomo {
        return {
            id: pomo.id.toString(),
            timestamp: this.convertTimestampForDB(pomo.timestamp),
            breakTimestamp: pomo.breakTimestamp && this.convertTimestampForDB(pomo.breakTimestamp) || undefined,
            pauseTimestamps: this.convertPausesForDB(pomo.pauseTimestamps),
            projects: pomo.projects.map(p => {
                const { ratio, projectId } = p
                return {
                    ratio, projectId
                }
            }),
            status: pomo.status, 
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