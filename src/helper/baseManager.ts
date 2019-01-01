import { Observable } from "rxjs";
import { observable } from "mobx";
import BaseRepository from "../repositories/BaseRepository";
import ValidationBuilder, { ISchema } from "./validationBuilder";

export default class BaseManager<M, S extends ISchema> {
    @observable getAll: M[] = []
    @observable current: ValidationBuilder<S>

    repo: BaseRepository

    constructor(repo: BaseRepository) {
        this.repo = repo
    }


    async startSubscription(subscription: Observable<any[]>, ref: any, builder: (d: any)=> any) {
        subscription.subscribe(res => {
            const json = res.map(r=>r.toJSON())
            ref = json.map(builder) 
        }) 
    }
}