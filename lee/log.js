var log4js = require('log4js');
log4js.configure({
"appenders": {
    "console": {
        "type": "console"
    },
    "file": {
        "type": "dateFile",
        "filename": "logs/file",
        "encoding": "utf-8",
        "maxLogSize": 1000000,
        "numBackups": 3,
        "pattern": "yyyy-MM-dd.log",
        "alwaysIncludePattern": true
    }
},
"categories": {
    "default": {
        "appenders": [
            "console",
            "file"
        ],
        "level": "debug"
    }
}
});
var system = log4js.getLogger("system");


module.exports = {
    debug:(...msg)=>{
        system.debug(...msg);
    },
    info:(...msg)=>{
        system.info(...msg);
    },
    error:(...msg)=>{
        system.error(...msg);
    }
}
