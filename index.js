//Initialize instance
var sequelize = require("sequelize");
 
//Connect to database
var connection = new sequelize('stock_forecast', 'root', 'password',{} );
 
// Define models
var sites = connection.define("sites", {
    url: sequelize.TEXT,
    title: sequelize.STRING
});
 
// ----
 
//Initialize instance
var request = require("request");
var cheerio = require("cheerio");
 
// ----
 
// Define request url
var requestUrl = "http://www.google.com";
 
// Send http request
request({url: requestUrl}, function(error, response, body) {
 
    // If request succeed
    if (!error && response.statusCode == 200) {
        $ = cheerio.load(body); // Create cheerio instance
 
        // Get response data
        var url = response.request.href;
        var title = $("title").text();
 
        console.log(url);
        console.log(title);
 
        // Create new instance
        var site = sites.build();
 
        // Set fields
        site.url = url;
        site.title = title;
 
        // Save to database
        site.save();
    }
 
    // If error occured
    else {
        console.log("--------------------------------------------------");
        if (error && "code" in error) {
            console.log("Error Code:" + error.code);
        }
        if (error && "errno" in error) {
            console.log("Error No:" + error.errno);
        }
        if (error && "syscall" in error) {
            console.log("Error Syscall:" + error.syscall);
        }
        if (response && "statusCode" in response) {
            console.log("Status Code:" +  response.statusCode);
        }
    }
});
