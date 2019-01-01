import { ISchema, SchemaValue } from "../helper/validationBuilder";
import { Guid } from "guid-typescript";

export const tagSchema = {
    title: "Tag Collection",
    description: "Tag Schema",
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
        isTag: {
            type: "boolean"
        }
    }
}

export interface ISchemaTag extends ISchema {
    id: string
    name: string
    color: string
    isTag: boolean
}

export class SchemaTag implements ISchemaTag{
    [key: string]: SchemaValue
    id: string = Guid.create().toString()
    name: string = "Unnamed Tag"
    color: string  = "red"
    isTag = true
}

