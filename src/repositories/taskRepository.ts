import BaseRepository from "./BaseRepository";

export default class TaskRepository extends BaseRepository {


    async getAllTasks() {
        const db = await this.getDb()
        const query = db.tasks
            .find()
           
        query.$.subscribe(res => {
            const json = res.map(r => r.toJSON())
        })
    }
}