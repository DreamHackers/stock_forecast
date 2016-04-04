module.exports = function(page, users) {

console.log("user_list " + page + " " + users);

//Initialize instance
const request = require("request");
const cheerio = require("cheerio");
const ulParser = require('./ul_parser.js');

var result = 0;

// Define request url
var requestUrl = "http://info.finance.yahoo.co.jp/kabuyoso/specialist/disp_no/?p="+page;

// Send http request
request({url: requestUrl}, function(error, response, body) {

  console.log("request");

    // If request succeed
    if (!error && response.statusCode == 200) {
        $ = cheerio.load(body); // Create cheerio instance

        ulParser($);

        var data = $().parseul();

        for (d of data) {
          var usr = null;

          users.findOne({where: {user_id: d}}).then((u) => {
            usr = u;
          });

          if (usr == null) {
            result++;
          }

          users.findOrCreate({where: {user_id: d}});
        }

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

return result;
}
