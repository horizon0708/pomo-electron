import { Container, interfaces } from "inversify"
import { BaseSerializer, SerializeCallbacks } from "./helper/baseImporter";
import { SchemaProject } from "./stores/projectSchema";
import Project from "./models/project";
import { IOC, C_TAGS, C_POMOS, C_PROJECTS, C_INTERRUPTIONS, C_REASONS, C_TASKS, TEST_DB_NAME } from "./constants/databaseConstants";
import { SchemaTag } from "./stores/tagSchema";
import Tag from "./models/tag";
import BaseRepository from "./repositories/BaseRepository";
import { getProjectBuilder } from "./helper/serializationCallbacks";
import PomoInterruption, { PomoInterruptionReason } from "./models/pomoInterruption";
import PomoTask from "./models/pomoTask";
import { Pomo } from "./models/pomo";
import { SchemaPomo } from "./stores/database";
import SchemaInterruption, { SchemaReason } from "./stores/interruptionSchema";
import { SchemaTask } from "./stores/taskSchema";



let container = new Container()


//https://github.com/inversify/InversifyJS/issues/530


//serializers
const projSerializer = getProjectBuilder()
container.bind<BaseSerializer<SchemaProject, Project>>(IOC.projectSerializer).toConstantValue(projSerializer)


const tagSerializer = new BaseSerializer<SchemaTag, Tag>(new SchemaTag(), new Tag("untitled tag"))
container.bind<BaseSerializer<SchemaTag, Tag>>(IOC.tagSerializer).toConstantValue(tagSerializer)





function setupRepo(container: Container, dbName: string) {
    //repositories
    const tagRepo = new BaseRepository<Tag, SchemaTag>(C_TAGS, dbName)
    container.bind<BaseRepository<Tag, SchemaTag>>(IOC.tagRepo).toConstantValue(tagRepo)
    

    const pomoRepo = new BaseRepository<Pomo, SchemaPomo>(C_POMOS, dbName)
    container.bind<BaseRepository<Pomo, SchemaPomo>>(IOC.pomoRepo).toConstantValue(pomoRepo)
    

    const projectRepo = new BaseRepository<Project, SchemaProject>(C_PROJECTS, dbName)
    container.bind<BaseRepository<Project, SchemaProject>>(IOC.projectRepo).toConstantValue(projectRepo)
    

    const interruptionRepo = new BaseRepository<PomoInterruption, SchemaInterruption>(C_INTERRUPTIONS, dbName)
    container.bind<BaseRepository<PomoInterruption, SchemaInterruption>>(IOC.interruptionRepo).toConstantValue(interruptionRepo)
    

    const reasonRepo = new BaseRepository<PomoInterruptionReason, SchemaReason>(C_REASONS, dbName)
    container.bind<BaseRepository<PomoInterruptionReason, SchemaReason>>(IOC.reasonRepo).toConstantValue(reasonRepo)
    

    const taskRepo = new BaseRepository<PomoTask, SchemaTask>(C_TASKS, dbName)
    container.bind<BaseRepository<PomoTask, SchemaTask>>(IOC.taskRepo).toConstantValue(taskRepo)
    
}

setupRepo(TEST_DB_NAME)

export default container
