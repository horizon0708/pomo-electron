import { serialize, foreignKey } from "../helper/serializationDecorators";
import { Guid } from "guid-typescript";
import { ISchema } from "../helper/validationBuilder";
import { C_REASONS } from "../constants/databaseConstants";

export const interruptionSchema = {
    title: "Interruption Collection",
    description: "Interruptions Schema",
    version: 0,
    type: "object",
    properties: {
        id: {
            type: "string",
            primary: true
        },
        reason: {
            ref: C_REASONS, 
            type: "string"
        },
        note: {
            type: "string"
        },
        timestamp: {
            type: "string"
        },
    }
}

export const reasonSchema = {
    title: "reason Collection",
    description: "reason Schema",
    version: 0,
    type: "object",
    properties: {
        id: {
            type: "string",
            primary: true
        },
        name: {
            type: "string"
        },
        color: {
            type: "string"
        }
    }
}
export interface schemaInterruption {
    id: string
    reason?: string
    note: string
    timestamp: string
}

export default class SchemaInterruption implements ISchema {
    @serialize id: string = Guid.create().toString()
    @foreignKey(C_REASONS) @serialize reason?: SchemaReason  
    @serialize note: string = ""
    @serialize timestamp: string = new Date().toString()
}

export class SchemaReason implements ISchema {
    @serialize id: string = Guid.create().toString()
    @serialize name: string = "" 
    @serialize color: string = "red"
}