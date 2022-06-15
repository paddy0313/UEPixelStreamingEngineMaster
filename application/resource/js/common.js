class matrix {
    constructor(){
        window.screen
        this.bgElement = document.getElementById("matrixBG");
        this.width=this.bgElement.width = document.body.offsetWidth;
        this.height=this.bgElement.height = document.body.offsetHeight;
        // console.log(this.width,this.height);
        this.yPositions = Array(300).join(0).split('');
        this.ctx=this.bgElement.getContext('2d');
        this.fonts="12345AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz67890";
        this.run();
        return this;
    }
    draw(){
        this.ctx.fillStyle='rgba(0,0,0,.05)';
        this.ctx.fillRect(0,0,this.width,this.height);
        this.ctx.fillStyle='#0F0';
        this.ctx.font = '10pt Georgia';
        let _this = this;
        this.yPositions.map(function(y, index){
            var rand = Math.floor( Math.random()* _this.fonts.length );
            var text = _this.fonts.substr( rand, 1);
            let x = (index * 10)+10;
            _this.bgElement.getContext('2d').fillText(text, x, y);
            if(y > 100 + Math.random()*1e4)
            {
                _this.yPositions[index]=0;
            }
            else
            {
                _this.yPositions[index] = y + 10;
            }
        });
    }
    run(){
        if(typeof this.Game_Interval != "undefined") clearInterval(this.Game_Interval);

        this.Game_Interval = setInterval(()=>{
            this.draw();
        }, 33);
    }
    stop(){
        clearInterval(this.Game_Interval);
    }
}

let electron = require("electron");
function initProgram(){
    return {
        send:(emit,data)=>{
            return new Promise((resolve,reject)=>{
                let ret = electron.ipcRenderer.sendSync(emit,data);
                if(ret.success){
                    resolve(ret.data);
                }else{
                    reject(ret.msg);
                }
            })
        },
        listen:(emit,fun)=>{
            electron.ipcRenderer.on(emit,(event,data)=>{
                fun(data);
            });
        },
        message:(emit,data)=>{
            electron.ipcRenderer.send(emit,data);
        }
    }
    
}
