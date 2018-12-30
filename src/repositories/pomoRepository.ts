import RxDB, { RxDatabase } from 'rxdb'
import { getDatabase } from '../stores/database';
import { Pomo, PomoStatus } from '../models/pomo';
import BaseRepository from './BaseRepository';
import PomoBuilder from '../helper/pomoBuilder';

const syncURL = 'http://localhost:10102/db/pomos'

// class responsible for dealing with DB
export default class PomoRepository extends BaseRepository{
    builder: PomoBuilder = new PomoBuilder()

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
    
    // adding shoul be observable maybe
    async addPomo(pomo: Pomo) {
        const db = await this.getDb()
        const data = this.builder.exportToSchema(pomo)
        db.pomos.insert({ ...data })
    }
}