const mongoose = require( "mongoose" );
const validator = require( "validator" );
const jwt = require( "jsonwebtoken" );
const _ = require( "lodash" );

const UserSchema = mongoose.Schema({
  email: {
    required: true,
    trim: true,
    type: String,
    minLength: 1,
    unique: true,
    validate: {
//      validator: ( value ) => {
//        return validator.isEmail( value );
//      },
      // this functions same as above:
      validator: validator.isEmail,
      message: "{VALUE} is not a valid email"
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    }
  }]
});

UserSchema.methods.toJSON = function() {
  let user = this;
  var userObject = this.toObject();

  return _.pick( userObject, [ '_id', 'email' ] );
};

UserSchema.methods.generateAuthToken = function() {
  let user = this;
  let access = "auth";
  let token = jwt.sign( { _id: user._id.toHexString(), access }, "abc123" ).toString();

  user.tokens = user.tokens.concat( [ { access, token } ] );
  return user.save().then( () => {
    return token;
  });
};

const User = mongoose.model( "User", UserSchema );

module.exports = { User };
