let log = require("./../util/log");
let client = require("./helper/clientHelper");
let lock = require("./../util/lock");
let host = require("./../util/host");
class Player{
    closeTimeOut;
    clientIp;
    playerId;
    ws;
    lock;
    lockTimeout;
    status;
    init(playerId,ws,req){
        this.clientIp = host.getIp(req);
        // playerId = playerId.toString();
        let ue4manage=client.getUe4Manage();
        if(ue4manage){
            ue4manage.run();
        }
        this.status=true;
        this.lock=false;
        client.setPlayer(playerId,this);
        this.playerId=playerId;
        this.ws=ws;
        log.info(`客户端 ${playerId}已连上`);
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
            console.log("close")
            _this.close();
        });

        ws.on('error', function() {
            console.log("error");
            _this.close();
        });
        this.heartBeatTimeOutHandel();
    }
    async message(msg){
        if (msg.type == 'ping') {
            this.send({ type: "pong"});
            this.heartBeatTimeOutHandel();
            return;
        }
        switch(msg.type){
            case "ready":
                let adminSocket = client.getAdmin();
                if(adminSocket){
                    adminSocket.sendPlayers();
                }
                if(client.getStreamer()){
                    this.sendConfig();
                }
            break;
            case "offer":
                msg.playerId = this.playerId;
                msg.sdp = msg.sdp.replace(
                    /(a=fmtp:\d+ .*level-asymmetry-allowed=.*)\r\n/gm,
                    '$1;x-google-start-bitrate=10000;x-google-max-bitrate=20000\r\n'
                  );
                msg.sdp = msg.sdp.replace(/(a=extmap-allow-mixed)\r\n/gm, "");
                this.streamerSend(msg)
            break;
            case "iceCandidate":
                msg.playerId = this.playerId;
                this.streamerSend(msg);
            break;
            case "success":
                if(this.lock){
                    clearTimeout(this.lockTimeout);
                    lock.unsetLock("lock");
                    this.lock=false;
                }
                break;
        }
    }
    async sendConfig(){
        let _this=this;
        let lockRet = await lock.setLock("lock",()=>{
            return _this.status;
        });
        if(lockRet){        //成功抢到锁
            this.lock=true;
            this.lockTimeout=setTimeout(()=>{
                lock.unsetLock("lock")
                _this.lock=false;
            },5000)
            this.send({
                type: 'config',
                peerConnectionOptions: {"iceServers":[]}
            });
        }
    }
    send(msg){
        this.ws.send(JSON.stringify(msg))
    }
    kill(){
        this.ws.close();
    }
    close(){
        this.status=false;
        if(this.lock){
            clearTimeout(this.lockTimeout);
            lock.unsetLock("lock");
            this.lock=false;
        }
        client.delPlayer(this.playerId);
        log.info("客户端"+this.playerId+"断开连接");
        setTimeout(()=>{
            if(client.getPlayers().size==0){
                let ue4manage=client.getUe4Manage();
                if(ue4manage){
                    ue4manage.kill();
                }
            }
        },5000);
        this.streamerSend({type: 'playerDisconnected', playerId: this.playerId});
    }
    streamerSend(msg){
        let streamer = client.getStreamer();
        if(streamer){
            streamer.send(msg);
        }
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


module.exports=Player;