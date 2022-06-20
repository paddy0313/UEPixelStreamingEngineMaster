let Engine = require("../../engine");
// let log = require("../../engine/log");
let dataHelper = require("../../helper/dataHelper");
let engine;
module.exports = {
    load:(window,data)=>{
        engine = new Engine();
        engine.log.setSuccess((msg)=>{
            window.send("log",{
                type:"success",
                text:msg,
            });
        });
        engine.log.setWarn((msg)=>{
            window.send("log",{
                type:"warning",
                text:msg,
            });
        });
        engine.log.setError((msg)=>{
            window.send("log",{
                type:"error",
                text:msg,
            });
        });
        engine.log.setInfo((msg)=>{
            window.send("log",{
                type:"info",
                text:msg,
            });
        });
        engine.log.setConnect(()=>{
            window.send("swsStatus",true);
        })
        engine.log.setUnconnect(()=>{
            window.send("swsStatus",false);
        })
        if(data.local){
            engine.startSws(data.sws).then(res=>{
                console.log("启动管理端")
                engine.startMaster("127.0.0.1",data.sws.port)
            });
            ;
        }else{
            engine.startMaster(data.sws.ip,data.sws.port);
        }
        
        window.send("autorun",window.getAutoRun());
    },
    unload:()=>{
    },
    method:{
        logout:(window)=>{
            window.dialog.confirm("是否确认退出",[
                {
                    name:"退出",
                    callback:()=>{
                        engine.close();
                        let dh = new dataHelper("login");
                        let param = dh.get();
                        param.auth=false;
                        dh.save(param);
                        window.go("login");
                    },
                },
                {
                    name:"取消",
                    default:true,
                    callback:()=>{
                    },
                },
            ])
        },
        autorun:(window,request)=>{
            if(window.getAutoRun()){
                window.setUnAutoRun();
            }else{
                window.setAutoRun();
            }
            request.send("autorun",window.getAutoRun());
        }
    }
}
