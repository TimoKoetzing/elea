var output = document.getElementById("output")

// create a coroutine wrapper
// https://x.st/javascript-coroutines/
function coroutine(f) {
    var o = f(); // instantiate the coroutine
    o.next(); // execute until the first yield
    return function(x) {
        o.next(x);
    }
}

var FIB_NUM = 35;
var THREAD_COUNT = 1;

function update_fib() { FIB_NUM = document.getElementById("fib_number").valueAsNumber; }
function update_thread_count() { THREAD_COUNT = document.getElementById("thread_number").valueAsNumber; }
update_thread_count();
update_fib();

function fib(n) {
    if (n < 2) return n;
    return fib(n-1) + fib(n-2);
}

function run_serial() {
    console.log("serial")
    output.textContent = "serial\n"
    var time = new Date().getTime();
    let sum = 0;

    for (let index = 0; index < THREAD_COUNT; index++) {
        sum += fib(FIB_NUM);
    }

    output.textContent += "Result: " + sum.toString() + '\n';
    output.textContent += "Time: " + (new Date().getTime() - time).toString();
}

function run_parallel() {
    console.log("parallel")
    output.textContent = "parallel\n"
    var time = new Date().getTime();

    var co;
    co = coroutine(function*() {
        for (let index = 0; index < THREAD_COUNT; index++) {

            let worker = new Worker("scripts/multithread-worker.js");
            worker.onmessage = function(e) { co(e.data); };

            console.log("sending", FIB_NUM)
            worker.postMessage(FIB_NUM);
        }

        let sum = 0;
        for (let index = 0; index < THREAD_COUNT; index++) {
            // console.log("sum =", sum)
            let received = yield;
            console.log("receiving from child", received);
            sum += received;
        }

        output.textContent += "Result: " + sum.toString() + '\n';
        output.textContent += "Time: " + (new Date().getTime() - time).toString();
    })
}