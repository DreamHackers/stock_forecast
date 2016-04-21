var update_user_list = require('./user_list.js')
var sleep = require('sleep')

// Initialize instance
var Sequelize = require('sequelize')

// Connect to database
var connection = new Sequelize('stock_forecast', 'root', 'password', {})

// Define models
var users = connection.define('users', {
  user_id: {type: Sequelize.STRING(4), allowNull: false}
})

// Define models
var forecasts = connection.define('forecasts', {
  user_id: {
    type: Sequelize.STRING(4),
    allowNull: false
  },
  win: { type: Sequelize.INTEGER }, // 1:勝ち、0:負け、9:予想中
  start_date: { type: Sequelize.DATE },
  position: { type: Sequelize.BOOLEAN }, // 1:買い、0:売り
  span: { type: Sequelize.INTEGER }, // 1:1日、7:１週、30:１ヶ月
  stock_code: {
    type: Sequelize.STRING(4),
    allowNull: false
  },
  start_price: { type: Sequelize.INTEGER },
  end_price: { type: Sequelize.INTEGER },
  highest_price: { type: Sequelize.INTEGER },
  lowest_price: { type: Sequelize.INTEGER }
})

// cronJob = require('cron').CronJob
//
//   cronTest = new cronJob('*/10 * * * * *', () => {
//     console.log("jikan");
//   })
//
//   cronTest.start()
//

// ------- update user -------

for (var page = 1; page < 100; page++) {
  const result = update_user_list(page, users);

  if (result == 0) {
    break;
  }

  sleep.sleep(2);
}

// ------- update forecast -------
// 不要なリクエストを投げないためには
// 予想中のデータがなければ１ページ目のみ読み込み
// 予想中のデータがあれば最古の予想中データを見つけるまでページを遡る
// => 最低でも全ユーザー分必要？＝106ユーザー

// １か月以上予想をしていないユーザーは日次更新から除外して
// １か月に１回全検査をするときのみ対象とする

var update_forecasts = require('./index.js');

users.findAll().then((all_users) => {
  all_users.map((user)=>{
    var new_scan = true;

    forecasts.findAll({where:
      {and: [{win: 9},
             {user_id: user.id}]
      }
    }).then((fs) => {
      if (fs.length != 0) {
        new_scan = false;
      }
    });

    update_forecasts(user.user_id, forecasts, new_scan);
  });
});
