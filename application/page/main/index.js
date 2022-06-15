window.onload = ()=>{
    let program = initProgram();
    document.getElementById("close").addEventListener("click",()=>{
        program.message("close")
    });
    document.getElementById("logout").addEventListener("click",()=>{
        program.message("logout")
    });
    let statusElement = document.getElementById("status");
    program.listen("swsStatus",(data)=>{
        if(data){
            statusElement.classList.add("active");
        }else{
            statusElement.classList.remove("active");
        }
    })

    program.listen("log",(msg)=>{
        insertLog(msg);
    })

    program.listen("autorun",(status)=>{
        if(status){
            document.getElementById("autorun").setAttribute("title","取消开机启动")
            document.getElementById("autorun").getElementsByTagName("img")[0].setAttribute("src","./../../resource/icon/autorun.svg");
        }else{
            document.getElementById("autorun").setAttribute("title","设为开机启动")
            document.getElementById("autorun").getElementsByTagName("img")[0].setAttribute("src","./../../resource/icon/unautorun.svg");
        }
    })

    document.getElementById("autorun").addEventListener("click",()=>{
        program.message("autorun")
    })
}


function insertLog(msg){
    Object.values(document.getElementById("logs").children).splice(99).forEach(item=>{
        item.remove();
    })
    let logElement = document.createElement("div");
    logElement.classList.add("log");
    logElement.classList.add(msg.type);
    let timeElement = document.createElement("span");
    timeElement.classList.add("datetime")
    let contextElement = document.createElement("span");
    contextElement.classList.add("context");
    timeElement.innerHTML=getTime();
    contextElement.innerHTML=msg.text;

    logElement.append(timeElement);
    logElement.append(contextElement);

    let logsElement = document.getElementById("logs");
    logsElement.insertBefore(logElement,logsElement.firstChild);
}


function getTime(){
    let date = new Date();
    return date.getFullYear()+'.'+
    (date.getMonth()+1).toString().padStart(2,"0")+"."+
    date.getDate().toString().padStart(2,"0")+" "+
    date.getHours().toString().padStart(2,"0")+":"+
    date.getMinutes().toString().padStart(2,"0")+":"+
    date.getSeconds().toString().padStart(2,"0");
}














