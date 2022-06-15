var url = require("url");

function checkUrl(value){
    try {
        new url.URL(value);
        return true;
    } catch (error) {
        return false;
    }
}

module.exports={
    checkUrl
}