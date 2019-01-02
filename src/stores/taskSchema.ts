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

export interface ISchemaTask {
    id: string
    name: string
    color: string
    isTag: boolean
}

export class SchemaTask {
    id: string = ""
    name: string = ""
    color: string  = ""
    isTag = true
}

