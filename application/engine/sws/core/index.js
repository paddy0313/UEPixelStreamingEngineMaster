var express = require('express');
require('express-async-errors');
const proxy = require("http-proxy-middleware")
const http = require("http");
const path = require('path');
const fs = require("fs");
let WebSocket = require('ws');
let AdminApp = require("./../app/adminApp");
let PlayerApp = require("./../app/playerApp");
let streamerApp = require("./../app/streamerApp");
let ue4ManageApp = require("./../app/ue4ManageApp");
let adminSession = require("./../util/adminSession");

let errorHandel = require("./../http/helper/errorHandel");
let router = require("./../http/router");


let logHandel = require("./../../log");
let cache = require("./../util/cache");


class Core{
    playerId=100;           //下一个playerId 应用在

    http;

    streamerWebSocket;
    playerWebSocket;
    adminWebSocket;
    ue4ManageWebSocket;
    start(){
        let port = cache.getPort();
        return this.startPlayer().startStreamer().startAdmin().startUe4Manage()
        .startHttp(port);
    }
    close(){
        if(this.http){
            this.http.close();
        }
        
    }

    startHttp(port){
        let _this = this;
        return new Promise((resolve,reject)=>{
            const app = express();
            app.use(express.static(path.join(__dirname,"../",'html')));
            app.get("*",(req, res)=>{
                res.send(fs.readFileSync(path.join(__dirname,"../",'html')+"/index.html","utf-8"));
            });
            router(app);
            app.use(errorHandel);
            _this.http = http.createServer(app);
            _this.http.on("upgrade",(req,socket,head)=>{
                if(req.url == "/admin"){
                    _this.adminWebSocket.handleUpgrade(req,socket,head,(coon)=>{
                        _this.adminWebSocket.emit("connection",coon,req);
                    })
                }else if(req.url == "/player"){
                    _this.playerWebSocket.handleUpgrade(req,socket,head,(coon)=>{
                        _this.playerWebSocket.emit("connection",coon,req);
                    })
                }else if(req.url == "/manage"){
                    _this.ue4ManageWebSocket.handleUpgrade(req,socket,head,(coon)=>{
                        _this.ue4ManageWebSocket.emit("connection",coon,req);
                    })
                }else{
                    _this.streamerWebSocket.handleUpgrade(req,socket,head,(coon)=>{
                        _this.streamerWebSocket.emit("connection",coon,req);
                    })
                }
            });
            _this.http.listen(port,()=>{
                logHandel.success("信令服务启动成功");
                logHandel.success("监控后台地址:http://127.0.0.1:"+port);
                resolve();
            });
        })
    }

    startStreamer(){
        this.streamerWebSocket = new WebSocket.Server({ noServer:true, backlog: 1 });
        this.streamerWebSocket.on('connection', function (ws, req) {
            (new streamerApp()).init(ws,req);
        });
        return this;
    }
    startPlayer(){
        let _this = this;
        this.playerWebSocket = new WebSocket.Server({ noServer:true});
        this.playerWebSocket.on('connection', (ws,req)=>{
            let playerId = ++ _this.playerId;
            (new PlayerApp()).init(playerId,ws,req)
        });
        return this;
    }
    startAdmin(){
        this.adminWebSocket = new WebSocket.Server({noServer:true});
        this.adminWebSocket.on('connection', (ws,req)=>{
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
    startUe4Manage(){
        this.ue4ManageWebSocket = new WebSocket.Server({ noServer:true});
        this.ue4ManageWebSocket.on('connection', (ws)=>{
            (new ue4ManageApp()).init(ws);
        });
        return this;
    }
}
module.exports = Core