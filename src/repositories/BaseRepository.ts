import { RxDatabase } from "rxdb";
import { getDatabase } from "../stores/database";


export default class BaseRepository {
    db?: RxDatabase

    async getDb() {
        if (this.db) return this.db
        this.db = await getDatabase('idb')
        // const syncState = await this.db.pomos.sync({
        //     remote: syncURL,
        //     direction: {
        //         pull: true,
        //         push: true
        //     }
        // })
        return this.db

    }
}