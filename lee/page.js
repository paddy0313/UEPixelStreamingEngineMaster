
const request = require('./request');
let path = require("path");


class load {
    constructor(window,router,data){
        this.window = window;
        this.router = router;
        this.data = data;
        this.init();
    }
    init(){
        let routers = this.router.split(".");

        let keyConfigParams = [__dirname,"..",this.window.name,"page"].concat(routers).concat("index.json");
        this.option = require(path.join(...keyConfigParams));

        let fileParams = [__dirname,"..",this.window.name,"page"].concat(routers).concat("index.html");
        this.file = path.join(...fileParams);

        let logicParams = [__dirname,"..",this.window.name,"page"].concat(routers).concat("logic.js");
        this.logic = require(path.join(...logicParams));
    }

    setGlobalMethod(method){
        this.method = method;
    }

    unload(){
        if(this.logic && this.logic.unload){
            this.logic.unload();
        }
    }
    beforeLoad(){
        return new Promise((resolve,reject)=>{
            if(this.logic && this.logic.beforeLoad){
                let ret=this.logic.beforeLoad(this.window);
                if(!ret){
                    reject();
                    return ;
                }
            }
            resolve();
        })
    }
    
    run(){
        electron.ipcMain.removeAllListeners();
        this.window.loadFile(this.file).then(_=>{
            if(this.method){
                for(let method in this.method){
                    electron.ipcMain.on(method,async (event,arg)=>{
                        let req = new request(event,arg);
                        this.method[method](this.window,req);
                    });
                }
            }
            if(this.logic.method){
                for(let method in this.logic.method){
                    electron.ipcMain.on(method,async (event,arg)=>{
                        let req = new request(event,arg);
                        this.logic.method[method](this.window,req);
                    });
                }
            }
            this.logic.load(this.window,this.data);
        });
    }

    config(){
        if(this.option.winSize){
            this.window.setContentSize(this.option.winSize.width,this.option.winSize.height,true);
        }
        if(this.option.menu){
            //FIXME 菜单设置
        }else{
            this.window.removeMenu();
        }
    }
}

module.exports=load;