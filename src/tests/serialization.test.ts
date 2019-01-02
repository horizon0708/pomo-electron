import Tag from "../models/tag";
import { BaseSerializer } from "../helper/baseImporter";
import { serialize } from "../helper/serializationDecorators";
import 'reflect-metadata'
import { SchemaTag } from "../stores/tagSchema";

const model = new Tag("asdf")
const schema = new SchemaTag()
const serializer = new BaseSerializer<SchemaTag, Tag>(schema, model)

test("test", ()=>{
    const result = serializer.import(schema)
    expect(result.id).toEqual(schema.id)
    expect(result.color).toEqual(schema.color)
    expect(result.isTag).toEqual(schema.isTag)
    expect(result.name).toEqual(schema.name)
    expect(result.id).not.toEqual(model.id)
})