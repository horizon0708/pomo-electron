import { observable } from "mobx";

enum SubmitState {
    editing,
    inProgress,
    success,
    failure
}

export default class SubmitHelper {
    @observable state: SubmitState = SubmitState.editing
    delay: number = 500

    async submit(cb: Promise<any>): Promise<any> {
        this.state = SubmitState.inProgress
        await cb.then(() => {
            this.state = SubmitState.success
            console.log(this.state)
            return Promise.resolve()
        })
        .catch(e=>{
            this.state = SubmitState.failure
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