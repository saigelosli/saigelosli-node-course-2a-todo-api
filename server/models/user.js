const mongoose = require( "mongoose" );

const User = mongoose.model( "User", {
  email: {
    required: true,
    trim: true,
    type: String,
    minLength: 1,
  }
} );

module.exports = { User };
