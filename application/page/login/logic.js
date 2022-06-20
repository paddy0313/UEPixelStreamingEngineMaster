let verificationHelper = require("./../../helper/verificationHelper");
let AlertException = require("./../../exception/AlertException");
let dataHelper = require("../../helper/dataHelper");


let dh = new dataHelper("login");
module.exports = {
    //加载页面前执行逻辑 返回true则继续后续的load逻辑 否则不执行加载
    beforeLoad:(window,data)=>{
        let param = dh.get();
        if(param && param.auth){
            if(param.local){
                window.go("main",{
                    local:true,
                    sws:param.config
                });
            }else{
                window.go("main",{
                    local:false,
                    sws:param.config
                });
            }
            return false;
        }
        return true;
    },
    load:(window,data)=>{
        let param = dh.get();
        if(param){
            window.send("init",param);
        }
    },
    unload:()=>{
        
    },
    method:{
        contect:(window,request)=>{
            if(!verificationHelper.checkUrl(request.data.url)){
                throw new AlertException("信令服务地址错误");
            }
            let param = {
                type:"sign",
                url:request.data.url,
                auth:request.data.auth,
            }
            dh.save(param);
            window.go("sign",{url:param.url});
        },
        login:(window,request)=>{
            let param = {};
            if(request.data.local){
                if(!request.data.config.port){
                    throw new AlertException("请填写服务端口");
                }
                if(!request.data.config.adminname){
                    throw new AlertException("请填写管理账号");
                }
                if(!request.data.config.adminpwd){
                    throw new AlertException("请填写管理密码");
                }
                param={
                    local:true,
                    sws:request.data.config
                };
            }else{
                if(!request.data.config.ip){
                    throw new AlertException("请填写信令服务IP");
                }
                if(!request.data.config.port){
                    throw new AlertException("请填写信令服务端口");
                }
                param={
                    local:false,
                    sws:request.data.config
                };
            }
            dh.save(request.data);
            window.go("main",param);
        }
    }
}