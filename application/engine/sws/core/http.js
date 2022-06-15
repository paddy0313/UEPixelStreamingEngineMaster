var express = require('express');
require('express-async-errors');
const proxy = require("http-proxy-middleware")
const http = require("http");
const path = require('path');
const fs = require("fs");

let errorHandel = require("./../http/helper/errorHandel");
let router = require("./../http/router");


let logHandel = require("./../../log");
let cache = require("./../util/cache");


class httpd{
    adminApp;
    adminServerProxy;
    constructor(){
        this.initAdminPage(cache.getAdmin().http,cache.getAdmin().ws);
    }
    close(){
        this.closeAdminPage();
    }

    initAdminPage(httpport,wsport){
        this.adminApp = express();
        var wsProxy = proxy.createProxyMiddleware({
            target:"http://127.0.0.1:"+wsport,
            changeOrigin:true,
            ws:true
        });

        //线上版本
        this.adminApp.use(express.static(path.join(__dirname,"../",'html')));
        this.adminApp.get("*",(req, res)=>{
            res.send(fs.readFileSync(path.join(__dirname,"../",'html')+"/index.html","utf-8"));
        })
        this.adminApp.use("/ws",wsProxy);
        router(this.adminApp);
        this.adminApp.use(errorHandel);
        this.adminServerProxy = http.createServer({},this.adminApp);
        this.adminServerProxy.listen(httpport,function(){
            console.log(`admin success http://127.0.0.1:${httpport}`);
            logHandel.success("管理端启动成功(访问地址):http://127.0.0.1:"+httpport);
        });
        this.adminServerProxy.on("upgrade",wsProxy.upgrade);
        this.adminServerProxy.on("close",e=>{
            console.log("adminServerProxy close");
        });
    }

    closeAdminPage(){
        if(this.adminServerProxy){
            this.adminServerProxy.close();
        }
    }


}
module.exports=httpd;