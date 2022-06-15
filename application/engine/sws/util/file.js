let fs = require("fs");
let path = require("path");

/**
 * 判断文件是否存在
 * @param {*} file 
 * @returns 
 */
let exsit = (file)=>{
    return new Promise((resolve,reject)=>{
        try {
            fs.accessSync(file)
            resolve(true);
        } catch (error) {
            resolve(false);
        }
    })
}

/**
 * 创建目录
 * @param {*} dir 
 */
let mkdir = async (dir)=>{
    let _exsit = await exsit(dir);
    if(!_exsit){
        await mkdir(path.dirname(dir))
        fs.mkdirSync(dir);
    }
}

/**
 * 写入文件
 * @param {*} file 
 * @param {*} content 
 */
let putContentFile = async (file,content) =>{
    fs.writeFileSync(file,content);
}

let unlink = function (file){
    fs.unlinkSync(file)
}


module.exports={
    exsit:exsit,
    mkdir:mkdir,
    putContentFile:putContentFile,
    unlink:unlink,
}