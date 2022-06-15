const SessionException = require("../exception/SessionException");
const adminSession = require("./../../util/adminSession");
let AppException = require("./../exception/AppException");
let cache = require("../../util/cache");

let login = async (req,res)=>{
    if(!req.body.name){
        throw new AppException("用户名不能为空");
    }
    if(!req.body.pwd){
        throw new AppException("密码不能为空");
    }
    if(cache.getName() != req.body.name || cache.getPwd() != req.body.pwd){
        throw new AppException("用户名密码错误");
    }
    let token = adminSession.set();
    res.send({
        token:token
    })
}



module.exports={
    login:login
}