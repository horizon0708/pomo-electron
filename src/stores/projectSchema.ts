import { ISchema } from "../helper/validationBuilder";
import { serialize, foreignKey } from "../helper/serializationDecorators";
import { SchemaTag } from "./tagSchema";
import { C_TAGS } from "../constants/databaseConstants";
import { Guid } from "guid-typescript";

export const projectSchema = {
    title: "Project Collection",
    description: "Project Schema",
    version: 0,
    type: "object",
    properties: {
        id: {
            type: 'string',
            primary: true
        },
        name: {
            type: 'string'
        },
        color: {
            type: "string"
        },
        status: {
            type: "number"
        },
        goal: {
            type: "number"
        },
        tags: {
            type: "array",
            ref: C_TAGS,
            items: {
                type: "string"
            }
        },
        category: {
            ref: C_TAGS,
            type: "string"
        }
    }
}

export interface ISchemaProject extends ISchema {
    id: string
    name: string
    color: string
    status: number
    tags: string[]
    category: string | undefined
    goal: number
}

export class SchemaProject implements ISchemaProject {
    @foreignKey(C_TAGS) @serialize tags: string[] = []
    @foreignKey(C_TAGS) @serialize category: string | undefined = undefined
    @serialize id: string = Guid.create().toString()
    @serialize name: string = "Untitled Project"
    @serialize color: string = "Red"
    @serialize status: number = 0
    @serialize goal: number= 0
}