let lockData = new Map();
let log = require("./log")

function sleep(ms){
    return new Promise((resolve)=>{
        setTimeout(() => {
            resolve();
        }, ms);
    })
}

async function waitLock(key,fun){
    while(lockData.get(key)){
        if(fun && !fun()){
            log.info("中止抢锁")
            return false;
        }
        await sleep(50);
    }
    return true;
}

async function lock(key,fun,checkFun){
    let ret = await waitLock(key,checkFun);
    if(ret){
        log.info("上锁:"+key);
        lockData.set(key,true);
        await fun();
        lockData.delete(key);
        log.info("解锁:"+key);
    }
    return ret;
}


async function setLock(key,fun){
    let ret = await waitLock(key,fun);
    if(ret){
        log.info("上锁:"+key);
        lockData.set(key,true);
    }
    return ret;
}

function unsetLock(key){
    if(lockData.get(key)){
        log.info("解锁:"+key);
        lockData.delete(key);
    }
}

module.exports = {
    lock:lock,
    sleep:sleep,
    setLock:setLock,
    unsetLock:unsetLock,
    waitLock:waitLock
}