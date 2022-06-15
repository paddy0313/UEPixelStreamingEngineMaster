let _online = false;         //ue4管理端在线状态
let _run = false;           //ue4程序运行状态



function online(){
    _online=true;
}
function unline(){
    _online=false;
}

function lineStatus(){
    return _online;
}
function run(){
    _run=true;
}
function unrun(){
    _run=false;
}
function runstatus(){
    return _run;
}


module.exports={
    online:online,
    unline:unline,
    lineStatus:lineStatus,
    run:run,
    unrun:unrun,
    runstatus:runstatus,
}