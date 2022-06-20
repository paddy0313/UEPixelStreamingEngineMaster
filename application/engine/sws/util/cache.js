let port;
let name;
let pwd;
module.exports={
    setPort(value){
        port=value;
    },
    setName(value){
        name=value;
    },
    setPwd(value){
        pwd=value;
    },

    getPort(){
        return port;
    },
    getName(){
        return name;
    },
    getPwd(){
        return pwd;
    }
}