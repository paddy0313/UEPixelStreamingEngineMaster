let ue4Helper = require("./ue4Helper");
class clients{
    players=new Map();
    streamer;
    ue4Manage;
    admin;
    setPlayer(id,player){
        this.players.set(id,{
            time:(new Date()).getTime(),
            socket:player
        });
        if(this.getAdmin()){
            this.getAdmin().sendPlayers();
        }
        
    }
    getPlayers(){
        return this.players;
    }
    getPlayer(id){
        return this.players.get(id);
    }
    getPlayerIdByName(name){
        let players = this.getPlayers();
        for(let item of players){
            if(item[1].socket.name==name){
                return item[0];
            }
        }
        return null;
    }
    delPlayer(id){
        this.players.delete(id);
        if(this.getAdmin()){
            this.getAdmin().sendPlayers();
        }
    }
    killPlayer(id){
        let player = this.getPlayer(id);
        if(player){
            console.log("关闭客户端"+id);
            player.socket.kill();
        }
    }
    setStreamer(streamer){
        this.streamer=streamer;
        ue4Helper.online();
        let admin = this.getAdmin();
        if(admin){
            admin.send({
                type:"streamer",
                status:true
            })
        }
    }
    getStreamer(){
        return this.streamer;
    }
    closeStreamer(){
        this.streamer=null;
        ue4Helper.unline();
        let admin = this.getAdmin();
        if(admin){
            admin.send({
                type:"streamer",
                status:false
            })
        }
    }
    /**
     * 设置ue4管理端
     * @param {*} ue4Manage 
     */
    setUe4Manage(ue4Manage){
        this.ue4Manage=ue4Manage;
        let admin = this.getAdmin();
        if(admin){
            admin.send({
                type:"manage",
                status:true
            })
        }
    }
    /**
     * 关闭ue4管理端
     */
    closeUe4Manage(){
        this.ue4Manage=null;
        let admin = this.getAdmin();
        if(admin){
            admin.send({
                type:"manage",
                status:false
            })
        }
    }
    /**
     * 获取ue4管理端
     * @returns 
     */
    getUe4Manage(){
        return this.ue4Manage;
    }
    setAdmin(admin){
        this.admin=admin;
    }
    getAdmin(){
        return this.admin;
    }
    delAdmin(){
        this.admin=null;
    }
}
let client = new clients;

module.exports=client;