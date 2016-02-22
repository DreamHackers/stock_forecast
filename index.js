//Initialize instance
var Sequelize = require("sequelize");

//Connect to database
var connection = new Sequelize('stock_forecast', 'root', 'password',{} );

// Define models
var forecasts = connection.define('forecasts', {
    user_id: {
      type: Sequelize.STRING(4),
      allowNull: false
    },
    win: { type: Sequelize.INTEGER }, // 1:勝ち、0:負け、9:予想中
    start_date: { type: Sequelize.DATE },
    position: { type: Sequelize.BOOLEAN }, // 1:買い、2:売り
    span: { type: Sequelize.INTEGER }, // 1:1日、7:１週、30:１ヶ月
    stock_code: {
      type: Sequelize.STRING(4),
      allowNull: false
    },
    start_price: { type: Sequelize.INTEGER },
    end_price: { type: Sequelize.INTEGER },
    highest_price: { type: Sequelize.INTEGER },
    lowest_price: { type: Sequelize.INTEGER }
});

// ----

//Initialize instance
var request = require("request");
var cheerio = require("cheerio");
var cheerioTableparser = require('./parser.js');

// ----
var user_id = "5046"

// Define request url
var requestUrl = "http://info.finance.yahoo.co.jp/kabuyoso/specialist/result/" + user_id;

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
          if (r == 0) {
            continue;
          }
          for (var c = 0; c < columnCount; c++) {
            console.log(data[c][r]);
          }

          var win = data[0][r] == "勝ち" ? 1 : data[0][r] == "負け" ? 0 : 9
          var start_date = data[1][r].replace(/(年|月)/g,"/").replace("日","");
          var position = data[2][r] == "買い" ? 1 : 0;
          var span = data[3][r] == "1日" ? 1 : data[3][r] == "1週" ? 7 : 30;
          var stock_code = data[4][r];
          var start_price = data[5][r].replace(",","");
          var end_price = data[6][r].replace(",","");
          var highest_price = data[7][r].replace(",","");
          var lowest_price = data[8][r].replace(",","");
          forecasts.findOrCreate({where: {user_id: user_id, start_date: start_date, position: position, span: span, stock_code: stock_code}})
          .then(function(forecast, created) {
            forecast.update({win: win, start_price: start_price, end_price: end_price, highest_price: highest_price, lowest_price: lowest_price});
          });

          console.log("----------------------------------");
        }
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
