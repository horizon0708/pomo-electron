import { Container, interfaces } from "inversify"
import { BaseSerializer, SerializeCallbacks } from "./helper/baseImporter";
import { SchemaProject } from "./stores/projectSchema";
import Project from "./models/project";
import { IOC } from "./constants/databaseConstants";



let container = new Container()

let test = new SchemaProject()
//https://github.com/inversify/InversifyJS/issues/530
container.bind<() => BaseSerializer<SchemaProject, Project>>(IOC.projectSerializer).toFactory<BaseSerializer<SchemaProject, Project>>(
    (context: interfaces.Context) => {
        return () => {
            const callbacks: SerializeCallbacks<Project> = {
                // tags: (input) => input.map(toTag),
                // category: (input) => toTag(input),
            }



            return new BaseSerializer<SchemaProject, Project>(new SchemaProject(), new Project(), callbacks)
        }
    }

)


    let testFact =  container.get<()=>BaseSerializer<SchemaProject, Project>>(IOC.projectSerializer)

    testFact()