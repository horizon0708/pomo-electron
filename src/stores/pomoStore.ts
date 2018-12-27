import { Pomo, PomoStatus } from "../models/pomo"
import { observable, computed, autorun, action } from "mobx"
import PomoConfig from "../models/pomoConfig";
import { PomoManager } from "../helper/pomoManager";
import PomoRepository from "./pomoRepository";
import { RxQuery } from "rxdb";

export default class PomoStore {
    @observable pomos: Pomo[] = []
    config = new PomoConfig()
    pomoManager: PomoManager
    repository = new PomoRepository()

    constructor() {
        this.pomoManager = new PomoManager(this.pomos, this.config)
        this.startAllPomoSubscription()

        // this.repository.allPomosPromise && this.repository.allPomosPromise().then(res => {
        //     const data = res.map(r => {
        //         return r.toJSON()
        //     })
        //     console.log(data)
        // })
    }

    async startAllPomoSubscription() {
        const pomoSubscription = await this.repository.getAllPomos()
        pomoSubscription.subscribe(res => {
            const json = res.map(r=>r.toJSON())
            this.pomos = json.map(j => this.repository.mapper.fromDB(j))
            console.log(json)
            
        })
    }

    @computed get completedPomosCount() {
        return this.pomos
            .filter(p => p.status !== PomoStatus.deleted)
            .filter(p => p.status === PomoStatus.allDone).length
    }

    @computed get currentPomo() {
        if (this.pomos.length > 0 && this.pomos[0].status === PomoStatus.start) {
            return this.pomos[0]
        }
        return this.addPomo()
    }


    @computed get allPomosCount() { return this.pomos.length }

    @action addPomo(pomo?: Pomo): Pomo {
        const pomoToAdd = pomo || new Pomo()

        this.pomos.forEach(p => {
            if (p.status !== PomoStatus.allDone && p.status !== PomoStatus.deleted) {
                p.status = PomoStatus.allDone
            }
        })
        this.pomos.unshift(pomoToAdd)
        return pomoToAdd
    }
}