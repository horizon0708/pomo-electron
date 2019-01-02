import { PomoTimestamp } from "../models/pomo";
import Project from "../models/project";
import { BaseSerializer, SerializeCallbacks } from "./baseImporter";
import { SchemaTag } from "../stores/tagSchema";
import Tag from "../models/tag";
import { SchemaProject } from "../stores/projectSchema";
import { isNullOrUndefined } from "util";

export function toPomoTimestamp(input: any): PomoTimestamp {
    let output = new PomoTimestamp()
    if (input.startTime && input.endTime) {
        output.startTime = new Date(input.startTime)
        output.endTime = new Date(output.startTime)
    } else {
        console.warn("timestamp was not copied correctly!")
    }
    return output
}

export const getProjectBuilder = () => {
    const callbacks: SerializeCallbacks<Project> = {
        tags: (input) => input.map(toTag),
        category: (input) => toTag(input),
    }
    let serializer = new BaseSerializer<SchemaProject, Project>(new SchemaProject(), new Project(), callbacks)
    return serializer
}

export function toProject(input: any): Project | null {
    if (!isNullOrUndefined(input)) {
        const callbacks: SerializeCallbacks<Project> = {
            tags: (input) => input.map(toTag),
            category: (input) => toTag(input),
        }
        let serializer = new BaseSerializer<SchemaProject, Project>(new SchemaProject(), new Project(), callbacks)
        return serializer.import(input)
    }
    return null
}

export function toTag(input: any): Tag | null {
    if (!isNullOrUndefined(input)) {
        const serializer = new BaseSerializer<SchemaTag, Tag>(new SchemaTag(), new Tag("test"))
        return serializer.import(input)
    }
    return null
}

