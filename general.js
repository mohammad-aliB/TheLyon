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
   // testB=new Date();
    //testB=testB..setTime(testB.getTime() +  (1 * 24 * 60 * 60 * 1000));
   //console.log(testB)
    schoolDay.findOne( {"date": test},function(error,result){
        if(!result){
            result=[];
        }
    res.end(dots.index({"currentDate":test,"day":result["day"]})); 


        
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
function scrapeSchoolDays(){
    var url = 'http://graph.facebook.com/517267866/?fields=picture';

    http.get(url, function(res){
        var body = '';

        res.on('data', function(chunk){
            body += chunk;
        });

        res.on('end', function(){
            var response = JSON.parse(body);
            for (x in response[0]["items"]){
                if(response[0]["items"]["summary"]=="DAY 1"){
                schoolDay.update({"date":new Date(response[0]["items"]["start"]["date"])},{$set:{"day":1}},{upsert:true},function(err, result) {});
                
                }else if(response[0]["items"]["summery"]=="DAY 2"){
                schoolDay.update({"date":new Date(response[0]["items"]["start"]["date"])},{$set:{"day":2}},{upsert:true},function(err, result) {});
                }
            }
            console.log("Got a response: ", response);
        });
    }).on('error', function(e){
          console.log("Got an error: ", e);
    });
}
scrapeSchoolDays();