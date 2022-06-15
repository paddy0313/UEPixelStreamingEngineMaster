let dialog = require("./dialog");
let page = require("./page");
let md5 = require("md5-node");
let log = require("./log");


/**
 * 窗口类
 */
class window{
    constructor(application){
        this.name = application.name;           //应用名
        this.option=application.option;             //设置启动参数
        this.option.show=false;

        this.icon = application.global.icon;        //设置icon
        
        this.trayOption = application.tray;         //设置托盘配置

        this.method = application.method;
        
        //创建窗口
        let win = new electron.BrowserWindow(this.option);
        win.on('ready-to-show',()=>{
            win.show();
        });
        win.setIcon(this.icon);
        electron.globalShortcut.register('CommandOrControl+D', () => {
            win.webContents.toggleDevTools();
        })
        this.win=win;

        //设置弹窗
        this.dialog = new dialog(this.win);
    }

    /**
     * 判断窗口是否显示状态
     * @returns 
     */
    isVisible(){
        return this.win.isVisible();
    }
    /**隐藏窗体 */
    hide(){
        this.win.hide();
    }
    /**显示窗体 */
    show(){
        this.win.show();
    }
    /**
     * 最小化到托盘
     * @returns 
     */
    tray(){
        if(!this.trayOption){
            return ;
        }
        this.hide();
        let tray = new electron.Tray(this.trayOption.icon);
        let menu = [];
        for(let i in this.trayOption.menu){
            menu.push({
                label:this.trayOption.menu[i].label,
                click:()=>{
                    this.trayOption.menu[i].click(this);
                }
            })
        }
        if(menu.length>0){
            tray.setContextMenu(electron.Menu.buildFromTemplate(menu));
        }
        if(this.trayOption.toolTip){
            tray.setToolTip(this.trayOption.toolTip);
        }
        tray.on("click",()=>{
            this.isVisible() ? this.hide() : this.show();
            tray.destroy();
        });
    }
    /**
     * 发送消息
     * @param {*} emit 
     * @param {*} data 
     */
    send(emit,data){
        this.win.webContents.send(emit,data);
    }
    /**
     * 获取船体媒体源id
     * @returns 
     */
    getMediaSourceId(){
        return this.win.getMediaSourceId();
    }

    /**价值页面 */
    go(route,data){
        if(this.page){
            this.page.unload();
        }
        this.page=null;
        let curPage = new page(this,route,data);

        
        curPage.beforeLoad().then(_=>{
            curPage.setGlobalMethod(this.method);
            curPage.config();
            curPage.run();
            this.page = curPage;
        }).catch(e=>{
            log.error("beforeLoad",e);
        });
    }

    loadFile(file){
        return this.win.loadFile(file);
    }

    /**
     * 关闭窗口
     */
    close(){
        this.win.destroy();
    }

    setContentSize(width,height,animate){
        return this.win.setContentSize(width,height,animate);
    }
    removeMenu(){
        return this.win.removeMenu();
    }
    setAutoRun(){
        electron.app.setLoginItemSettings({
            openAtLogin: true,
            path:process.execPath,
            args:["--hidden"],
            name:md5(process.execPath),
        });
    }
    setUnAutoRun(){
        electron.app.setLoginItemSettings({
            openAtLogin: false,
            path:process.execPath,
            args:[],
            name:md5(process.execPath),
        });
    }
    getAutoRun(){
        return electron.app.getLoginItemSettings().executableWillLaunchAtLogin
    }
    relaunch(){
        electron.app.relaunch();
        electron.app.exit();
    }
}


module.exports=window