import { ISchemaProject, SchemaProject } from "../stores/projectSchema";
import Project, { ProjectStatus } from "../models/project";
import { Guid } from "guid-typescript";
import BaseBuilder from "./BaseBuilder";

export default class ProjectBuilder extends BaseBuilder<ISchemaProject, Project> {

    buildFromSchema(s: ISchemaProject): Project {
        let _p = new Project()
        let p = this.import(s, _p)
        console.log(p)
        return p
    }

    exportToSchema(p: Project): ISchemaProject {
        let _p = new SchemaProject() 
        return this.export(p, _p)        
    }
}