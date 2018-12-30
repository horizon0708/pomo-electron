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
            item: {
                type: "string"
            }
        },
        category: {
            type: "string"
        }
    }
}

export interface ISchemaProject {
    id: string
    name: string
    color: string
    status: number
    goal: number
}

export class SchemaProject implements ISchemaProject {
    id: string = ""
    name: string = ""
    color: string = ""
    status: number = 0
    goal: number= 0
}