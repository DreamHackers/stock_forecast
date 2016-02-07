//Initialize instance
var sequelize = require("sequelize");

//Connect to database
var connection = new sequelize('stock_forecast', 'root', 'password',{} );

// Define models
var sites = connection.define('sites', {
    url: sequelize.TEXT,
    title: sequelize.STRING
});

// Synchronize to database
connection.sync({force: true});
