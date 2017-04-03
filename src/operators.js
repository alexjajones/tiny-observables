import {Observe} from "./index";

export class Operators {
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