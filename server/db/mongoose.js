const mongoose = require( "mongoose" );

// Use the ES6 promises as opposed to a third-party promise library
mongoose.Promise = global.Promise;
// The basic connection info to initialize the library
mongoose.connect( proceess.env.MONGODB_URI || "mongodb://localhost:27017/TodoApp" );

module.exports = { mongoose };
