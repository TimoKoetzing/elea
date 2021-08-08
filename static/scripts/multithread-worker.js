// create a coroutine wrapper
// https://x.st/javascript-coroutines/
function coroutine(f) {
    var o = f(); // instantiate the coroutine
    o.next(); // execute until the first yield
    return function(x) {
        o.next(x);
    }
}

console.log("Running web worker");

function fib(n) {
    if (n < 2) return n;
    return fib(n-1) + fib(n-2);
}

var main = coroutine(function*() {
    let n = yield;
    console.log("received from parent", n);

    let fib_n = fib(n);

    console.log("sending", fib_n);
    postMessage(fib_n);
})

// main()

onmessage = function(e) {
    // this.postMessage({ output: e });
    // console.log("received from parent", e.data);
    main(e.data);
}