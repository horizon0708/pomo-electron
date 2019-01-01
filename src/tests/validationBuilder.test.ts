import ValidationBuilder, { FieldValidator, ModelValidationOption, SchemaValue } from "../helper/validationBuilder";
import { SchemaTag } from "../stores/tagSchema";



const tag = new SchemaTag()
tag.name = "test name"

const simpleOpt= (output: boolean) => {
    return {
        name: {
            validationObjects: [
                {
                    callback: (x: SchemaValue) => output,
                    message: "hi"
                }
            ]
        }
    }
}

const multipleCallbacks = (output1: boolean, output2: boolean) => {
    return {
        name: {
            validationObjects: [
                {
                    callback: (x: SchemaValue) => output1,
                    message: "1"
                },
                {
                    callback: (x: SchemaValue) => output2,
                    message: "2"
                },
                {
                    callback: (x: SchemaValue) => output2,
                    message: "3"
                },
            ]
        }
    }
}



test('one callback > succeeds', () => {
    let builder = new ValidationBuilder<SchemaTag>(tag, simpleOpt(true))
    const validator = builder.buildValidator()
    const name = validator && validator.name as FieldValidator<SchemaTag>
    expect(name.value).toBe("test name")
    expect(name.isValid).toBe(true)
    expect(name.validationMessages).toEqual([])
})

test('one callback > fails', () => {
    let builder = new ValidationBuilder<SchemaTag>(tag, simpleOpt(false))
    const validator = builder.buildValidator()
    const name = validator && validator.name as FieldValidator<SchemaTag>
    expect(name.value).toBe("test name")
    expect(name.isValid).toBe(false)
    expect(name.validationMessages).toEqual(["hi"])
})

test('multiple callbacks > two fails ', () => {
    let builder = new ValidationBuilder<SchemaTag>(tag, multipleCallbacks(true, false))
    const validator = builder.buildValidator()
    const name = validator && validator.name as FieldValidator<SchemaTag>
    expect(name.value).toBe("test name")
    expect(name.isValid).toBe(false)
    expect(name.validationMessages).toEqual(["2", "3"])
})

test('multiple callbacks > all succeeds ', () => {
    let builder = new ValidationBuilder<SchemaTag>(tag, multipleCallbacks(true, true))
    const validator = builder.buildValidator()
    const name = validator && validator.name as FieldValidator<SchemaTag>
    expect(name.value).toBe("test name")
    expect(name.isValid).toBe(true)
    expect(name.validationMessages).toEqual([])
})


