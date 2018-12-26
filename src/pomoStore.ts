import { Pomo, PomoStatus } from "./models/pomo"
import { observable, computed, autorun, action} from "mobx"
import PomoConfig from "./models/pomoConfig";

export default class PomoStore {
    pomos: Pomo[] = observable([])
    config = new PomoConfig()
    currentPomo = new Pomo()

    constructor() {
        autorun(()=> console.log(this.pomos))
        this.addPomo()
    }

    @computed get completedPomosCount() {
        return this.pomos.filter(p => p.status === PomoStatus.done).length
    }

    @computed get allPomosCount() { return this.pomos.length }

    @action addPomo(pomo?: Pomo) {
        const pomoToAdd = pomo || new Pomo()

        this.pomos.forEach(p => {
            if(p.status === PomoStatus.inProgress || p.status === PomoStatus.break) {
                p.status = PomoStatus.done
            }
        })
        this.pomos.unshift(pomoToAdd)
    }
}