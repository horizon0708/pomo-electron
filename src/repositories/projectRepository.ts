import BaseRepository from "./BaseRepository";
import Project from "../models/project";
import { Observable, of } from "rxjs";
import { Guid } from "guid-typescript";
import ProjectBuilder from "../helper/projectBuilder";


export default class ProjectRepository extends BaseRepository {
    //TODO: connect to db
    builder: ProjectBuilder = new ProjectBuilder()
    private mockProjects: Project[] = [new Project("test1"), new Project("test2")]

    async getAllProjects(): Promise<Observable<any>> {
        const db = await this.getDb()
        const query = db.projects
            .find()
        
        return query.$
    }

    async getProjectGuid(guid: Guid) {
        const ind = this.mockProjects.findIndex(x => x.id.equals(guid))
        return ind > -1 ? this.mockProjects[ind] : null
    }

    async addProject(projectToInsert: Project) {
        const db = await this.getDb()
        const project = this.builder.exportToSchema(projectToInsert) 
        return db.projects.insert(project)
        .then(()=>Promise.resolve(projectToInsert))
        .catch(()=>Promise.reject(new Error("db insert error")))
    }

    async updateProject(project: Project) {
        const ind = this.mockProjects.findIndex(x => x.id.equals(project.id))
        if (ind === -1) {
            console.error('project not found')
        }
        this.mockProjects[ind] = project
    }

    async deleteProject(projectId: string) {
        const ind = this.mockProjects.findIndex(x => x.id.toString() === projectId)
        if (ind === -1) {
            console.error('project not found')
        }
        this.mockProjects.splice(ind, 1)
    }

    async deleteProjectGuid(projectGuid: Guid) {
        const ind = this.mockProjects.findIndex(x => x.id.equals(projectGuid))
        if (ind === -1) {
            console.error('project not found')
        }
        this.mockProjects.splice(ind, 1)
    }
}