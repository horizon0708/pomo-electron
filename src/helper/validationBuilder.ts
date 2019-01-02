import "reflect-metadata"
import { observable, computed, action } from "mobx";
import { SchemaProject } from "../stores/projectSchema";
import { notEditableMetadatakey } from "./validationDecorator";
import { isNullOrUndefined } from "util";

export type ValidationCallback = (x: SchemaValue) => boolean
export type ConstraintCallback = (x: SchemaValue) => SchemaValue


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


export type SchemaValue = any

// actual. derive from schema instead
export class FieldValidator<T extends ISchema>  {
    // cant ensure fieldname
    @observable name: keyof T
    @observable private _value: SchemaValue | null = null
    @computed get value() {
        return this._value
    }

    set value(val: SchemaValue | null) {
        if (val !== null && this.editable) {
            let temp = val
            this.constraintCallbacks.forEach(fn => {
                temp = fn(temp)
            })
            this._value = temp
        } else {
            console.warn("Warning: You are trying to set null as a value or edit an uneditable value!")
        }
    }

    private editable: boolean = true
    validationObjects: ValidationObject[] = []
    constraintCallbacks: ConstraintCallback[] = []

    @computed get isValid() {
        if (!this.editable) return true
        if (this._value === null) return false // "" returns false lol
        if (this.validationObjects.length === 0) return true

        return this.validationObjects.every(obj => {
            if (this._value === null) return false
            return obj.callback(this._value)
        })
    }

    @computed get validationMessages() {
        if (!this.editable) return []
        if (this._value === null) return []
        return this.validationObjects.map(obj => {
            if (this._value !== null && !obj.callback(this._value)) {
                return obj.message
            }
            return null
        }).filter(x => x)
    }


    //decorate property to know what to copy 
    constructor(name: keyof T, o: T, editable: boolean = true, validationObjects?: ValidationObject[], constraintCallbacks?: ConstraintCallback[]) {
        this.name = name
        this.editable = editable
        if (o.hasOwnProperty(name)) {
            this._value = o[name]
        }

        if (validationObjects) {
            this.validationObjects = validationObjects
        }
        if (constraintCallbacks) {
            this.constraintCallbacks = constraintCallbacks
        }
    }

    //maybe use reflection to get conversion Callback types
}


export type ModelValidatorType<T extends ISchema> = {
    [P in keyof T]?: FieldValidator<T>
}

export class ModelValidatorBase<T extends ISchema> {

    @computed get __isValid() {
        let results: boolean[] = []
        for (let key in this) {
            if (this.hasOwnProperty(key)) {
                const validator = <any>this[key] as FieldValidator<T>
                if (validator && isNullOrUndefined(validator.isValid)) {
                    results.push(validator.isValid)
                }
            }
        }
        if (results.length === 0) return true
        return results.every(x => x)
    }
}

export type ModelValidator<T extends ISchema> = ModelValidatorType<T> & ModelValidatorBase<T>

// Option
export type ModelValidationOption<T extends ISchema> = {
    // [P in keyof T]?: (x:T[P]) => boolean
    [P in keyof T]?: FieldValidationOption<T>
}

export type FieldValidationOption<T> = {
    validationObjects: ValidationObject[]
    constraintCallbacks?: ConstraintCallback[]
}




export default class ValidationBuilder<T extends ISchema>{
    private obj: T
    private model?: ModelValidationOption<T>
    private defaultValidationObjects?: ValidationObject[]

    constructor(obj: T, model?: ModelValidationOption<T>, defaultValidationObjects?: ValidationObject[]) {
        this.obj = obj
        this.model = model
        this.defaultValidationObjects = defaultValidationObjects
    }

    buildValidator(): ModelValidator<T> {
        let output: ModelValidator<T> = new ModelValidatorBase<T>() as ModelValidator<T>
        for (let key in this.obj) {
            if (this.obj.hasOwnProperty(key)) {
                // check metadata to see if it is not editable
                let editable = !Reflect.getMetadata(notEditableMetadatakey, this.obj, key)
                let validator: FieldValidator<T> = new FieldValidator<T>(key, this.obj, editable)
                if (this.defaultValidationObjects) {
                    validator.validationObjects = this.defaultValidationObjects
                }
                // override with model
                if (this.model
                    && this.model.hasOwnProperty(key)) {
                    const fieldOption = this.model[key]
                    if (fieldOption) {
                        validator.validationObjects = fieldOption.validationObjects
                    }
                }

                if (key === "__isValid") {
                    console.warn("__isValid is reserved and the property will be ignored. Please change the field name")
                } else {
                    // not too happy but should be fine
                    (<any>output[key]) = validator
                }
            }
        }
        return output
    }

    async buildSchema(validationModel: ModelValidatorType<T>): Promise<T> {
        let output = { ...this.obj }
        let unsafe = output as any
        for (let key in output) {
            if (output.hasOwnProperty(key) && validationModel.hasOwnProperty(key)) {
                const cast = validationModel[key] as FieldValidator<T>
                if (!cast.isValid) {
                    return Promise.reject(new Error("Build cancelled: There are invalid fields"))
                }
                if (cast.value !== null) {
                    unsafe[key] = cast.value
                }
            }
        }
        return Promise.resolve(unsafe)
    }
}