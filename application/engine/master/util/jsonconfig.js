
let fs = require("./file");

let config = new Map();
/**
 * json配置项
 * 文件地址
 * 过期时间
 */
function get(file){
    let data = config.get(file)
    if(data){
        return data;
    }
    let string = fs.readSync(file);
    data = JSON.parse(string);
    config.set(file,data);
    return data;
}

/**
 * 清除配置缓存
 * @param {*} file 
 */
function flush(file){
    config.delete(file);
}


module.exports={
    get:get,
    flush:flush,
}