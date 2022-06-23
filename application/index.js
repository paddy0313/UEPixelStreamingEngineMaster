let path = require("path");
let ExceptionHandel = require("./exception/handel");

module.exports = {
    option: {
        "center":true,
        "resizable":false,
        "backgroundColor":"#fff",
        "frame": false,
        "webPreferences":{
            "nodeIntegration": true,
            "contextIsolation": false
        }
    },
    global:{
        icon:path.join(__dirname,"resource","favicon.ico"),
        authRun:true,           //开机启动
    },
    tray:{
        icon:path.join(__dirname,"resource","favicon.ico"),
        menu:[
            {
                label:"退出",
                click:(win)=>{
                    win.close()
                }
            },
        ],
        toolTip:"渲染平台管理端"
    },
    
    init:(window)=>{
        window.go("login",{});
        // (new Page("login")).go();
    },
    ExceptionHandel:(new ExceptionHandel()),
    method:{
        close:(window,request)=>{
            window.dialog.confirm("是否关闭程序",[
                {
                    name:"取消",
                    callback:()=>{
                    },
                },
                {
                    name:"关闭",
                    callback:()=>{
                        window.close();
                    },
                },
                {
                    name:"最小化(后台运行)",
                    default:true,
                    callback:()=>{
                        window.tray();
                    },
                },
            ])
        },
    }
}