let string = require("./string");
let session=null;

/**
 * 生成一个新的sesion
 */
function set(){
    if(session && session.client){
        session.client.ws.close();      //将上一个管理员踢下线
    }
    session={
        client:null,
        key:null,
    };
    session.key=string.random(36);
    return session.key;
}

/**
 * 校验sessionKey是否有效
 * @param {*} key 
 * @returns 
 */
function check(key){
    if(session && key == session.key){
        return true;
    }
    return false;
}

function getCookies(request){
    var cookies = {};
    if(request.headers.cookie){
        request.headers.cookie.split(';').forEach(function(cookie) {
            var parts = cookie.match(/(.*?)=(.*)$/);
            var name = parts[1].trim();
            var value = (parts[2] || '').trim();
            cookies[ name ] = value;
        });
    }
    return cookies;
}

function setClient(client){
    session.client=client;
}


module.exports={
    set:set,
    check:check,
    getCookies:getCookies,
    setClient:setClient
}