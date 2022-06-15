
const bodyParser=require("body-parser");
let adminPassport = require("./admin/passport");

module.exports = (app)=>{
    var jsonParser = bodyParser.json();
    app.post("/login",jsonParser,adminPassport.login);
}