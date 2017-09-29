var dispatcher=require("/me/Dispatcher/index.js") ;
var dot = require('dot');
var dots = dot.process({path: "/TheLyon/TheLyon/"});
dispatcher.setUP(80,'0.0.0.0');
dispatcher.GetRequest('/',function(req,res){
    res.end(dots.index({}));
});