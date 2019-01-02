import ValidationBuilder, { FieldValidator, ModelValidationOption, SchemaValue } from "../helper/validationBuilder";
import { SchemaTag } from "../stores/tagSchema";



const tag = new SchemaTag()
tag.name = "test name"

const simpleOpt = (output: boolean) => {
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

test('editing notEditable field does not work', () => {
    let builder = new ValidationBuilder<SchemaTag>(tag, simpleOpt(true))
    const validator = builder.buildValidator()
    const id = validator && validator.id as FieldValidator<SchemaTag>
    id.value = "invalidId"
    expect(id.value).not.toEqual("invalidId")
    expect(id.value).not.toBeUndefined()
    expect(id.isValid).toBe(true)
    expect(id.validationMessages).toEqual([])
})

test('editing normal field works', () => {
    let builder = new ValidationBuilder<SchemaTag>(tag, simpleOpt(true))
    const validator = builder.buildValidator()
    const name = validator && validator.name as FieldValidator<SchemaTag>
    name.value = "valid name"
    expect(name.value).toBe("valid name")
    expect(name.isValid).toBe(true)
    expect(name.validationMessages).toEqual([])
})

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


test('build schema > success', done => {
    let builder = new ValidationBuilder<SchemaTag>(tag, simpleOpt(true))
    const validator = builder.buildValidator()
    builder.buildSchema(validator).then(res => {
        expect(res.name).toEqual("test name")
        expect(res.id).not.toBeNull()
        expect(res.isTag).toEqual(true)
        expect(res.color).toEqual("red")
        done()
    })
})

test('build schema > fail', async () => {
    let builder = new ValidationBuilder<SchemaTag>(tag, simpleOpt(false))
    const validator = builder.buildValidator()
    try {
        await builder.buildSchema(validator)
    } catch(e) {
        expect(e).toEqual(new Error("Build cancelled: There are invalid fields"))
    }
})
