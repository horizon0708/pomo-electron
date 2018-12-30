import BaseRepository from "./BaseRepository";
import Project from "../models/project";
import { Observable, of } from "rxjs";
import { Guid } from "guid-typescript";


export default class ProjectRepository extends BaseRepository {
    //TODO: connect to db

    private mockProjects: Project[] = [new Project({ name: "Test1" }), new Project({ name: "Test2" })]

    async getAllProjects(): Promise<Observable<any>> {
        return of(this.mockProjects)
    }

    async getProjectGuid(guid: Guid) {
        const ind = this.mockProjects.findIndex(x => x.id.equals(guid))
        return ind > -1 ? this.mockProjects[ind] : null
    }

    async addProject(project: Project) {
        this.mockProjects.push(project)
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