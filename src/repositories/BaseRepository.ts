import { RxDatabase } from "rxdb";
import { getDatabase } from "../stores/database";


export default class BaseRepository {
    private _db?: RxDatabase
    private dbName = "pomodb"

    constructor(dbName?: string) {
        if(dbName) this.dbName = dbName
    }

    async getDb() {
        if (this._db) return this._db
        this._db = await getDatabase(this.dbName,'idb')
        // const syncState = await this.db.pomos.sync({
        //     remote: syncURL,
        //     direction: {
        //         pull: true,
        //         push: true
        //     }
        // })
        return this._db

    }
}   