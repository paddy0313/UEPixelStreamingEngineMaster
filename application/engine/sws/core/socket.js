let WebSocket = require('ws');
const log = require("./../util/log");
let AdminApp = require("./../app/adminApp");
let PlayerApp = require("./../app/playerApp");
let streamerApp = require("./../app/streamerApp");
let ue4ManageApp = require("./../app/ue4ManageApp");
let adminSession = require("./../util/adminSession");
let logHandel = require("./../../log");
let cache = require("./../util/cache");


class Socket{
    nextPlayerId = 100;
    streamer;
    player;
    admin;
    ue4Manage;
    constructor(){
        this.startPlayer(cache.getPlayer());       //拉流端端口
        this.startStreamer(cache.getStreamer());   //推流端端口
        this.startAdmin(cache.getAdmin().ws);         //监控端端口
        this.startUe4Manage(cache.getManage());    //ue4管理端端口
    }

    close(){
        if(this.streamer){
            this.streamer.close();
        }
        if(this.player){
            this.player.close();
        }
        if(this.admin){
            this.admin.close();
        }
        if(this.ue4Manage){
            this.ue4Manage.close();
        }
    }
    startStreamer(port){
        console.log("streamer success: ws://127.0.0.1:"+port);
        this.streamer = new WebSocket.Server({ port: port, backlog: 1 });
        logHandel.success("推流端启动成功");
        this.streamer.on('connection', function (ws, req) {
            (new streamerApp()).init(ws,req);
        });
        return this;
    }
    startPlayer(port){
        let _this = this;
        this.player = new WebSocket.Server({ port: port});
        console.log("player success: ws://127.0.0.1:"+port);
        logHandel.success("拉流端启动成功");
        this.player.on('connection', (ws,req)=>{
            let playerId = ++ _this.nextPlayerId;
            (new PlayerApp()).init(playerId,ws,req)
        });
        return this;
    }
    startAdmin(port){
        this.admin = new WebSocket.Server({ port: port});
        logHandel.success("管理端启动成功");
        this.admin.on('connection', (ws,req)=>{
            let token = adminSession.getCookies(req).token;
            if(!token){
                ws.close();
                return ;
            }
            if(!adminSession.check(token)){
                ws.close();
                return ;
            }
            let adminClient = (new AdminApp()).init(ws);
            adminSession.setClient(adminClient);
        });
        return this;
    }
    startUe4Manage(port){
        this.ue4Manage = new WebSocket.Server({ port: port});
        logHandel.success("主机端启动成功");
        console.log("ue4 manage success: ws://127.0.0.1:"+port);
        this.ue4Manage.on('connection', (ws)=>{
            (new ue4ManageApp()).init(ws);
        });
        return this;
    }
}






module.exports = Socket