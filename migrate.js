//Initialize instance
var Sequelize = require("sequelize");

//Connect to database
var connection = new Sequelize('stock_forecast', 'root', 'password',{} );

// Define models
var users = connection.define('users', {
    user_id: {
      type: Sequelize.STRING(4),
      allowNull: false,
    }
  },
  {
    indexes: [
      // Create a unique index on email
      {
        unique: true,
        fields: ['user_id']
      }
    ]
  });

var stocks = connection.define('stocks', {
    stock_code: { type: Sequelize.STRING(4), allowNull: false}
});

var forecasts = connection.define('forecasts', {
    user_id: {
      type: Sequelize.STRING(4),
      allowNull: false
      // references: {
      // // This is a reference to another model
      // model: users,
      //
      // // This is the column name of the referenced model
      // key: 'user_id',
      //
      // // This declares when to check the foreign key constraint. PostgreSQL only.
      // deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
      // }
    },
    win: { type: Sequelize.INTEGER }, // 1:勝ち、0:負け、9:予想中
    start_date: { type: Sequelize.DATE },
    position: { type: Sequelize.BOOLEAN }, // 1:買い、2:売り
    span: { type: Sequelize.INTEGER }, // 1:1日、7:１週、30:１ヶ月
    stock_code: {
      type: Sequelize.STRING(4),
      allowNull: false
      // references: {
      //   model: stocks,
      //   key: 'stock_code',
      //   deferrable: Sequelize.Deferrable.INITIALLY_DEFERRED
      // }
    },
    start_price: { type: Sequelize.INTEGER },
    end_price: { type: Sequelize.INTEGER },
    highest_price: { type: Sequelize.INTEGER },
    lowest_price: { type: Sequelize.INTEGER }
});

// Synchronize to database
connection.sync({force: true});
