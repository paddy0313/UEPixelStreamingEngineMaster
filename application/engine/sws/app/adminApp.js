const log = require("../util/log");
let client = require("./helper/clientHelper");
let ue4Helper = require("./helper/ue4Helper");
let cache = require("./../util/cache");

class Admin{
    closeTimeOut;
    login;
    ws;
    init(ws){
        log.info(`管理页面打开`);
        this.ws=ws;
        
        client.setAdmin(this);
        this.send({
            type:"playerPort",
            value:cache.getPlayer()
        })
        this.sendPlayers();
        this.send({
            type:"streamer",
            status:ue4Helper.lineStatus()
        })
        this.send({
            type:"manage",
            status:client.getUe4Manage() ? true : false
        })

        let _this = this;
        ws.on('message', (msg)=>{
            try {
                msg = JSON.parse(msg);
            } catch (err) {
                log.error(`无法解析客户端 ${playerId} 的消息: ${err}`);
                return;
            }
            _this.message(msg);
        });
        ws.on('close', function() {
            _this.close();
        });

        ws.on('error', function() {
            _this.close();
        });
        this.heartBeatTimeOutHandel();
        return this;
    }

    async message(msg){
        if (msg.type == 'ping') {
            this.send({ type: "pong"});
            this.heartBeatTimeOutHandel();
            return;
        }
        switch(msg.type){
            case "kill":        //踢用户
                    client.killPlayer(msg.playerId);
            break;
        }
    }
    send(msg){
        this.ws.send(JSON.stringify(msg))
    }
    close(){
        client.delAdmin();
    }
    sendPlayers(){
        let players = client.getPlayers();
        let list = [];
        players.forEach((item,index)=>{
            list.push({
                id:index,
                time:item.time,
                ip:item.socket.clientIp,
            });
        })
        this.send({
            type:"players",
            list:list
        })
    }
    heartBeatTimeOutHandel(){
        if(this.closeTimeOut){
            clearTimeout(this.closeTimeOut);
            this.closeTimeOut=null;
        }
        this.closeTimeOut=setTimeout(()=>{
            this.ws.close();
        },120000);
    }

}

module.exports=Admin;