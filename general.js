var dispatcher=require("/TheLyon/Dispatcher/index.js") ;
var dot = require('dot');
var dots = dot.process({path: "/TheLyon/TheLyon/"});
var httpsModule=require('https');
dispatcher.setUP(80,'0.0.0.0');
var mongodb = require('mongodb');
var loginEmail="mohammad-ali@bandzar.com"
var loginPassword="asdfewasds123231232e123"
var sessionToken=0;
var cookie = require('cookie');
const crypto = require('crypto');
mongodb.MongoClient.connect("mongodb://192.168.206.78:27017/TheLyon", function(err, db) {
    if(err) throw err;
    calendar=db.collection("calendar")
    schoolDay=db.collection("schoolDay")
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
// dispatcher.GetRequest('/Login',function(req,res){
//     test=new Date(calcTime(-4));
//    // testB=new Date();
//     //testB=testB..setTime(testB.getTime() +  (1 * 24 * 60 * 60 * 1000));
//    //console.log(testB)
//     res.end(dots.Login({})); 
// });
// dispatcher.PostRequest('/Login',function(req,res){
//     if(req.postData["email"]==loginEmail&&req.postData["password"]==loginPassword){
//         crypto.randomBytes(48, function(err, buffer) {
//             sessionToken = buffer.toString('hex');
//             res.writeHead(302, {
//                 'Location': '/Admin',
//                 'Set-Cookie': 'sessionToken='+sessionToken+'; Expires=Tue, 19 Jan 2038 03:14:07 UTC; HttpOnly;'
//             });
//             res.end();
//         });
//     }else{
//         res.end("wrong credentials")
//     }
// });
// dispatcher.GetRequest('/Logout',function(req,res){
//     sessionToken=0;
// });
// dispatcher.GetRequest('/Admin',function(req,res){
//     if(sessionToken==0){
//         res.end("pls login");
//     }else{
//         var cookies = cookie.parse(req.headers.cookie || '');
//         if(cookies.sessionToken==sessionToken){
//             res.end("logged in me boi");
//         }
//     }
// });

//     //console.log(test)
// // schoolDay.update({"date":new Date("2017-9-28")},{$set:{"day":2}},{upsert:true},function(err, result) {});
// // });
// //                                  //   var document = {"a":"b"};//include exiration later
//                            //       aschoolDay.insert(document, function(err, records) {
//                             //            if (err) throw err;             
//                             //            });
// function calcTime( offset) {
//     // create Date object for current location
//     var d = new Date();
//     // convert to msec
//     // add local time zone offset
//     // get UTC time in msec
//     var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
//     // create new Date object for different city
//     // using supplied offset
//     var nd = new Date(utc + (3600000*offset));
//     // return time as a string
//     return nd.toISOString().split('T')[0];
// }
// function scrapeSchoolDays(){
//     var url = 'https://clients6.google.com/calendar/v3/calendars/wlmacci@gmail.com/events?calendarId=wlmacci%40gmail.com&singleEvents=true&timeZone=America%2FToronto&maxAttendees=1&maxResults=1000&sanitizeHtml=true&timeMin=2017-08-27T00%3A00%3A00-04%3A00&timeMax=2018-12-10T00%3A00%3A00-04%3A00&key=AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs';

//     httpsModule.get(url, function(res){
//         var body = '';
//         res.on('data', function(chunk){
//             body += chunk;
//         });
//         res.on('end', function(){
//             var response = JSON.parse(body);
//            // console.log("Got a response: ", response);
//             for (x in response["items"]){
//                 if(response["items"][x]["summary"]=="DAY 1"){
//                 schoolDay.update({"date":new Date(response["items"][x]["start"]["date"])},{$set:{"day":1}},{upsert:true},function(err, result) {});
//                     // console.log("day 1")
//                 }else if(response["items"][x]["summary"]=="DAY 2"){
//                 schoolDay.update({"date":new Date(response["items"][x]["start"]["date"])},{$set:{"day":2}},{upsert:true},function(err, result) {});
//                     // console.log("day 2")
//                 }
//             }
//         });
//     }).on('error', function(e){
//           console.log("Got an error: ", e);
//     });
// }
// scrapeSchoolDays();