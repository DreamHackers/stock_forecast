module.exports = function(user_id, forecasts, new_scan) {

//Initialize instance
var request = require("request");
var cheerio = require("cheerio");
var cheerioTableparser = require('./parser.js');
var sleep = require('sleep');

for (var page = 1; page <= 34; page++) {

// Define request url
var requestUrl = "http://info.finance.yahoo.co.jp/kabuyoso/specialist/result/" + user_id + "?p=" + page;

console.log("requestUrl " + requestUrl);

// Send http request
request(requestUrl, function(error, response, body) {

// If request succeed
if (!error && response.statusCode == 200) {
  $ = cheerio.load(body); // Create cheerio instance

  cheerioTableparser($);
  var data = $('table').parsetable(true, true, true);

  var columnCount = data.length;
  if (columnCount == 0) {
    return;
  }

  var rowCount = data[0].length;

  data.map((item) => {
    if(item[0] == "勝敗"){
      // ヘッダー
      return;
    }

    var win = item[0] == "勝ち" ? 1 : item[0] == "負け" ? 0 : item[0] == "引分" ? 5 : 9
    var start_date = item[1].replace(/(年|月)/g,"/").replace("日","");
    var position = item[2] == "買い" ? 1 : 0;
    var span = item[3] == "1日" ? 1 : item[3] == "1週" ? 7 : 30;
    var stock_code = item[4];
    var start_price = win == 9 ? -1 : item[5].replace(",","");
    var end_price = win == 9 ? -1 : item[6].replace(",","");
    var highest_price = win == 9 ? -1 : item[7].replace(",","");
    var lowest_price = win == 9 ? -1 : item[8].replace(",","");

    forecasts.findOrCreate({where: {user_id: user_id, start_date: start_date, position: position, span: span, stock_code: stock_code}})
    .spread(function(forecast, created) {
      forecast.update({win: win, start_price: start_price, end_price: end_price, highest_price: highest_price, lowest_price: lowest_price});
    });
  });
  console.log("----------------------------------");
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

if (new_scan) {
  break;
}

sleep.sleep(2);
}
}
