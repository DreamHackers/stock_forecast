//Initialize instance
var Sequelize = require("sequelize");

//Connect to database
var connection = new Sequelize('stock_forecast', 'root', 'password',{} );

// Define models
var users = connection.define('users', {
    user_id: { type: Sequelize.STRING(4), allowNull: false}
});

// ----

//Initialize instance
var request = require("request");
var cheerio = require("cheerio");
var ulParser = require('./ul_parser.js');

// ----

// Define request url
var requestUrl = "http://info.finance.yahoo.co.jp/kabuyoso/specialist/disp_no/?p=2";

// Send http request
request({url: requestUrl}, function(error, response, body) {

    // If request succeed
    if (!error && response.statusCode == 200) {
        $ = cheerio.load(body); // Create cheerio instance

        ulParser($);

        var data = $().parseul();

        for (d of data) {
          users.findOrCreate({where: {user_id: d}});


          // // Create new instance
          // var user = users.build();
          //
          // // Set fields
          // user.user_id = d;
          //
          // // Save to database
          // user.save();
        }

        // console.log(data);

        // Get response data
        var url = response.request.href;
        var title = $("title").text();

        console.log(url);
        console.log(title);

        // Create new instance
        var user = users.build();


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
