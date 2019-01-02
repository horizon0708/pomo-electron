import 'reflect-metadata'
import { SERIALIZE_METADATA } from './serializationDecorators';

export default interface ISerializer<S, M> {
    import(schema: S) :M

    export(model: M) : S
}

type Diff<T, U> = T extends U ? never : T;  // Remove types from T that are assignable to U

export type SerializeCallbacks<T> = {
    [P in keyof T]? : (input: any) => T[P] 
}


export class BaseSerializer<S, M> implements ISerializer<S, M> {
    private options?: SerializeCallbacks<M>    
    private model: M
    private schema: S

    // can't instantiate generics in typescript!
    constructor(schema: S, model:M, options?: SerializeCallbacks<M>) {
        this.schema = schema
        this.model = model
        this.options = options
    }

    // TODO: add skipSerialization decorator to skip serialization
    import(schema: S): M {
        let output = {...this.model}
        for(let key in output) {
            if(schema && schema.hasOwnProperty(key) && output.hasOwnProperty(key)){
                const schemaMetadata = Reflect.getMetadata("design:type", schema, key)
                const modelMetadata = Reflect.getMetadata("design:type", this.model, key)
                const schemaType = schemaMetadata && schemaMetadata.name
                const modelType = modelMetadata && modelMetadata.name
                // console.log(key + "-->" + modelType)
                // check for option
                if(this.options && this.options.hasOwnProperty(key)) {
                    //the output practically has to be T[P] as this.optionss is typeof SerializeCallback
                    const cb = this.options[key] as (input: any) => any
                    (output as any)[key] = cb((schema as any)[key])
                    
                } else if(
                    (modelType === "Number" ||
                    modelType === "String" ||
                    modelType === "Boolean" 
                    ) &&
                    modelType=== schemaType
                ){ 
                    (output as any)[key] =  (schema as any)[key]
                } else {
                    //for other fields, we warn users it was not possible to automatically serialize them 
                    console.warn(`There was no callback provided for "${key}" and "${key} is not automatically serializable. ${key} property was not copied!`)
                }
            }
        }

        return output
    }    
    
    
    export(model: M): S {
        throw new Error("Method not implemented.");
    }
}

