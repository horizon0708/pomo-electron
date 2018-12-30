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

export interface ISchemaTag {
    id: string
    name: string
    color: string
    isTag: boolean
}

export class SchemaTag {
    id: string = ""
    name: string = ""
    color: string  = ""
    isTag = true
}

