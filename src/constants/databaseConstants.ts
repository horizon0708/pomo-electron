export const TEST_DB_NAME = "TEST_DB"
export const DEV_DB_NAME = "pomodb"

export type DbName = "TEST_DB" | "pomodb"

export const C_POMOS = "pomos_collection"
export const C_PROJECTS = "projects_collection"
export const C_INTERRUPTIONS = "interruptions_collection"
export const C_TAGS = "tags_collection"
export const C_REASONS = "reasons_collection"
export const C_TASKS = "tasks_collection" 

export let IOC = {
    baseRepo: Symbol("BaseRepository"),
    tagRepo: Symbol("TagRepo"),
    pomoRepo: Symbol("pomoRepo"),
    projectRepo: Symbol("TagRepo"),
    interruptionRepo: Symbol("interruptionRepo"),
    reasonRepo: Symbol("ReasonRepo"),
    taskRepo: Symbol("TaskRepo"),

    projectSerializer: Symbol("ProjectSerializor"),
    tagSerializer: Symbol("TagSerializerFactory")
}