let path = require("path");
let fs = require("fs")
let dbDir = path.join(__home__,"data");
if(!fs.existsSync(dbDir)){
    fs.mkdirSync(dbDir);
}

class dataHelper{
    constructor(dbName){
        this.dbFile = path.join(dbDir,dbName);
    }

    save(data){
        fs.writeFileSync(this.dbFile,JSON.stringify(data),"utf-8");
    }
    get(){
        try {
            let data = fs.readFileSync(this.dbFile,"utf-8");
            return JSON.parse(data);
        } catch (error) {
            return null;
        }
    }

}


module.exports=dataHelper;