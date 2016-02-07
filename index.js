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
var cheerioTableparser = require('./parser.js');

// ----

// Define request url
var requestUrl = "http://info.finance.yahoo.co.jp/kabuyoso/specialist/result/5046";

// Send http request
request({url: requestUrl}, function(error, response, body) {

    // If request succeed
    if (!error && response.statusCode == 200) {
        $ = cheerio.load(body); // Create cheerio instance

        cheerioTableparser($);
        var data = $('table').parsetable(true, true, true);

        var columnCount = data.length;
        var rowCount = data[0].length;

        for (var r = 0; r < rowCount; r++) {
          for (var c = 0; c < columnCount; c++) {
            console.log(data[c][r]);
          }
          console.log("----------------------------------");
        }

        // Get response data
        var url = response.request.href;
        var title = $("title").text();
        // var tr0 = null;
        // $('table.yjS')[0].children[1].children[0].each(function(i, tr){
        //   console.log(i);
        //   console.log(tr);
        // });

        // var aho = $('table.yjS')[0].children[1].children[0].next;
        //
        // while(aho.next != null) {
        //   console.log("-----------------------------------------------")
        //   if (aho.name == 'th') {
        //     console.log(aho);
        //   }
        //   aho = aho.next
        // }



        // console.log(tr0.children[0]);

        console.log(url);
        console.log(title);

        // Create new instance
        // var site = sites.build();

        // Set fields
        // site.url = url;
        // site.title = title;

        // Save to database
        // site.save();
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
