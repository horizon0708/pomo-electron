import Tag from "../models/tag";
import { BaseSerializer, SerializeCallbacks } from "../helper/baseImporter";
import { serialize } from "../helper/serializationDecorators";
import { SchemaTag } from "../stores/tagSchema";
import { Pomo } from "../models/pomo";
import { SchemaPomo } from "../stores/database";
import { toPomoTimestamp, toTag, toProject } from "../helper/serializationCallbacks";
import { SchemaProject } from "../stores/projectSchema";
import Project from "../models/project";
import 'reflect-metadata'

describe("simple serialization", () => {
    const model = new Tag("asdf")
    const schema = new SchemaTag()
    const serializer = new BaseSerializer<SchemaTag, Tag>(schema, model)

    test("test", () => {
        const result = serializer.import(schema)
        expect(result.id).toEqual(schema.id)
        expect(result.color).toEqual(schema.color)
        expect(result.isTag).toEqual(schema.isTag)
        expect(result.name).toEqual(schema.name)
        expect(result.id).not.toEqual(model.id)
    })
})



describe("nested serialization : Project", () => {
    const model = new Project()
    const schema = new SchemaProject()
    schema.tags = [ new SchemaTag().id ]
    schema.category = new SchemaTag()

    const callbacks: SerializeCallbacks<Project> = {
        tags: (input)=> input.map(toTag),
        category: (input) =>toTag(input) , 
    }

    const serializer = new BaseSerializer<SchemaProject, Project>(schema, model, callbacks)
    test("test", () => {
        const result = serializer.import(schema)
        console.log(result)
        expect(result.id).toEqual(schema.id)
    })
})

describe("complex nested serialization : Pomo", () => {
    const model = new Pomo()
    const schema = new SchemaPomo()
    const project =  new SchemaProject() 
    project.tags = [ new SchemaTag().id ]
    schema.project = project
    const callbacks: SerializeCallbacks<Pomo> = {
        timestamp: toPomoTimestamp,
        pauseTimestamps: (input) => input.map(toPomoTimestamp),
        project: input => toProject(input)
    }

    const serializer = new BaseSerializer<SchemaPomo, Pomo>(schema, model, callbacks)

    test("test", () => {
        const result = serializer.import(schema)
        console.log(result)
        expect(result.id).toEqual(schema.id)
    })
})

