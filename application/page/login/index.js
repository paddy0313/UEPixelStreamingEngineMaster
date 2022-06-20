window.onload = ()=>{
    let initLocalSws = ()=>{
        let sws = document.getElementsByClassName("sws");
        let localsws = document.getElementsByClassName("localsws");
        if(document.getElementById("localsws").checked){
            for(let i=0;i<sws.length;i++){
                sws[i].classList.add("hidden");
            }
            for(let i=0;i<localsws.length;i++){
                localsws[i].classList.remove("hidden");
            }
        }else{
            for(let i=0;i<localsws.length;i++){
                localsws[i].classList.add("hidden");
            }
            for(let i=0;i<sws.length;i++){
                sws[i].classList.remove("hidden");
            }
        }
    }
    let program = initProgram();
    document.getElementById("close").addEventListener("click",()=>{
        program.message("close")
    });
    document.getElementById("localsws").addEventListener("change",(e)=>{
        initLocalSws();
    })

    document.getElementById("login").addEventListener("click",()=>{
        let data = {
            local:document.getElementById("localsws").checked,
            auth:document.getElementById("authLogin").checked,
        };
        if(data.local){       //开启本地信令服务
            data.config = {
                port:document.getElementById("port").value,
                adminname:document.getElementById("adminname").value,
                adminpwd:document.getElementById("adminpwd").value,
            }
        }else{
            data.config={
                ssl:document.getElementById("ssl").checked,
                ip:document.getElementById("swsip").value,
                port:document.getElementById("swsport").value,
            }
        }
        program.message("login",data)
    });

    program.listen("init",(data)=>{
        if(data.local){
            document.getElementById("port").value=data.config.port;
            document.getElementById("adminname").value=data.config.adminname;
            document.getElementById("adminpwd").value=data.config.adminpwd;
            document.getElementById("authLogin").checked=data.auth;
            document.getElementById("localsws").checked=true;
            if(data.auth){
                document.getElementById("login").click();
            }
        }else{
            document.getElementById("swsip").value=data.config.ip;
            document.getElementById("swsport").value=data.config.port;
            document.getElementById("ssl").checked=data.config.ssl;
            ssl
            if(data.auth){
                document.getElementById("login").click();
            }
        }
        initLocalSws();
    })


}
