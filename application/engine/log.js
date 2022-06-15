let successHandel;
let warnHandel;
let errorHandel;
let infoHandel;
let connectHandel;
let unconnectHandel;

module.exports={
    success:(msg)=>{
        if(successHandel){
            successHandel(msg);
        }
    },
    warn:(msg)=>{
        if(warnHandel){
            warnHandel(msg);
        }
    },
    error:(msg)=>{
        if(errorHandel){
            errorHandel(msg);
        }
    },
    info:(msg)=>{
        if(infoHandel){
            infoHandel(msg);
        }
    },
    connect:()=>{
        if(connectHandel){
            connectHandel();
        }
    },
    unconnect:()=>{
        if(unconnectHandel){
            unconnectHandel();
        }
    },
    setSuccess:(fn)=>{
        successHandel=fn;
    },
    setWarn:(fn)=>{
        warnHandel=fn;
    },
    setError:(fn)=>{
        errorHandel=fn;
    },
    setInfo:(fn)=>{
        infoHandel=fn;
    },
    setConnect:(fn)=>{
        connectHandel=fn;
    },
    setUnconnect:(fn)=>{
        unconnectHandel=fn;
    }
}