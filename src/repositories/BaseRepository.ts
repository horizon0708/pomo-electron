import { getDatabase } from "../stores/database";
import { ISchema } from "../helper/validationBuilder";
import BaseImporter from "../helper/baseImporter";
import RxDB, { RxDatabase } from 'rxdb'
RxDB.plugin(require('pouchdb-adapter-http'));
RxDB.plugin(require('pouchdb-adapter-idb'));

export default class BaseRepository<M, S extends ISchema> {
    private _db?: RxDatabase
    private dbName = "pomodb"
    private collectionName: string

    constructor(collectionName: string, dbName?: string) {
        if (dbName) this.dbName = dbName
        this.collectionName = collectionName
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

    async get(queryObj: any) {
        const db = await this.getDb()

        return db[this.collectionName]
            .find(queryObj).$
    }

    async update(item: S): Promise<S | Error> {
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

    async delete(queryObj: any): Promise<S | Error> {
        const db = await this.getDb()
        return db[this.collectionName]
            .find(queryObj)
            .remove()
            .then((res: any) => {
                return Promise.resolve(res)
            }) 
            .catch((err:any)=> {
                return Promise.reject(new Error(err))
            })
            
    }

    async add(item: S): Promise<S | Error> {
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