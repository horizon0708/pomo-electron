import 'reflect-metadata'
import 'core-js/es7/reflect';

export const SERIALIZE_METADATA = "serialization:type"
export const FOREIGN_KEY_METADATA = "serialization:foreignKey"

export function serialize(target: any, key: string) {
    // Reflect.getMetadata("design:type", target, key)
    // console.log(type)
    // if(type && type.name){
    //     console.log("define!")
    //     Reflect.defineMetadata(serializationMetadataKey, type, target, key)
    // }
    // console.log(Reflect.getMetadataKeys(target))
}

export function foreignKey(collection: string) {
    return function (target: any, key: string) {
        Reflect.defineMetadata(FOREIGN_KEY_METADATA, { key, collection}, target, key)
    }
}


    // Reflect.defineMetadata(serializationMetadataKey, "type", target, key)
    // console.log(Reflect.getMetadataKeys(target))
