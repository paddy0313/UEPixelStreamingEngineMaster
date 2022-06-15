const AppException = require("../exception/AppException");
const SessionException = require("../exception/SessionException");

module.exports = (err,req,res,next)=>{
    if(err instanceof AppException){
        res.status(400).send({
            message:err.message
        });
    } else if (err instanceof SessionException){
        res.status(401).send({
            message:"请先登录"
        });
    }else{
        res.status(500).send({
            message:"系统维护中"
        })
        next(err);
    }


}