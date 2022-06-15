let electron = require('electron');

class dialog{
    constructor(win){
        this.win = win;
        return this;
    }
    alert(title,message){
        electron.dialog.showMessageBox(this.win,{
            title:title,
            message:message
        })
    }
    confirm(message,buttons){
        let _buttons=[];
        let callback=[];
        let defaultId=0;
        for(let i in buttons){
            _buttons.push(buttons[i].name);
            callback.push(buttons[i].callback);
            if(buttons[i].default){
                defaultId=i;
            }
        }
        electron.dialog.showMessageBox(this.win,{
            type:"question",
            title:"确认框",
            defaultId:defaultId,
            message:message,
            buttons:_buttons
        }).then((index)=>{
            if(callback[index.response]){
                callback[index.response]();
            }
        })
    }
}

module.exports=dialog;