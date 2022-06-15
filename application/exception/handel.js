class ExceptionHandel{
    on(window,exception){
        if(typeof exception == "object"){
            switch(exception.code){
                case "AlertException":
                    window.dialog.alert(exception.title,exception.message);
                    break;
            }
        }
    }
}

module.exports = ExceptionHandel;