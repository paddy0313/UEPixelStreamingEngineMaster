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
var sws = log4js.getLogger("manage");


module.exports = {
    debug:(...msg)=>{
        sws.debug(...msg);
    },
    info:(...msg)=>{
        sws.info(...msg);
    },
    error:(...msg)=>{
        sws.error(...msg);
    }
}
