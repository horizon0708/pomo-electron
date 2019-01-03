
export const notEditableMetadatakey = Symbol("notEditable")

export function notEditable(target: any, key:string | symbol) { 
    Reflect.defineMetadata(notEditableMetadatakey, true, target, key)
}