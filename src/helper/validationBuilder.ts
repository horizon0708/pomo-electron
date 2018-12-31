import "reflect-metadata"
import { observable } from "mobx";

const TYPE_SUFFIX = "_TYPE"

type test = "id"


function getProperty<T, K extends keyof T>(o: T, name: K) {
    return o[name]
}

// function test<T>(o: T, input: keyof T) {
//     type test = T[input] 
//     return new ValidationOption<T, test>(input, (x:T[any])=>false)
// }

export class ValidationOption<T> {
    // cant ensure fieldname
    fieldName?: keyof T
    callback?: (x: any) => boolean
    private type = ""
    isValid = true
    message = ""

    constructor(fieldName: keyof T, _callback: (x: any) => boolean, o: T, callbackInput: any) {
        this.fieldName = fieldName
        this.callback = this.attachType(callbackInput, _callback)
        if (o.hasOwnProperty(fieldName)) {
            if (typeof o[fieldName] === this.type) {
                this.isValid = this.callback(callbackInput)
            } else {
                this.callback = undefined
                console.log("doesn't match")
            }
        }
    }

    attachType(x: any, cb: (x: any) => boolean) {
        this.type = typeof x
        return (x: any) => cb(x)
    }
}

export type ValidationCallbacks<T> = {
    // [P in keyof T]?: (x:T[P]) => boolean
    [P in keyof T]?: ValidationOpt<T, P>
}

export class ValidationOpt<T, K extends keyof T>  {
    callback: (x:T[K]) => boolean = (x: T[K]) => true
    message: string = ""
}



export default class ValidationBuilder<T>{
    private obj: T
    private callbacks?: any
    private default = (x: any) => true

    constructor(monitor: T, callbacks?: ValidationCallbacks<T>) {
        this.obj = monitor
        this.callbacks = callbacks
    }

    // TODO: refactor this
    buildValidator() {
        let output: any = {}
        for (let key in this.obj) {
            if (this.obj.hasOwnProperty(key)) {
                let validator: ValidationOption<T>
                if (this.callbacks.hasOwnProperty(key) ) {
                    validator = new ValidationOption<T>(key, this.callbacks[key].callback, this.obj, this.obj[key])
                } else {
                    validator = new ValidationOption<T>(key, this.default, this.obj, this.obj[key])
                }
                if (validator.callback) {
                    output[key] = validator
                } else {
                    output[key] = null
                }
            } else {
                console.error("validation logic for " + key + "was not provided")
            }
        }
        return output
    }




}