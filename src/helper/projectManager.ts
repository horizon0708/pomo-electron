import PomoConfig from "../models/pomoConfig";
import ProjectRepository from "../repositories/projectRepository";
import Project from "../models/project";
import { Guid } from "guid-typescript";
import PomoRepository from "../repositories/pomoRepository";

export default class ProjectManager {
    config: PomoConfig
    projectRepo: ProjectRepository
    pomoRepo: PomoRepository

    constructor(config: PomoConfig, projectRepo: ProjectRepository, pomoRepo: PomoRepository) {
        this.config = config
        this.projectRepo = projectRepo
        this.pomoRepo = pomoRepo
    }

    add(project:Project) {
        this.projectRepo.addProject(project)
    }

    update(project:Project) {
        this.projectRepo.updateProject(project)
    }

    delete(guid: Guid) {
        this.projectRepo.deleteProjectGuid(guid)
    }

    

    
}