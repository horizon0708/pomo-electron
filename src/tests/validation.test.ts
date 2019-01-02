import { validateNumberRange, validateStringLength } from "../helper/validationCallbacks";
import { SchemaTag } from "../stores/tagSchema";
import ValidationBuilder, { FieldValidator } from "../helper/validationBuilder";

const tag = new SchemaTag()
tag.name = "test name"

const defaultValidationsForAllFields = [ validateNumberRange(30, 100), validateStringLength(10,20) ]


test('default validation for strings > invalid', () => {
    let builder = new ValidationBuilder<SchemaTag>(tag, undefined, defaultValidationsForAllFields)
    const validator = builder.buildValidator()
    const name = validator && validator.name as FieldValidator<SchemaTag>
    name.value = "tooShort"
    expect(name.value).toBe("tooShort")
    expect(name.isValid).toBe(false)
    expect(name.validationMessages).toEqual(["must be over 9 and below 21"])
})

test('default validation for strings > valid', () => {
    let builder = new ValidationBuilder<SchemaTag>(tag, undefined, defaultValidationsForAllFields)
    const validator = builder.buildValidator()
    const name = validator && validator.name as FieldValidator<SchemaTag>
    name.value = "longEnoughName"
    expect(name.value).toBe("longEnoughName")
    expect(name.isValid).toBe(true)
    expect(name.validationMessages).toEqual([])
})

test('default validation with "" > invalid', () => {
    let builder = new ValidationBuilder<SchemaTag>(tag, undefined, defaultValidationsForAllFields)
    const validator = builder.buildValidator()
    const name = validator && validator.name as FieldValidator<SchemaTag>
    name.value = ""
    expect(name.value).toBe("")
    expect(name.value).not.toBeUndefined()
    expect(name.isValid).toBe(false)
    expect(name.validationMessages).toEqual(["must be over 9 and below 21"])
})

test('default validation with number > invalid', () => {
    let builder = new ValidationBuilder<SchemaTag>(tag, undefined, defaultValidationsForAllFields)
    const validator = builder.buildValidator()
    const name = validator && validator.name as FieldValidator<SchemaTag>
    name.value = 10
    expect(name.value).toBe(10)
    expect(name.isValid).toBe(false)
    expect(name.validationMessages).toEqual(["must be over 29 and below 101"])
})

test('default validation with number > valid', () => {
    let builder = new ValidationBuilder<SchemaTag>(tag, undefined, defaultValidationsForAllFields)
    const validator = builder.buildValidator()
    const name = validator && validator.name as FieldValidator<SchemaTag>
    name.value = 42
    expect(name.value).toBe(42)
    expect(name.isValid).toBe(true)
    expect(name.validationMessages).toEqual([])
})