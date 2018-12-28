import RxDB, { RxDatabase } from 'rxdb'
import { getDatabase } from './database';
import PomoMapper from './pomoMapper';
import { Pomo, PomoStatus } from '../models/pomo';

const syncURL = 'http://localhost:10102/db/pomos'

// class responsible for dealing with DB
export default class PomoRepository {
    mapper = new PomoMapper()
    db?: RxDatabase

    constructor() {
        this.getDb().then()
    }

    async getDb(){
        console.log("getting db")
        if(this.db) return this.db

        this.db = await getDatabase('idb')
        // const syncState = await this.db.pomos.sync({
        //     remote: syncURL,
        //     direction: {
        //         pull: true,
        //         push: true
        //     }
        // })

        // seed one pomo ?
        // const testPomo = this.mapper.toDB(new Pomo())


        // db.pomos.insert({
        //     ...testPomo
        // })

        // this.db.pomos.find().exec()
        // .then(res =>{
        //     res.forEach(r => {
        //         console.log(r.get("id"))
        //     })
        // })
        return this.db
    }

    async getAllPomos() {
        const db = await this.getDb() 
        const query = db.pomos
         .find()
         .where('status')
         .ne(PomoStatus.deleted)
        //  .sort("timestamp.startTime")

        return query.$
    }

    async allPomosPromise() {
        const db = await this.getDb()
        return db.pomos
         .find()
         .where('status')
         .ne(PomoStatus.deleted)
        //  .sort("timestamp.startTime")
            .exec()
    }

    async addPomo(pomo: Pomo) {
        const db = await this.getDb()
        const data = this.mapper.builder.exportToSchema(pomo)
        db.pomos.insert({ ...data })
    }
}