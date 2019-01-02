import { Observable, Subscription } from "rxjs";
import { observable, action } from "mobx";
import BaseRepository from "../repositories/BaseRepository";
import ValidationBuilder, { ISchema, ModelValidationOption, ModelValidatorType, FieldValidator } from "./validationBuilder";
import SubmitHelper from "./submitHelper";
import BaseBuilder from "./BaseBuilder";
import BaseImporter, { BaseSerializer } from "./baseImporter";
import ISerializer from "./baseImporter";
import { RxDocument } from "rxdb";


export interface ManagerOption<M, S extends ISchema> {
    validationConfig?: ModelValidationOption<S>
}

export default class BaseManager<M, S extends ISchema> {
    @observable queryResult: M[] = []
    @observable current: ModelValidatorType<S>

    repo: BaseRepository<M, S>
    private subscription?: Subscription
    private importer: ISerializer<S, M>
    private builder: ValidationBuilder<S>

    constructor(
        repo: BaseRepository<M, S>, 
        schemaObj: S, 
        modelObj: M, 
        importer?: ISerializer<S, M>, 
        opt?: ManagerOption<M, S>) {
        this.repo = repo
        this.builder = new ValidationBuilder<S>(schemaObj, opt && opt.validationConfig)
        this.current = this.builder.buildValidator()
        this.importer = importer ? importer : new BaseSerializer<S, M>(schemaObj,modelObj)
        this.startSubscription({})
    }

    async startSubscription(queryObj: any) {
        if (this.subscription) {
            this.subscription.unsubscribe()
        }
        const sub = await this.repo.get(queryObj)
        this.subscription = sub.subscribe(res => {
            
            // const json = res.map(r => r.toJSON())
            // this.queryResult = json.map((x: any) => this.importer.import(x))
        })
    }

    // not sure how I could test the observable values in Jest, so test stream separately for now
    getSubscriptionForTesting(queryObj: any) {
        return this.repo.get(queryObj)
    }

    @action handleEdit = (event: React.SyntheticEvent, fieldName: keyof S) => {
        const target = event.target as HTMLInputElement
        try {
            const field = this.current[fieldName] as FieldValidator<S>
            field.value = target.value
        } catch (err) {
            console.error('field doesnt exist in validator')
        }
    }

    async add() {
        this.builder.buildSchema(this.current).then(res => {
            this.repo.add(res).then(r => Promise.resolve(r))
                .catch(e => Promise.reject(new Error(e)))
        })

    }
}