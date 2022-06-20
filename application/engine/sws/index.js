let cache = require("./util/cache");
let core = require("./core");

class sws{
    core;
    start(option){
        cache.setName(option.adminname);
        cache.setPwd(option.adminpwd);
        cache.setPort(option.port);
        this.core = new core();
        return this.core.start();
    }

    close(){
        this.core.close();
    }
}
module.exports = sws;