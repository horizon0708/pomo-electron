import ValidationBuilder, { ModelValidationOption } from "./validationBuilder";
import { SchemaProject } from "../stores/projectSchema";
import { SchemaPomo } from "../stores/database";
import { SchemaTag } from "../stores/tagSchema";
import SchemaInterruption, { SchemaReason } from "../stores/interruptionSchema";
import { SchemaTask } from "../stores/taskSchema";

export function getProjectValidator() {
    const opt: ModelValidationOption<SchemaProject> = {
    } 
    return new ValidationBuilder<SchemaProject>(new SchemaProject(), opt)
}

export function getPomoValidator() {
    const opt: ModelValidationOption<SchemaPomo> = {
    } 
    return new ValidationBuilder<SchemaPomo>(new SchemaPomo(), opt)
}


export function getTagValidator() {
    const opt: ModelValidationOption<SchemaTag> = {
    } 
    return new ValidationBuilder<SchemaTag>(new SchemaTag(), opt)
}


export function getInterruptionValidator() {
    const opt: ModelValidationOption<SchemaInterruption> = {
    } 
    return new ValidationBuilder<SchemaInterruption>(new SchemaInterruption(), opt)
}


export function getReasonValidator() {
    const opt: ModelValidationOption<SchemaReason> = {
    } 
    return new ValidationBuilder<SchemaReason>(new SchemaReason(), opt)
}


export function getTaskValidator() {
    const opt: ModelValidationOption<SchemaTask> = {
    } 
    return new ValidationBuilder<SchemaTask>(new SchemaTask(), opt)
}


