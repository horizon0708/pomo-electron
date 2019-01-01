import { SchemaTag } from "../stores/tagSchema";
import BaseManager from "../helper/baseManager";
import Tag from "../models/tag";
import BaseRepository from "../repositories/BaseRepository";
import { Guid } from "guid-typescript";
import RxDB, { RxDatabase } from 'rxdb'
import { getDatabase } from "../stores/database";
RxDB.plugin(require('pouchdb-adapter-http'));
RxDB.plugin(require('pouchdb-adapter-idb'));
RxDB.plugin(require('pouchdb-adapter-memory'));

const schema = new SchemaTag()
const model = new Tag("tag name")
let repo: BaseRepository<Tag, SchemaTag>
let manager: BaseManager<Tag, SchemaTag>
// test("db", async () => {
// })

beforeAll(async () => {
    repo = new BaseRepository<Tag, SchemaTag>("tags", "testdb")
    manager = new BaseManager<Tag, SchemaTag>(repo, schema, model)
})


test("get > all things", async done => {
    const sub = await manager.getSubscriptionForTesting({})
    sub.subscribe(res=>{
        const json = res.map(r =>r.toJSON())
        console.log(json)
        done()
    })

    // expect(manager.current.name && manager.current.name.value).toBe("Unnamed Tag")
    // console.log(manager.current.name)
    // await expect(manager.queryResult)
    // console.log(manager.queryResult)
})
