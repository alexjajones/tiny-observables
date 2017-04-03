import '../dist/tiny-observables'

let ob = new Observe(obs => {
    let interval = setInterval(() => obs.next('::Interval value::'), 500);

    setTimeout(() => obs.error('::Error triggered::'), 2000);

    return () => clearInterval(interval);
});

ob.filter(val => true)
    .map(val => '++' + val + '++')
    .effect(console.log)
    .delay(1000)
    .subscribe(
        val => console.log(val),
        err => console.log(err),
        () => console.log('complete')
    );