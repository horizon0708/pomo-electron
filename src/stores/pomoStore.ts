import { Pomo, PomoStatus } from "../models/pomo"
import { observable, computed, autorun, action} from "mobx"
import PomoConfig from "../models/pomoConfig";
import { PomoManager } from "../helper/pomoManager";

export default class PomoStore {
    @observable pomos: Pomo[] = []
    config = new PomoConfig()
    pomoManager: PomoManager

    constructor() {
        autorun(()=> console.log(this.pomos))
        this.addPomo()
        this.pomoManager = new PomoManager(this.pomos, this.config)
    }

    @computed get completedPomosCount() {
        return this.pomos
        .filter(p => p.status !== PomoStatus.deleted)
        .filter(p => p.status === PomoStatus.allDone).length
    }

    @computed get currentPomo(){
        if(this.pomos.length > 0 && this.pomos[0].status === PomoStatus.start) {
            return this.pomos[0]
        }
        return this.addPomo()
    }


    @computed get allPomosCount() { return this.pomos.length }

    @action addPomo(pomo?: Pomo): Pomo {
        const pomoToAdd = pomo || new Pomo()

        this.pomos.forEach(p => {
            if(p.status !== PomoStatus.allDone && p.status !== PomoStatus.deleted) {
                p.status = PomoStatus.allDone
            }
        })
        this.pomos.unshift(pomoToAdd)
        return pomoToAdd
    }
}