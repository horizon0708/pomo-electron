import PomoTask from "../models/pomoTask";
import { SchemaProject } from "./projectSchema";
import { SchemaTag } from "./tagSchema";
import { ISchema } from "../helper/validationBuilder";
import { SchemaPomo, PomoSchema } from "./database";
import { Guid } from "guid-typescript";
import { C_PROJECTS, C_POMOS, C_TAGS } from "../constants/databaseConstants";
import { serialize, foreignKey } from "../helper/serializationDecorators";

export const taskSchema = {
    title: "Task Collection",
    description: "Task Schema",
    version: 0,
    type: "object",
    properties: {
        id: {
            type: 'string',
            primary: true
        },
        pomos: {
            type: 'array', ref: C_POMOS,
            items: { type: "string", }
        },
        project: {
            ref: C_PROJECTS,
            type: "string"
        },
        name: {
            type: "string"
        },
        created: {
            type: "string"
        },
        tags: {
            type: "array", ref: C_TAGS,
            items: { type: "string" }
        },
        category: {
            type: "string",
            ref: C_TAGS
        },
        note: {
            type: "string"
        },
        isDone: {
            type: "boolean"
        },
        isHidden: {
            type: "boolean"
        },
    }
}


export interface ISchemaTask extends ISchema {
    id: string
    pomos: SchemaPomo[]
    project: SchemaProject | null
    name: string
    created: string
    tags: SchemaTag[]
    category: SchemaTag | null
    note: string | null
    isDone: boolean
    isHidden: boolean
}

export class SchemaTask implements ISchemaTask {
    @serialize id: string = Guid.create().toString()
    @foreignKey(C_POMOS) @serialize pomos: SchemaPomo[] = []
    @foreignKey(C_PROJECTS) @serialize project: SchemaProject | null = null
    @serialize created: string = new Date().toString()
    @foreignKey(C_TAGS) @serialize tags: SchemaTag[] = []
    @foreignKey(C_TAGS) @serialize category: SchemaTag | null = null
    @serialize note: string = ""
    @serialize isDone: boolean = false
    @serialize isHidden: boolean = false
    @serialize name: string = ""
}

