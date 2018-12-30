import { ISchemaBuilder } from "./ISchemaBuilder";
import { Guid } from "guid-typescript";
import Project from "../models/project";
import { object } from "prop-types";

export interface HasId {
    id: string
}

export interface HasGuid {
    id: Guid
}


// help automate boring casting/mapping between objects
export default class BaseBuilder<In extends HasId, Out extends HasGuid> {

    import(schema: In, o: Out): Out {
        for (let key in schema) {
            if (schema.hasOwnProperty(key)) {
                // for id, we can cast it between guid/id
                if (key === "id") {
                    (o as any)[key] = Guid.parse(schema.id)
                }
                if (o.hasOwnProperty(key)) {
                    const k: string = key.toString();
                    const property = (o as any)[k];
                    if (typeof property === typeof schema[key]) {
                        (o as any)[k] = schema[key]
                    }
                }

            }
        }

        return o
    }


    // If i could case enums, then it would be perfect.
    export(pomoObject: Out, o: In): In {
        for (let key in pomoObject) {
            if (pomoObject.hasOwnProperty(key)) {
                // for id, we can cast it between guid/id
                if (key === "id") {
                    o.id = pomoObject.id.toString()
                }

                // other propreties, we need to check if the same property exists
                if (o.hasOwnProperty(key)) {
                    const k: string = key.toString()
                    const property = (o as any)[k]
                    // if type is the same, we can safely assign it
                    if (typeof property === typeof pomoObject[key]) {
                        (o as any)[k] = pomoObject[key]
                    }
                }
            }
        }

        return o
    }
}