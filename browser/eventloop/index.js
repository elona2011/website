function sync() {
    delay(1000)
}

function async(params) {
    for (let n = 0; n < 100; n++) {
        setTimeout(function() {
            delay(10)
        }, 0);
    }
}

/**
 * 
 * @param {interger} s - 阻塞毫秒数
 */
function delay(s) {
    let n = Date.now()
    while (1) {
        if (Date.now() - n > s) {
            break
        }
    }
}