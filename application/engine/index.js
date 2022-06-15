let master = require("./master");
let sws = require("./sws");
let log = require("./log");

class engine{
    log=log;
    master;
    sws;
    startMaster(ip,port){
        this.master=new master();
        this.master.connect(ip,port);
    }
    startSws(option){
        this.sws=new sws();
        this.sws.start(option);
    }
    close(){
        if(this.master){
            this.master.unconnect();
        }
        if(this.sws){
            this.sws.close();
        }
    }
}
module.exports = engine;