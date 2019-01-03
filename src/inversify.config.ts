import { Container, interfaces } from "inversify"
import ISerializer, { BaseSerializer, SerializeCallbacks } from "./helper/baseImporter";
import { SchemaProject } from "./stores/projectSchema";
import Project from "./models/project";
import { IOC, C_TAGS, C_POMOS, C_PROJECTS, C_INTERRUPTIONS, C_REASONS, C_TASKS, TEST_DB_NAME, IocName } from "./constants/databaseConstants";
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
import ValidationBuilder from "./helper/validationBuilder";
import { getProjectValidator, getPomoValidator, getTagValidator, getInterruptionValidator, getReasonValidator, getTaskValidator } from "./helper/validationBuilderOptions";
import BaseManager from "./helper/baseManager";
import { any } from "prop-types";




function buildRepo(dbName: string) {
    let container = new Container()

    //https://github.com/inversify/InversifyJS/issues/530


    //serializers
    const projSerializer = getProjectBuilder()
    container.bind<ISerializer<SchemaProject, Project>>(IOC.base.serializer).toConstantValue(projSerializer).whenTargetNamed("project")

    const tagSerializer = new BaseSerializer<SchemaTag, Tag>(new SchemaTag(), new Tag("untitled tag"))
    container.bind<ISerializer<SchemaTag, Tag>>(IOC.base.serializer).toConstantValue(tagSerializer).whenTargetNamed("tag")
    container.bind<ISerializer<SchemaTag, Tag>>(IOC.base.serializer).toConstantValue(tagSerializer).whenTargetIsDefault()


    //validation builders
    container.bind<ValidationBuilder<SchemaProject>>(IOC.base.validation).toConstantValue(getProjectValidator()).whenTargetNamed("project")
    // container.bind<ValidationBuilder<SchemaPomo>>(IOC.pomoValidation).toConstantValue(getPomoValidator())
    container.bind<ValidationBuilder<SchemaTag>>(IOC.base.validation).toConstantValue(getTagValidator()).whenTargetNamed("tag")
    container.bind<ValidationBuilder<SchemaTag>>(IOC.base.validation).toConstantValue(getTagValidator()).whenTargetIsDefault()
    // container.bind<ValidationBuilder<SchemaInterruption>>(IOC.interruptionValidation).toConstantValue(getInterruptionValidator())
    // container.bind<ValidationBuilder<SchemaReason>>(IOC.reasonValidation).toConstantValue(getReasonValidator())
    // container.bind<ValidationBuilder<SchemaTask>>(IOC.taskValidation).toConstantValue(getTaskValidator())

    //repositories


    const tagRepo = new BaseRepository<Tag, SchemaTag>(C_TAGS, dbName)
    container.bind<BaseRepository<Tag, SchemaTag>>(IOC.tag.repo).toConstantValue(tagRepo)

    const pomoRepo = new BaseRepository<Pomo, SchemaPomo>(C_POMOS, dbName)
    container.bind<BaseRepository<Pomo, SchemaPomo>>(IOC.pomo.repo).toConstantValue(pomoRepo)

    const projectRepo = new BaseRepository<Project, SchemaProject>(C_PROJECTS, dbName)
    container.bind<BaseRepository<Project, SchemaProject>>(IOC.project.repo).toConstantValue(projectRepo)

    const interruptionRepo = new BaseRepository<PomoInterruption, SchemaInterruption>(C_INTERRUPTIONS, dbName)
    container.bind<BaseRepository<PomoInterruption, SchemaInterruption>>(IOC.interruption.repo).toConstantValue(interruptionRepo)

    const reasonRepo = new BaseRepository<PomoInterruptionReason, SchemaReason>(C_REASONS, dbName)
    container.bind<BaseRepository<PomoInterruptionReason, SchemaReason>>(IOC.reason.repo).toConstantValue(reasonRepo)

    const taskRepo = new BaseRepository<PomoTask, SchemaTask>(C_TASKS, dbName)
    container.bind<BaseRepository<PomoTask, SchemaTask>>(IOC.task.repo).toConstantValue(taskRepo)

    // multiple to different
    //https://github.com/inversify/InversifyJS/issues/428
    
    container.bind<BaseManager<any, any>>(IOC.base.manager).to(BaseManager)
    container.bind<BaseRepository<any, any>>(IOC.base.repo).toConstantValue(tagRepo).whenParentNamed("tag")
    container.bind<BaseRepository<any, any>>(IOC.base.repo).toConstantValue(projectRepo).whenParentNamed("project")
    container.bind<BaseRepository<any, any>>(IOC.base.repo).toConstantValue(pomoRepo).whenParentNamed("pomo")
    container.bind<BaseRepository<any, any>>(IOC.base.repo).toConstantValue(interruptionRepo).whenParentNamed("interruption")
    container.bind<BaseRepository<any, any>>(IOC.base.repo).toConstantValue(reasonRepo).whenParentNamed("reason")
    container.bind<BaseRepository<any, any>>(IOC.base.repo).toConstantValue(taskRepo).whenParentNamed("task")
    // container.bind<BaseRepository<any, any>>(IOC.base.repo).toConstantValue(pomoRepo).whenTargetIsDefault()


    container.bind<interfaces.Factory<BaseManager<any, any>>>(IOC.factory.manager).toFactory<BaseManager<any, any>>(
        (context: interfaces.Context) => {
            return (name: string) => {
                return context.container.getNamed<BaseManager<any, any>>(IOC.base.manager, name)
            }
        }
    )

    return container
}

export const container = buildRepo("pomodb")



export const testContainer = buildRepo(TEST_DB_NAME)