var Socket = require("./core/socket");
var Http = require("./core/http");
let cache = require("./util/cache");

class sws{
    http;
    socket;
    start(option){
        cache.setName(option.adminpagename);
        cache.setPwd(option.adminpagepwd);
        cache.setPlayer(option.playerport);
        cache.setStreamer(option.streamerport);
        cache.setManage(option.manageport);
        cache.setAdmin(option.adminpageport,option.adminswsport);
        this.socket=new Socket();
        this.http = new Http();
    }

    close(){
        this.http.close();
        this.socket.close();
    }
}
module.exports = sws;