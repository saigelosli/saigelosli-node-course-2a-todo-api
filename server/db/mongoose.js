const mongoose = require( "mongoose" );

// Use the ES6 promises as opposed to a third-party promise library
mongoose.Promise = global.Promise;
// The basic connection info to initialize the library
mongoose.connect( process.env.MONGODB_URI );

module.exports = { mongoose };
