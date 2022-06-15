let fs = require("fs");
let path = require("path");
let log = require("./log");

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

let readSync = (file)=>{
    return fs.readFileSync(file);
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
let writeSync = async (file,content) =>{
    fs.writeFileSync(file,content);
}


let copy = (source,dest)=>{
    log.info("rename",source,dest);
    return new Promise((resolve,reject)=>{
        fs.rename(source,dest,(err)=>{
            if(err){
                reject(err);
                log.error("rename",err);
                return ;
            }
            resolve();
        })
    })
}


let extname = (file)=>{
    return path.extname(file)
}

module.exports={
    exsit:exsit,
    mkdir:mkdir,
    writeSync:writeSync,
    readSync:readSync,
    copy:copy,
    extname:extname
}