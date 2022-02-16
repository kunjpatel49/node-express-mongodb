const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.trackingDetails = require("./trackingDetails.model.js")(mongoose);
db.file = require("./FileModel.model")(mongoose);

module.exports = db;
