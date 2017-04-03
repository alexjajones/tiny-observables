import {Observer} from './observer'
import {Operators} from "./operators";

export class Observe extends Operators {
    constructor(_action) {
        super();
        this.action = _action;
    }

    subscribe(next = this.__noop__, error = this.__noop__, complete = this.__noop__) {
        let observer = new Observer({next, error, complete});

        observer.unsub = this.action(observer);

        return observer.unsubscribe.bind(observer);
    }
}