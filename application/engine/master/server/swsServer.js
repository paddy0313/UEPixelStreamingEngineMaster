/**
 * 连接sws的websocket服务
 */
const WebSocket = require("ws");
let ue4Client = require("./../util/ue4Client");
let lock = require("./../util/lock");
let log = require("./../util/log")
let logHandel = require("./../../log");
class swsServer{
    heartBeatHandel;
    ws;
    ue4Process;
    try;
    constructor(ip,port){
        this.ip=ip;
        let url = "ws://"+ip+":"+port+"/manage";
        this.init(url);
    }
    init(url){
        this.try=true;
        this.ws = new WebSocket(url);
        let _this = this;
        this.ws.on("open",()=>{
            log.info("连接服务注册中心成功");
            logHandel.success("连接服务注册中心成功");
            logHandel.connect();
            _this.heartBeatTimeout();
        })
        this.ws.on("close",async (code,message)=>{
            log.error("信令服务连接关闭");
            logHandel.error("连接服务注册中心失败");
            logHandel.unconnect();
            await _this.close();
            if(_this.try){
                await lock.sleep(5000);
                _this.init(url);
            }
        })
        this.ws.on("message",(data)=>{
            data = JSON.parse(data);
            log.info("收到消息:",data);
            _this.message(data.action,data.param);
        })
        this.ws.on("error",()=>{
            log.error("信令服务连接异常");
            logHandel.error("信令服务连接异常");
        })
    }
    terminate(){
        this.try=false;
        if(this.ws){
            this.ws.terminate()
        }
    }
    async close(){
        return new Promise(async (resolve,reject)=>{
            this.clearHeartBeat();
            await this.messageUe4Kill();
            resolve();
        })
    }
    message(action,data){
        let _this = this;
        switch(action){
            case "run":         //开启ue4
                lock.lock("ue4",async ()=>{
                    await _this.messageUe4Open(data);
                })
                break;
            case "kill":        //关闭ue4
                lock.lock("ue4",async ()=>{
                    await _this.messageUe4Kill();
                })
                break;
            case "ping":
                this.send("pong");
                this.heartBeatTimeout();
                break;
        }
    }
    messageUe4Open(param){
        log.info("启动ue4")
        logHandel.info("启动渲染程序");
        this.ue4Process = new ue4Client();
        this.ue4Process.errHandel=()=>{     //异常关闭处理
            this.ue4Process.run(this.ip,param.port);      //自动重启
        }
        this.ue4Process.run(this.ip,param.port);
    }
    messageUe4Kill(){
        log.info("关闭ue4")
        logHandel.info("关闭渲染程序");
        if(this.ue4Process){
            this.ue4Process.close();
            this.ue4Process=null;
        }
    }
    send(action,data){
        let _data = {
            action:action
        }
        if(data){
            _data.data=data;
        }
        log.info("发送消息",_data);
        this.ws.send(JSON.stringify(_data));
    }
    heartBeatTimeout(){
        this.clearHeartBeat();
        this.heartBeatHandel = setTimeout(()=>{
            this.ws.terminate();
        },35000)
    }
    clearHeartBeat(){
        if(this.heartBeatHandel){
            clearTimeout(this.heartBeatHandel);
        }
    }
}

module.exports=swsServer;