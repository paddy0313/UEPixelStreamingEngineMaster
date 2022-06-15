class AlertException{
    constructor(message){
        this.code = "AlertException";
        this.title = "错误";
        this.message = message;
        return this;
    }
}

module.exports = AlertException;