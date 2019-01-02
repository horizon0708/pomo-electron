import { ISchema, SchemaValue } from "../helper/validationBuilder";
import { Guid } from "guid-typescript";
import { notEditable } from "../helper/validationDecorator";
import { serialize  } from "../helper/serializationDecorators";
import 'reflect-metadata'

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
        },
        isProject: {
            type: "boolean"
        }
    }
}

export interface ISchemaTag extends ISchema {
    id: string
    name: string
    color: string
    isTag: boolean
    isProject: boolean
}
export class SchemaTag implements ISchemaTag{
    [key: string]: SchemaValue

    @serialize 
    @notEditable
    id: string = Guid.create().toString()
    
    @serialize
    name: string = "Unnamed Tag"

    @serialize
    color: string  = "red"

    @notEditable
    @serialize
    isTag: boolean = true

    @serialize
    isProject: boolean = true
}

