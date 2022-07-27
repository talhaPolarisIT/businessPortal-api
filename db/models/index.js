'use strict';
var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(__filename);
require('dotenv').config();
var db = {};
var sequelize;
var _a = process.env, DB_USERNAME = _a.DB_USERNAME, DB_PASSWORD = _a.DB_PASSWORD, DB_NAME = _a.DB_NAME, DB_HOST = _a.DB_HOST, DB_DIALECT = _a.DB_DIALECT;
sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, { dialect: DB_DIALECT, host: DB_HOST, logging: false });
fs
    .readdirSync(__dirname)
    .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
})
    .forEach(function (file) {
    var model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
});
Object.keys(db).forEach(function (modelName) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
