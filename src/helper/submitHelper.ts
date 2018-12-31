import { observable } from "mobx";

enum SubmitState {
    editing,
    inProgress,
    success,
    failure
}

export default class SubmitHelper<T> {
    @observable state: SubmitState = SubmitState.editing
    @observable message: string = ""
    delay: number = 500


    async submit(cb: Promise<T | Error>) {
        this.state = SubmitState.inProgress
        return cb.then(res => {
            this.state = SubmitState.success
            console.log(this.state)
            return Promise.resolve(res)
        })
        .catch(e=>{
            this.state = SubmitState.failure
            this.message = e
            return Promise.reject(new Error(e))
        })
        .finally(()=> {
            setTimeout(() => {
                this.state = SubmitState.editing 
                console.log(this.state)
            }, this.delay);
        })
    }

}