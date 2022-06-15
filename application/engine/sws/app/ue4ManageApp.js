const log = require("../util/log");
let client = require("./helper/clientHelper");
let ue4Helper = require("./helper/ue4Helper")
let cache = require("./../util/cache");




class ue4Mamage{
    heartBeatHandel;
    ws;
    init(ws){
        let esxit = client.getUe4Manage();
        if(esxit){
            ws.close();
            return ;
        }
        this.ws=ws;
        if(client.getPlayers().size>0){
            this.run();
        }
        log.info(`ue4管理端 已连上`);
        client.setUe4Manage(this)
        var _this = this;
        ws.on('message', (msg)=>{
            log.info("收到消息",msg);
            try {
                msg = JSON.parse(msg);
            } catch(err) {
                log.error(`无法解析ue4管理端消息类型: ${msg}\nError: ${err}`);
                return;
            }
            _this.message(msg);
        });
        ws.on('close', function() {
            _this.close();
        });
        ws.on('error', function() {
            log.error(`ue4管理端 连接错误`);
        });
        this.heartBeat();
    }
    run(){
        if(!ue4Helper.runstatus()){
            ue4Helper.run();
            this.send("run",{
                port:cache.getStreamer()
            })
        }
    }
    kill(){
        if(ue4Helper.runstatus()){
            ue4Helper.unrun();
            this.send("kill");
        }
    }

    close(){
        log.error(`ue4管理端 连接关闭`);
        clearInterval(this.heartBeatHandel);
        clearTimeout(this.heartTimeOut);
        ue4Helper.unrun();
        client.closeUe4Manage();
    }
    message(msg){
        switch(msg.action){
            case "pong":
                clearTimeout(this.heartTimeOut);
                break;
        }
    }
    send(action,param){
        if(this.ws){
            let data = {
                action:action,
                param:param,
            }
            log.info("发送消息",JSON.stringify(data));
            this.ws.send(JSON.stringify(data))
        }
    }
    heartBeat(){
        this.heartBeatHandel = setInterval(()=>{
            this.send("ping");
            this.heartTimeOut = setTimeout(()=>{
                this.ws.terminate();
            },120000);
        },30000);
    }
}



module.exports=ue4Mamage;