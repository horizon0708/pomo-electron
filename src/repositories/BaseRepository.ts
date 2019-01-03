import { getDatabase } from "../stores/database";
import { ISchema } from "../helper/validationBuilder";
import BaseImporter from "../helper/baseImporter";
import RxDB, { RxDatabase } from 'rxdb'
import { FOREIGN_KEY_METADATA } from "../helper/serializationDecorators";
import { map, mergeMap } from "rxjs/operators";
import { injectable } from "inversify";
RxDB.plugin(require('pouchdb-adapter-http'));
RxDB.plugin(require('pouchdb-adapter-idb'));

@injectable()
export default class BaseRepository<M, S extends ISchema> {
    private _db?: RxDatabase
    private dbName = "pomodb"
    private collectionName: string
    // private schema: S

    constructor(collectionName: string, dbName?: string) {
        if (dbName) this.dbName = dbName
        this.collectionName = collectionName
        // this.schema = schema
    }

    async getDb() {
        if (this._db) return this._db
        this._db = await getDatabase(this.dbName, 'idb')
        // const syncState = await this.db.pomos.sync({
        //     remote: syncURL,
        //     direction: {
        //         pull: true,
        //         push: true
        //     }
        // })
        return this._db
    }

    async getOne() {
        const db = await this.getDb()
        const one = await db[this.collectionName].findOne({ id: "seed1" }).exec()
        one.populate("category").then((x: any) => console.log("promise!"))
        // console.dir(tags.toJSON())
        // for (let key in this.schema) {
        //     if(this.schema.hasOwnProperty(key)) {
        //         const foreign = Reflect.getMetadata(FOREIGN_KEY_METADATA, this.schema, key)
        //         // console.log(key + "->" + foreign)
        //         if(foreign && foreign.collection)  {
        //             console.log("populating " + key)
        //             const tags = await one.populate(key)
        //             let res;
        //             if(Array.isArray(tags)) {
        //                 res = tags.map(x=>x.toJSON()) 
        //             } else {
        //                 console.log(tags.toJSON())
        //             }
        //             console.log(res)
        //         }
        //     }
        // }
        // console.log(tags.map((x:any)=> x.toJSON()))
        console.log('returning')
        return one
    }

    async get(queryObj: any) {
        const db = await this.getDb()
        return db[this.collectionName]        
            .find(queryObj).$

        // return db[this.collectionName]
        //     .find(queryObj).$.pipe(mergeMap(items => {
        //         // console.log(items)
        //         const promises = items.map(item => [item.tags_, item.category_])
        //         const flattened: any[] = ([] as any).concat(...promises)
        //         const jsons = items.map(item => item.toJSON())
        //         return Promise.all(flattened)
        //         .then(res => {
        //             let counter = 0  
        //             jsons.forEach(j => {
        //                 j.tags = res[counter].map((a: any) => a.toJSON())
        //                 counter++
        //                 j.category = res[counter].toJSON()
        //                 counter++
        //             })
        //             return jsons 
        //         })

       
        //     }))
    }

    async update(item: S): Promise<S> {
        const db = await this.getDb()
        return db[this.collectionName]
            .update(item)
            .then((res: S) => {
                return Promise.resolve(res)
            })
            .catch((err: any) => {
                return Promise.reject(new Error(err))
            })
    }

    async delete(queryObj: any): Promise<S> {
        const db = await this.getDb()
        return db[this.collectionName]
            .find(queryObj)
            .remove()
            .then((res: any) => {
                return Promise.resolve(res)
            })
            .catch((err: any) => {
                return Promise.reject(new Error(err))
            })

    }

    async add(item: S): Promise<S> {
        const db = await this.getDb()
        return db[this.collectionName]
            .insert(item)
            .then(res => {
                return Promise.resolve(res)
            })
            .catch(x => {
                return Promise.reject(new Error(x))
            })
    }
}   