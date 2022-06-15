let player;
let streamer;
let manage;
let admin;
let name;
let pwd;
module.exports={
    setPlayer(value){
        player=value;
    },
    setStreamer(value){
        streamer=value;
    },
    setManage(value){
        manage=value;
    },
    setAdmin(http,ws){
        admin={http,ws};
    },
    setName(value){
        name=value;
    },
    setPwd(value){
        pwd=value;
    },

    getPlayer(){
        return player;
    },
    getStreamer(){
        return streamer;
    },
    getManage(){
        return manage;
    },
    getAdmin(){
        return admin;
    },
    getName(){
        return name;
    },
    getPwd(){
        return pwd;
    }
}