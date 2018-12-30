import { Observable } from "rxjs";

export default class BaseManager {

    async startSubscription(subscription: Observable<any[]>, ref: any, builder: (d: any)=> any) {
        subscription.subscribe(res => {
            const json = res.map(r=>r.toJSON())
            ref = json.map(builder) 
        }) 
    }
}