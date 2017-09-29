var dispatcher=require("/TheLyon/Dispatcher/index.js") ;
var dot = require('dot');
var dots = dot.process({path: "/TheLyon/TheLyon/"});
dispatcher.setUP(80,'0.0.0.0');

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
   // console.log("hiiiiii")
});
dispatcher.staticDirectory('/Static','/TheLyon/TheLyon/staticFiles');
dispatcher.GetRequest('/',function(req,res){
    test=new Date(calcTime(-4));
    testB=new Date();
    console.log(testB.setDate(test.getDate()+1))
    schoolDay.findOne( {"date": {"$gte": test,"$lte":testB.setDate(test.getDate()+1)}},function(error,result){
        if(result){
    res.end(dots.index({"currentDate":test,"day":result["day"]})); 
        }
    });
    //console.log(test)
schoolDay.update({"date":new Date("2017-9-28")},{$set:{"day":2}},{upsert:true},function(err, result) {});
    
});
                                 //   var document = {"a":"b"};//include exiration later
                           //       aschoolDay.insert(document, function(err, records) {
                            //            if (err) throw err;             
                            //            });
function calcTime( offset) {

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
    return nd.toISOString().split('T')[0];
}