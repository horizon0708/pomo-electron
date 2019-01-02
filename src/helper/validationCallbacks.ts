import { SchemaValue, ValidationCallback, ValidationObject } from "./validationBuilder";

export function validateStringLength(
    min: number = 1,
    max: number = 30,
    message = `must be over ${min-1} and below ${max + 1}`): ValidationObject {

    const callback = (input: SchemaValue) => {
        if (typeof input === "string") {
            return input.length >= min && input.length <= max
        }
        return true
    }
    return {
        callback,
        message
    }
}

export function validateNumberRange(
    min: number = -1,
    max: number = 1000,
    message = `must be over ${min-1} and below ${max + 1}`
): ValidationObject {

    const callback = (input: SchemaValue) => {
        if (typeof input === "number") {
            return input >= min && input <= max
        }
        return true
    }
    return {
        callback,
        message
    }
}