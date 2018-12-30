export interface ISchemaBuilder<In, Out> {

    buildFromSchema(s: In): Out 

    exportToSchema(s: Out): In
}