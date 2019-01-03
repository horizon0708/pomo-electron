import { reasonSchema } from "../stores/interruptionSchema";

export const TEST_DB_NAME = "test_db"
export const DEV_DB_NAME = "pomodb"

export type DbName = "TEST_DB" | "pomodb"

export const C_POMOS = "pomos_collection"
export const C_PROJECTS = "projects_collection"
export const C_INTERRUPTIONS = "interruptions_collection"
export const C_TAGS = "tags_collection"
export const C_REASONS = "reasons_collection"
export const C_TASKS = "tasks_collection" 

export let IOC: IocField = generateField()

export interface IocField {
    tag: IocItem 
    project: IocItem
    pomo: IocItem
    interruption: IocItem
    reason: IocItem
    task: IocItem
    base: IocItem
    factory: IocItem
}

export interface IocItem {
    repo: symbol 
    validation: symbol
    serializer: symbol
    manager: symbol
}

export const IocName = {
    project: Symbol("project")
}

function generateBase(prefix: string): IocItem {
    return {
        repo: Symbol(prefix+"repo"),
        validation: Symbol(prefix+"validation"),
        serializer: Symbol(prefix+"serializer"),
        manager: Symbol(prefix+"manager"),
    }
}


function generateField(): IocField {
    return {
        tag: generateBase("tag"),
        project: generateBase("project"),
        pomo: generateBase("pomo"),
        interruption: generateBase("interruption"),
        reason: generateBase("reason"),
        task: generateBase("task"),
        base: generateBase("base"),
        factory: generateBase("factory_")
    }
}