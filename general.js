var dispatcher=require("/TheLyon/Dispatcher/index.js") ;
var dot = require('dot');
var dots = dot.process({path: "/TheLyon/TheLyon/"});
var httpsModule=require('https');
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
    var url = 'https://clients6.google.com/calendar/v3/calendars/wlmacci@gmail.com/events?calendarId=wlmacci%40gmail.com&singleEvents=true&timeZone=America%2FToronto&maxAttendees=1&maxResults=1000&sanitizeHtml=true&timeMin=2017-08-27T00%3A00%3A00-04%3A00&timeMax=2018-12-10T00%3A00%3A00-04%3A00&key=AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs';

    httpsModule.get(url, function(res){
        var body = '';

        res.on('data', function(chunk){
            body += chunk;
        });

        res.on('end', function(){
            var response = JSON.parse(body);
           // console.log("Got a response: ", response);
            for (x in response["items"]){
                if(response["items"][x]["summary"]=="DAY 1"){
                schoolDay.update({"date":new Date(response["items"][x]["start"]["date"])},{$set:{"day":1}},{upsert:true},function(err, result) {});
                    console.log("day 1")
                }else if(response["items"][x]["summery"]=="DAY 2"){
                schoolDay.update({"date":new Date(response["items"][x]["start"]["date"])},{$set:{"day":2}},{upsert:true},function(err, result) {});
                    console.log("day 2")
                }
            }
        });
    }).on('error', function(e){
          console.log("Got an error: ", e);
    });
}
scrapeSchoolDays();