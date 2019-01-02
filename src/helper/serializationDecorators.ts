import 'reflect-metadata'
import 'core-js/es7/reflect';

export const serializationMetadataKey = "serialization:type"

export function serialize(target: any, key: string) {
    // Reflect.getMetadata("design:type", target, key)
    // console.log(type)
    // if(type && type.name){
    //     console.log("define!")
    //     Reflect.defineMetadata(serializationMetadataKey, type, target, key)
    // }
    // console.log(Reflect.getMetadataKeys(target))
}



    // Reflect.defineMetadata(serializationMetadataKey, "type", target, key)
    // console.log(Reflect.getMetadataKeys(target))
