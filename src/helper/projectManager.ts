import PomoConfig from "../models/pomoConfig";
import ProjectRepository from "../repositories/projectRepository";
import Project from "../models/project";
import { Guid } from "guid-typescript";
import PomoRepository from "../repositories/pomoRepository";
import { observable } from "mobx";
import BaseManager from "./baseManager";
import SubmitHelper from "./submitHelper";

export default class ProjectManager extends BaseManager{
    config: PomoConfig
    projectRepo: ProjectRepository
    pomoRepo: PomoRepository
    @observable allProjects: Project[] = []

    @observable editingProject = new Project("")
    editor = new SubmitHelper<Project>()

    constructor(config: PomoConfig, projectRepo: ProjectRepository, pomoRepo: PomoRepository) {
        super() 
        this.config = config
        this.projectRepo = projectRepo
        this.pomoRepo = pomoRepo

        this.startAllProjectSubscription()
        // this.test()
    }

 

    async addNew() {
        let project = this.editingProject
        return this.editor.submit(this.projectRepo.addProject(project))
            .then(r=> Promise.resolve(r))
            .catch((e)=> Promise.reject(e))
            .finally(()=> this.editingProject = new Project(""))
    }

    add(project: Project) {
        this.projectRepo.addProject(project)
    }

    update(project: Project) {
        this.projectRepo.updateProject(project)
    }

    delete(guid: Guid) {
        this.projectRepo.deleteProjectGuid(guid)
    }


    async startAllProjectSubscription() {
        const sub = await this.projectRepo.getAllProjects()
        sub.subscribe(res => {
            // TODO: convert from json when converted from mock
            const json = res.map((r: any)=>r.toJSON())
            console.log(json)
            this.allProjects = json.map((x: any) => this.projectRepo.builder.buildFromSchema(x))
        })
    }

    // async test(){
    //     const sub = await this.projectRepo.getAllProjects()
    //     let ref = this.allProjects
    //     let builder = (x: any) => this.projectRepo.builder.buildFromSchema(x)
    //     this.startSubscription(sub, ref, builder)
    // }

}