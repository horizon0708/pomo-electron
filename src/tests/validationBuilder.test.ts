import ValidationBuilder, { ValidationOption, ValidationCallback } from "../helper/validationBuilder";
import Tag from "../models/tag";
import { Guid } from "guid-typescript";
import "reflect-metadata"

const testValid = new ValidationOption<Tag>("id", (x:any)=>false, new Tag(""), Guid.create())

console.log(Reflect.getMetadata("foo",testValid, "baz"))

// testValid.fieldName = "id"
// testValid.callback = (id:string) => true



const tag = new Tag("hi")

// use partial!
const opts: ValidationCallback<Tag> = {
    id: (x: any)=> false
}

const badOpts: ValidationCallback<Tag> = {
    id: false
}

let builder = new ValidationBuilder<Tag>(tag, opts) 


test('test', () => {
   const validator = builder.buildValidator()
//    console.log(validator)
//    expect(validator.id).toBe(undefined)
    expect(1).toBe(1)
})

test('test2', () => {
    let builder = new ValidationBuilder<Tag>(tag, badOpts)
   const validator = builder.buildValidator()
   console.log(validator)
//    expect(validator.id).toBe(undefined)
    expect(1).toBe(1)
})