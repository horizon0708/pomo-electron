import "reflect-metadata"
import { observable, computed } from "mobx";
import { SchemaProject } from "../stores/projectSchema";

type ValidationCallback = (x: SchemaValue) => boolean
type ConversionCallback = (x: string | number) => any


export class ValidationObject {
    callback: ValidationCallback
    message: string = ""

    constructor(callback: ValidationCallback, message: string) {
        this.callback = callback
        this.message = message
    }
}


export interface ISchema {
    [key: string]: SchemaValue
}


export type SchemaValue = string | number | boolean | string[] | number[] | boolean[]

// actual. derive from schema instead
export class FieldValidator<T extends ISchema>  {
    // cant ensure fieldname
    @observable name: keyof T
    @observable value: SchemaValue | null = null

    validationCallbacks: ValidationObject[] = [new ValidationObject((x: SchemaValue) => true, "")]
    conversionCallback?: (x: string | number | boolean) => any // maybe not the best place to put conversion call backs? typesafety?
    @computed get isValid() {
        if (!this.value) return false
        return this.validationCallbacks.every(obj => {
            if (!this.value) return false
            return obj.callback(this.value)
        })
    }
    @computed get validationMessages() {
        if (!this.value) return []
        return this.validationCallbacks.map(obj => {
            if (this.value && !obj.callback(this.value)) {
                return obj.message
            }
            return null
        }).filter(x=>x)
    }


    //decorate property to know what to copy 
    constructor(name: keyof T, o: T, validationObjects?: ValidationObject[]) {
        this.name = name
        if (o.hasOwnProperty(name)) {
            this.value = o[name]
        }

        if (validationObjects) {
            this.validationCallbacks = validationObjects
        }
    }

    //maybe use reflection to get conversion Callback types
}


export type ModelValidator<T extends ISchema> = {
    [P in keyof T]?: FieldValidator<T>
}


// Option
export type ModelValidationOption<T extends ISchema> = {
    // [P in keyof T]?: (x:T[P]) => boolean
    [P in keyof T]?: FieldValidationOption<T, P>
}

export type FieldValidationOption<T, K extends keyof T> = {
    validationObjects: ValidationObject[]
    conversionCallback?: (x: string | number) => T[K] | null
}




export default class ValidationBuilder<T extends ISchema>{
    private obj: T
    private model?: ModelValidationOption<T>

    constructor(obj: T, model: ModelValidationOption<T>) {
        this.obj = obj
        this.model = model
    }

    // TODO: refactor this
    buildValidator(): ModelValidator<T> {
        let output: any = {}
        for (let key in this.obj) {
            if (this.obj.hasOwnProperty(key)) {
                let validator: FieldValidator<T> = new FieldValidator<T>(key, this.obj)

                // override with model
                if (this.model && this.model.hasOwnProperty(key)) {
                    const fieldOption = this.model[key]
                    if (fieldOption) {
                        validator.validationCallbacks = fieldOption.validationObjects
                    }
                }
                output[key] = validator
            } else {
                console.error("validation logic for " + key + "was not provided")
            }
        }
        return output
    }

}