const path = require("path");

global.electron = require('electron');
let laperlee = require("./lee");




if(electron.app.isPackaged){
    global.__home__ = path.dirname(electron.app.getPath('exe'));
}else{
    global.__home__ = process.cwd();
}

module.exports = (appName)=>{

    let application = require("./"+appName);
    application.name=appName;

    electron.app.commandLine.appendSwitch('disable-pinch');
    electron.app.whenReady().then(() => {
        laperlee.init(application);
    })
    electron.app.on('window-all-closed', function () {
        electron.app.quit()
    })
    electron.app.on("activate",()=>{
        laperlee.init(application);
    })
}

