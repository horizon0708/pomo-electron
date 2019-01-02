import BaseManager from "../helper/baseManager";
import BaseRepository from "../repositories/BaseRepository";
import { Guid } from "guid-typescript";
import RxDB, { RxDatabase } from 'rxdb'
import { getDatabase } from "../stores/database";
import { C_PROJECTS } from "../constants/databaseConstants";
import { SchemaProject } from "../stores/projectSchema";
import Project from "../models/project";
import { getProjectBuilder } from "../helper/serializationCallbacks";
RxDB.plugin(require('pouchdb-adapter-http'));
RxDB.plugin(require('pouchdb-adapter-idb'));
RxDB.plugin(require('pouchdb-adapter-memory'));
import { map } from 'rxjs/operators'


const schema = new SchemaProject()
const model = new Project("test project name")
let repo: BaseRepository<Project, SchemaProject>
let manager: BaseManager<Project, SchemaProject>
// test("db", async () => {
// })

beforeAll(async () => {
    repo = new BaseRepository<Project, SchemaProject>(C_PROJECTS, new SchemaProject(), "testdb")
    manager = new BaseManager<Project, SchemaProject>(repo, schema, model, getProjectBuilder())
})


test("get > all things", async done => {
    const sub = await manager.getSubscriptionForTesting({})

    sub.subscribe(res => {
        console.log(res)
        done()
        // res.then(r => {
        //     console.log(r)
        //     done()
        // })
        // const json = res.map(r => r.toJSON())
    })

    // expect(manager.current.name && manager.current.name.value).toBe("Unnamed Tag")
    // console.log(manager.current.name)
    // await expect(manager.queryResult)
    // console.log(manager.queryResult)
})

// test("get > one", async done => {
//     const res = await manager.repo.getOne()
//     if (res) {
//         console.log(res.toJSON())
//     }
//     done()
// })
