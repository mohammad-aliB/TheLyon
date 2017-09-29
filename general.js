var dispatcher=require("/me/Dispatcher/index.js") ;
var dot = require('dot');
var dots = dot.process({path: "/TheLyon/TheLyon/"});
dispatcher.setUP(80,'0.0.0.0');
dispatcher.GetRequest('/',function(req,res){
    res.end(dots.index({"date":calcTime("asdf",2)}));
});
var mongodb = require('mongodb');
mongodb.MongoClient.connect("mongodb://192.168.206.78:27017/TheLyon", function(err, db) {
    if(err) throw err;
    // loginLogs = db.collection("loginLogs");
    // userData=db.collection("userData")
    // tagData=db.collection("tagData")
    // articleData=db.collection("articles")
    // menuData=db.collection("menus")
    // sessionStore=db.collection("sessionStore")
    // CategoryDatabase=db.collection("Category_Store")
    // CSRF_Store=db.collection("CSRF_Store")
    // UserDatabase=db.collection("User_Store")
    // SessionDatabase=db.collection("Session_Store")
    // ArticleDatabase=db.collection("Article_Store")
    // TagDatabase=db.collection("Tag_Store")
    // SearchDatabase=db.collection("Search_Store")
    calendar=db.collection("calendar")
    schoolDay=db.collection("schoolDay")
});
                                 //   var document = {"a":"b"};//include exiration later
                           //       aschoolDay.insert(document, function(err, records) {
                            //            if (err) throw err;             
                            //            });
schoolDay.update({"date":new Date("2017-9-28")},{$set:{"day":2}},{upsert:true},function(err, result) {});
function calcTime(city, offset) {

    // create Date object for current location
    var d = new Date();

    // convert to msec
    // add local time zone offset
    // get UTC time in msec
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    // create new Date object for different city
    // using supplied offset
    var nd = new Date(utc + (3600000*offset));

    // return time as a string
    return "The local time in " + city + " is " + nd.toLocaleString();
}