
export default class BaseImporter<S, M> {
    obj: M 

    constructor(obj: M) {
        this.obj = obj
    }


    import(schema: S): M {

        return this.obj
    }
}