class request{
    constructor(event,data){
        this.data=data;
        this.event=event;
    }
    
    success(data){
        this.event.returnValue={
            success:true,
            data:data
        };
    }
    fail(msg){
        this.event.returnValue={
            success:false,
            msg:msg
        }
    }

    send(emit,data){
        this.event.sender.send(emit,data);
    }
}



module.exports = request;