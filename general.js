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
var url = require('url')
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
        if(test.getMonth()==0){month="January"}else if(test.getMonth()==1){month="Febuary"}else if(test.getMonth()==2){month="March"}else if(test.getMonth()==3){month="April"}else if(test.getMonth()==4){month="May"}else if(test.getMonth()==5){month="June"}else if(test.getMonth()==6){month="July"}else if(test.getMonth()==7){month="Augest"}else if(test.getMonth()==8){month="September"}else if(test.getMonth()==9){month="October"}else if(test.getMonth()==10){month="November"}else{month="December"}
        var calendarURL="/Calendar/"+test.getFullYear()+"/"+month;
        calendar.find({"published":"true","date":{$gte:new Date()}}).limit(7).sort({date: 1}).toArray(function(err, events) {
            if(!err){
                res.end(dots.index({"currentDate":test,"day":result["day"],"calendarURL":calendarURL,"calendarEvents":events})); 
            }
        });
    });
});
dispatcher.GetRequest('/Login',function(req,res){
    test=new Date(calcTime(-4));
   // testB=new Date();
    //testB=testB..setTime(testB.getTime() +  (1 * 24 * 60 * 60 * 1000));
   //console.log(testB)
    res.end(dots.login({})); 
});
dispatcher.PostRequest('/Login',function(req,res){
    if(req.postData["email"]==loginEmail&&req.postData["password"]==loginPassword){
        crypto.randomBytes(48, function(err, buffer) {
            sessionToken = buffer.toString('hex');
            res.writeHead(302, {
                'Location': '/Admin',
                'Set-Cookie': 'sessionToken='+sessionToken+'; Expires=Tue, 19 Jan 2038 03:14:07 UTC; HttpOnly;'
            });
            res.end();
        });
    }else{
        res.end("wrong credentials")
    }
});
dispatcher.GetRequest('/Logout',function(req,res){
    sessionToken=0;
                res.writeHead(200, {
                'Set-Cookie': 'sessionToken=null; Expires=Tue, 19 Jan 2000 03:14:07 UTC; HttpOnly;'
            });
    res.end("logged out");
});
dispatcher.GetRequest('/Admin',function(req,res){
    if(sessionToken==0){
        res.end("<html><body>pls <a href=\"/Login\">LOGIN</a></body></html>");
    }else{
        var cookies = cookie.parse(req.headers.cookie || '');
        if(cookies.sessionToken==sessionToken){
            res.end(dots.admin({}));
        }
    }
});
dispatcher.GetRequest('/Admin/Calendar',function(req,res){
    if(sessionToken==0){
        res.end("<html><body>pls <a href=\"/Login\">LOGIN</a></body></html>");
    }else{
        var cookies = cookie.parse(req.headers.cookie || '');
        if(cookies.sessionToken==sessionToken){
            calendar.find({}).toArray(function(err, events) {
                if(!err){
                    //console.log(events);
                    //events=[];
                    // for (var i = 0; i < eventResults.length; i++) {
                    //     events.push(tagResult[i].tagID);
                    // }
                    res.end(dots.calendar({"events":events}));
                }
            });
        }
    }
});
dispatcher.PostRequest('/Admin/Calendar/Update', function(req,res){
    if(sessionToken==0){
        res.end("<html><body>pls <a href=\"/Login\">LOGIN</a></body></html>");
    }else{
        var cookies = cookie.parse(req.headers.cookie || '');
        if(cookies.sessionToken==sessionToken){
            if(req.postData["CSRF"]=="asdfghjklkjhgfdsasdfghjkjhgfdfghgfdfg1232"){
                if(req.postData["id"]!="new-event"){
                    calendar.update({"id":req.postData["id"]},{$set:{"date":new Date(req.postData["date"]),"name":req.postData["name"],"description":req.postData["description"],"published":req.postData["published"]}},{upsert:false},function(err, result) {
                        if(!err){
                            res.end("successful");
                        }
                    });
                }else{
                    crypto.randomBytes(48, function(err, buffer) {
                        id = buffer.toString('hex');
                        calendar.update({"id":req.postData["id"]},{$set:{"id":id,"date":new Date(req.postData["date"]),"name":req.postData["name"],"description":req.postData["description"],"published":req.postData["published"]}},{upsert:true},function(err, result) {
                            if(!err){
                              res.end("successful");
                            }
                        });
                    });
                }
            }
        }
    }

});
dispatcher.GetRequest('/Calendar/*/*',function(req,res){
    year=0;
    month=0;
    if(req.url.includes("2017")){
        year=2017;
    }else if(req.url.includes("2018")){
        year=2018;
    }else if(req.url.includes("2019")){
        year=2019;
    }else if(req.url.includes("2020")){
        year=2020;
    }
    if(year !=0){
        if(req.url.includes("January")){
            monthName="January"
            month=1;
            if(year>2017){
                lastMonth="/"+(year-1)+"/December";
            }
            nextMonth="/"+year+"/Febuary";
            minimum=new Date(year+" January")//greater than or equal to this 
            maximum=new Date(year+" Febuary")//less than this        
        }else if(req.url.includes("Febuary")){
            monthName="Febuary"
            month=2;
            lastMonth="/"+year+"/January";
            nextMonth="/"+year+"/March";
            minimum=new Date(year+" Febuary")//greater than or equal to this 
            maximum=new Date(year+" March")//less than this
        }else if(req.url.includes("March")){
            monthName="March"
            month=3;
            lastMonth="/"+year+"/Febuary";
            nextMonth="/"+year+"/April";
            minimum=new Date(year+" March")//greater than or equal to this 
            maximum=new Date(year+" April")//less than this
        }else if(req.url.includes("April")){
            monthName="April"
            month=4;
            lastMonth="/"+year+"/March";
            nextMonth="/"+year+"/May";
            minimum=new Date(year+" April")//greater than or equal to this 
            maximum=new Date(year+" May")//less than this
        }else if(req.url.includes("May")){
            monthName="May"
            month=5;
            lastMonth="/"+year+"/April";    
            nextMonth="/"+year+"/June";
            minimum=new Date(year+" May")//greater than or equal to this 
            maximum=new Date(year+" June")//less than this
        }else if(req.url.includes("June")){
            monthName="June"
            month=6;
            lastMonth="/"+year+"/May";
            nextMonth="/"+year+"/July";
            minimum=new Date(year+" June")//greater than or equal to this 
            maximum=new Date(year+" July")//less than this
        }else if(req.url.includes("July")){
            monthName="July"
            month=7;
            lastMonth="/"+year+"/June";
            nextMonth="/"+year+"/Augest";
            minimum=new Date(year+" July")//greater than or equal to this 
            maximum=new Date(year+" Augest")//less than this
        }else if(req.url.includes("Augest")){
            monthName="Augest"
            month=8;
            lastMonth="/"+year+"/July";
            nextMonth="/"+year+"/September";
            minimum=new Date(year+" Augest")//greater than or equal to this 
            maximum=new Date(year+" September")//less than this
        }else if(req.url.includes("September")){
            monthName="September"
            month=9;
            lastMonth="/"+year+"/Augest";
            nextMonth="/"+year+"/October";
            minimum=new Date(year+" September")//greater than or equal to this 
            maximum=new Date(year+" October")//less than this
        }else if(req.url.includes("October")){
            monthName="October"
            month=10;
            lastMonth="/"+year+"/September";
            nextMonth="/"+year+"/November";
            minimum=new Date(year+" October")//greater than or equal to this 
            maximum=new Date(year+" November")//less than this
        }else if(req.url.includes("November")){
            monthName="November"
            month=11;
            lastMonth="/"+year+"/October";
            nextMonth="/"+year+"/December";
            minimum=new Date(year+" November")//greater than or equal to this 
            maximum=new Date(year+" December")//less than this
        }else if(req.url.includes("December")){
            monthName="December"
            month=12;
            lastMonth="/"+year+"/November";
            nextMonth="/"+(year+1)+"/January";
            minimum=new Date(year+" December")//greater than or equal to this 
            maximum=new Date((year+1)+" January")//less than this
        }
    }else{
        res.end("error");
    }
    if(month !=0){//a year must exist for a month to so essentially checking for both here
        var firstDay = new Date(year + "-" + month + "-01").getDay()//0  is sunday and 6 is saturday
        var numberOfDays = new Date(year,(month), 0).getDate();
       var query = url.parse(req.url,true).query;

        calendar.find({"published":"true","date":{$gte:minimum, $lt:maximum}}).sort({date: 1}).toArray(function(err, events) {
            if(!err){
                    if(query["ID"]&&query["ID"]==query["ID"].replace(/[^a-zA-Z0-9]/g,"")){
                        idToOpen="openPopup('"+query["ID"]+"');";
                    }else{
                        idToOpen="";
                    }
                    res.end(dots.userFacingCalendar({"idToOpen":idToOpen,"year":year,"lastMonth":lastMonth,"nextMonth":nextMonth,"firstDay":firstDay,"events":events,"numberOfDays":numberOfDays,"monthName":monthName}));

            }
                        //console.log(events);
                        //events=[];
                        // for (var i = 0; i < eventResults.length; i++) {
                        //     events.push(tagResult[i].tagID);
                        // }
       });             
    }else{
        res.end("error");
    }
});
    //console.log(test)
// schoolDay.update({"date":new Date("2017-9-28")},{$set:{"day":2}},{upsert:true},function(err, result) {});
// });
//                                  //   var document = {"a":"b"};//include exiration later
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
                    // console.log("day 1")
                }else if(response["items"][x]["summary"]=="DAY 2"){
                schoolDay.update({"date":new Date(response["items"][x]["start"]["date"])},{$set:{"day":2}},{upsert:true},function(err, result) {});
                    // console.log("day 2")
                }
            }
        });
    }).on('error', function(e){
          console.log("Got an error: ", e);
    });
}
// scrapeSchoolDays();