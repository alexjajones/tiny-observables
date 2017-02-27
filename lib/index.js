class Observe {
    constructor(_action) { this.action = _action; }

    subscribe(next = this.__noop__, error = this.__noop__, complete = this.__noop__) {
        let observer = new Observer({next, error, complete});

        observer.unsub = this.action(observer);

        return observer.unsubscribe.bind(observer);
    }

    map(fn) {
        return this.__operator_factory__(obs => val => obs.next(fn(val)));
    }

    delay(milli) {
        return this.__operator_factory__(obs => val => setTimeout(() => obs.next(val), milli));
    }

    filter(fn) {
        return this.__operator_factory__(obs => val => fn(val) ? obs.next(val) : null);
    }

    interval(milli) {
        return this.__operator_factory__(obs => val => setInterval(obs.next(val), milli));
    }

    effect(fn) {
        return this.__operator_factory__(obs => val => {
            fn(val);
            obs.next(val)
        });
    }

    throttle(milli) {
        return this.__operator_factory__(obs => throttle(val => obs.next(val), milli));

        function throttle(callback, limit) {
            var wait = false;
            return (...args) => {
                if (!wait) {
                    callback(...args);
                    wait = true;
                    setTimeout(() => wait = false, limit);
                }
            }
        }
    }

    debounce(milli) {
        return this.__operator_factory__(obs => debounce(val => obs.next(val), milli));

        function debounce(fn, wait) {
            var timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => fn(...args), wait);
            };
        }
    }

    __operator_factory__(success, err, complete) {
        return new Observe(obs =>
            this.subscribe(
                success(obs),
                err ? err(obs) : err => obs.error(err),
                complete ? complete(obs) : () => obs.complete()
            )
        )
    }

    __noop__() {}
}

class Observer {
    subscribed = true;

    constructor(subscription) { this.subscription = subscription; }

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