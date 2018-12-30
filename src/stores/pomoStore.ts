import { Pomo, PomoStatus } from "../models/pomo"
import { observable, computed, autorun, action } from "mobx"
import PomoConfig from "../models/pomoConfig";
import { PomoManager } from "../helper/pomoManager";
import PomoRepository from "../repositories/pomoRepository";
import { RxQuery } from "rxdb";
import ProjectRepository from "../repositories/projectRepository";
import Project from "../models/project";
import ProjectManager from "../helper/projectManager";

export default class PomoStore {
    @observable pomos: Pomo[] = []
    @observable projects: Project[] = []
    config = new PomoConfig()
    pomoManager: PomoManager
    ProjectManager: ProjectManager
    pomoRepository = new PomoRepository()
    projectRepository = new ProjectRepository()

    constructor() {
        this.pomoManager = new PomoManager(this.pomos, this.config, this.pomoRepository)
        this.ProjectManager = new ProjectManager(this.config, this.projectRepository, this.pomoRepository)
        this.startAllPomoSubscription()
        this.startAllProjectSubscription()

        // this.repository.allPomosPromise && this.repository.allPomosPromise().then(res => {
        //     const data = res.map(r => {
        //         return r.toJSON()
        //     })
        //     console.log(data)
        // })
    }

    async startAllPomoSubscription() {
        const pomoSubscription = await this.pomoRepository.getAllPomos()
        pomoSubscription.subscribe(res => {
            const json = res.map(r=>r.toJSON())
            this.pomos = json.map(j => this.pomoRepository.mapper.fromDB(j))
            console.log(json)
            
        })
    }

    async startAllProjectSubscription() {
        const sub = await this.projectRepository.getAllProjects()
        sub.subscribe(res => {
            // TODO: convert from json when converted from mock
            this.projects = res
        })
    }

    @computed get completedPomosCount() {
        return this.pomos
            .filter(p => p.status !== PomoStatus.deleted)
            .filter(p => p.status === PomoStatus.allDone).length
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