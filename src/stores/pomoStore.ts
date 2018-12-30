import { Pomo, PomoStatus } from "../models/pomo"
import { observable, computed, autorun, action } from "mobx"
import PomoConfig from "../models/pomoConfig";
import { PomoManager } from "../helper/pomoManager";
import PomoRepository from "../repositories/pomoRepository";
import { RxQuery, RxDocument } from "rxdb";
import ProjectRepository from "../repositories/projectRepository";
import Project from "../models/project";
import ProjectManager from "../helper/projectManager";
import TagRepository from "../repositories/tagRepository";
import TagManager from "../helper/tagManager";
import { DbName } from "../constants/databaseConstants";

export default class PomoStore {
    @observable pomos: Pomo[] = []
    @observable projects: Project[] = []
    config = new PomoConfig()
    pomoManager: PomoManager
    projectManager: ProjectManager
    pomoRepository = new PomoRepository()
    projectRepository = new ProjectRepository()
    tagRepo = new TagRepository()
    tagManager: TagManager

    constructor(dbName?: string) {
        if(dbName) {
            this.pomoRepository = new PomoRepository(dbName)
            this.projectRepository = new ProjectRepository(dbName)
            this.tagRepo = new TagRepository(dbName)
        }
        this.pomoManager = new PomoManager(this.pomos, this.config, this.pomoRepository)
        this.projectManager = new ProjectManager(this.config, this.projectRepository, this.pomoRepository)
        this.tagManager = new TagManager(this.tagRepo)
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
            this.pomos = json.map(j => this.pomoRepository.builder.buildFromSchema(j))
            console.log(json)
            
        })
    }

    async startAllProjectSubscription() {
        const sub = await this.projectRepository.getAllProjects()
        sub.subscribe(res => {
            // TODO: convert from json when converted from mock
            const json = res.map((r: any)=>r.toJSON())
            this.projects = json.map((x: any) => this.projectRepository.builder.buildFromSchema(x))
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