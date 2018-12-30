import { ISchemaTag, SchemaTag } from "../stores/tagSchema";
import Tag from "../models/tag";
import BaseBuilder from "./BaseBuilder";

export default class TagBuilder extends BaseBuilder<ISchemaTag, Tag> {
    buildFromSchema(schema: ISchemaTag): Tag {
        let tag = new Tag("untitled tag")
        return this.import(schema, tag)  
    }

    exportToSchema(tag: Tag): ISchemaTag {
        let schema = new SchemaTag() as ISchemaTag
        return this.export(tag, schema)
    }
}