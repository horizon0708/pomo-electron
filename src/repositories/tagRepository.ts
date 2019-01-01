import BaseRepository from "./BaseRepository";
import BaseBuilder from "../helper/BaseBuilder";
import TagBuilder from "../helper/tagBuilder";
import Tag from "../models/tag";

export default class TagRepository extends BaseRepository {
    builder = new TagBuilder()

    async getAllTags() {
        const db = await this.getDb()
        const query = db.tags
            .find()
            .where('isTag')
            .eq(true)

        return query.$
    }

    async getAllCategories() {
        const db = await this.getDb()
        const query = db.tags
            .find()
            .where('isTag')
            .eq(false)

        return query.$
    }

    async add(tag: Tag) {
        const db = await this.getDb()
        return db.tags
            .insert(this.builder.exportToSchema(tag))
            .then(x => {
                console.log(x.toJSON())
                return Promise.resolve(tag)
            })
            .catch(x => {
                return Promise.reject(new Error(x))
            })
    }

}