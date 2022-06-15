const os = require('os');
function getIp(request){
    if(request.headers["x-forwarded-for"]){
        return request.headers["x-forwarded-for"];
    }else if(request.headers["Proxy-Client-IP"]){
        return request.headers["Proxy-Client-IP"];
    }else if(request.headers["WL-Proxy-Client-IP"]){
        return request.headers["WL-Proxy-Client-IP"];
    }else{
        return request.connection.remoteAddress.replace("::ffff:", "");
    }
}

function getPort(request){
    return request.connection._peername.port;
}

function getLocalIp(name){
    var interfaces = os.networkInterfaces();
    let info = null;
    for(var _name in interfaces){
        if(name==_name){
            info = {};
            for(var key in interfaces[name]){
                if(interfaces[name][key]["family"]=="IPv4"){
                    info.ipv4=interfaces[name][key].address;
                }else if(interfaces[name][key]["family"]=="IPv6"){
                    info.ipv6=interfaces[name][key].address;
                }
            }
            break;
        }
    }
    return info;
}

module.exports = {
    getIp:getIp,
    getPort:getPort,
    getLocalIp:getLocalIp
}