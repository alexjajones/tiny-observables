export class Observer {
    constructor(subscription) {
        this.subscribed = true;
        this.subscription = subscription;
    }

    next(val) {
        if (this.subscribed)
            this.__try__(() => this.subscription.next(val));
    }

    error(err) {
        if (this.subscribed)
            this.__try__(() => {
                this.subscription.error(err);
                this.unsubscribe()
            });
    }

    complete() {
        if (this.subscribed)
            this.__try__(() => {
                this.subscription.complete();
                this.unsubscribe()
            });
    }

    unsubscribe() {
        this.subscribed = false;

        if (this.unsub) {
            this.unsub();
        }
    }

    __try__(fn) {
        try {
            fn()
        }
        catch (err) {
            this.unsubscribe();
            throw err;
        }
    }
}