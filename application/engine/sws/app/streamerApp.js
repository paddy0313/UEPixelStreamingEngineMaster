let log = require("./../util/log");
let client = require("./helper/clientHelper");

class Streamer{
    closeTimeOut;
    ws;
    init(ws){
        let esxit = client.getStreamer();
        if(esxit){
            ws.close();
            return ;
        }
        this.ws=ws;
        log.info(`ue4 已连上`);
        client.setStreamer(this)
        this.send({
            type: 'config',
            peerConnectionOptions: {"iceServers":[]}
        });
        var _this = this;
        ws.on('message', function onStreamerMessage(msg) {
            // log.info("收到消息",msg);
            try {
                msg = JSON.parse(msg);
            } catch(err) {
                log.error(`无法解析ue4消息类型: ${msg}\nError: ${err}`);
                return;
            }
            _this.message(msg);
        });
        ws.on('close', function() {
            log.error(`ue4 连接关闭`);
            _this.close();
        });
        ws.on('error', function() {
            log.error(`ue4 连接错误`);
            // _this.close();
        });
        client.getPlayers().forEach((item)=>{
            if(item){
                item.socket.sendConfig();
            }
        });
        this.heartBeatTimeOutHandel();
    }

    close(){
        client.closeStreamer();
        // let clone = new Map(client.players);
        // for (let player of clone.values()) {
        //     player.socket.close();
        // }
    }
    message(msg){
        if (msg.type == 'ping') {
            this.send({ type: "pong", time: msg.time});
            this.heartBeatTimeOutHandel();
            return;
        }
        let playerId;
        let player;
        switch(msg.type){
            case "answer":
                playerId = msg.playerId;
                playerId=parseInt(playerId);
                delete msg.playerId; // no need to send it to the player
                player = client.getPlayer(playerId);
                if (!player) {
                    log.error(`丢弃消息 ${msg.type} 客户端 ${playerId} 不存在`);
                    return;
                }
                log.info("send answer to player["+playerId+"]");
                player.socket.send(msg);
            break;
            case "iceCandidate":
                playerId = msg.playerId;
                playerId=parseInt(playerId);
                delete msg.playerId; // no need to send it to the player
                player = client.getPlayer(playerId);
                if (!player) {
                    log.error(`丢弃消息 ${msg.type} 客户端 ${playerId} 不存在`);
                    return;
                }
                log.info("send ice to player["+playerId+"]");
                player.socket.send(msg);
            break;
            case "disconnectPlayer":
                playerId = msg.playerId;
                playerId=parseInt(playerId);
                delete msg.playerId; // no need to send it to the player
                player = client.getPlayer(playerId);
                if (!player) {
                    log.error(`丢弃消息 ${msg.type} 客户端 ${playerId} 不存在`);
                    return;
                }
                player.socket.close();
            break;
        }
    }
    send(msg){
        // log.info("发送消息",JSON.stringify(msg));
        this.ws.send(JSON.stringify(msg))
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


module.exports=Streamer;