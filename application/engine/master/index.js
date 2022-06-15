

var swsServer = require("./server/swsServer");
class master{
    sws;
    connect(ip,port){
        this.sws=new swsServer(ip,port);
    }
    unconnect(){
        this.sws.terminate();
    }
}
module.exports = master