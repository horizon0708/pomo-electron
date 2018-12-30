export const interruptionSchema = {
    title: "Interruption Collection",
    description: "Interruptions Schema",
    version: 0,
    type: "object",
    properties: {
        id: {
            type: "string"
        },
        reason: {
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

export interface schemaInterruption {
    id: string
    reason?: string
    note: string
    timestamp: string
}