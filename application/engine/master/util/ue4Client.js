const child_process=require("child_process");
let log = require("./log")

let jsonconfig = require("./jsonconfig");

class ue4Client{
    runing=false;
    ue4Process;
    run(host,port){
        this.runing=true;
        let _this = this;
        let exeFile = this.getUe4ExeFile();
        let param = [
            "-AudioMixer",
            "-PixelStreamingIP="+host,
            "-PixelStreamingPort="+port
        ];
        let ue4Config = this.getUe4Param();
        if(ue4Config){
            param=param.concat(ue4Config);
        }
        log.info("run ue4",exeFile,param);
        this.ue4Process = child_process.spawn(exeFile,param);
        this.ue4Process.stderr.on("data",data=>{
            // log.error("stderr",data.length);
        });
        this.ue4Process.stdout.on("data",data=>{
            // log.error("stderr",data.length);
        })
        this.ue4Process.on("close",code=>{
            log.error("close",code);
            if(_this.runing && _this.errHandel){      //触发关闭动作
                _this.errHandel()
            } 
        })
    }
    getUe4Param(){
        let config = jsonconfig.get(__home__+"/render/config.json");
        return config.param;
    }
    getUe4ExeFile(){
        let config = jsonconfig.get(__home__+"/render/config.json");
        return __home__+"/render/"+config.exefile;
    }
    close(){
        if(this.ue4Process){
            this.runing=false;
            this.ue4Process.kill();
        }
    }
}

module.exports=ue4Client;