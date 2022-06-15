let window = require("./window");
let log = require("./log");
class laperlee{
    init(application){
        this.application = application;

        //创建窗口
        this.applicationWindow = (new window(application));
        
        //增加激活监听
        electron.app.on('activate', function () {
            if (electron.BrowserWindow.getAllWindows().length === 0){
                application.init()
            }
        });
        //监听一场捕获
        process.on("unhandledRejection",error=>{
            application.ExceptionHandel.on(this.applicationWindow,error);
        });

        //检查启动参数 是否启动后进入托盘模式
        let isHidden = process.argv.findIndex(arg=>{
            return arg=="--hidden";
        });
        if(isHidden!=-1){
            this.applicationWindow.tray();
        }
        application.init(this.applicationWindow);
    }

    async load(page,data){
        if(this.page){
            this.page.unload();
        }
        this.page=null;
        let curPage = new load(this.applicationWindow,page,data);
        curPage.setGlobalMethod(this.application.method);
        curPage.config();
        curPage.beforeLoad().then(_=>{
            curPage.run();
            this.page = curPage;
        }).catch(e=>{
            log.error("beforeLoad",e);
        });
    }
}
let lee = new laperlee();


module.exports = lee