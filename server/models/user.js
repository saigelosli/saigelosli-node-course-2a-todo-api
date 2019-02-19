const mongoose = require( "mongoose" );
const validator = require( "validator" );
const jwt = require( "jsonwebtoken" );
const _ = require( "lodash" );
const bcrypt = require( "bcryptjs" );

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

UserSchema.methods.removeToken = function( token ) {
  const user = this;

  return user.update( {
    $pull: {
      tokens: { token },
    }
  } )
};

UserSchema.statics.findByToken = function( token ) {
  const User = this;
  var decoded;

  try {
    decoded = jwt.verify( token, "abc123" );
  } catch( error ) {
    // return new Promise( ( resolve, reject ) => {
    //   reject();
    // } );
    // ... or, reduce the code like this:
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth',
  });
};

UserSchema.statics.findByCredentials = function( email, password ) {
  const User = this;

  return User.findOne( { email } ).then( ( user ) => {
    if ( !user ) {
      return Promise.reject();
    }

    return new Promise( ( resolve, reject ) => {
      // Use bcrypt.compare to compare password and user.password
      bcrypt.compare( password, user.password, ( error, response ) => {
        if ( response ) {
          resolve( user );
        } else {
          reject();
        }
      } );
    } );
  } );
};

UserSchema.pre( "save", function( next ) {
  const user = this;

  if ( user.isModified( "password" ) ) {
    bcrypt.genSalt( 10, ( error, salt ) => {
      bcrypt.hash( user.password, salt, ( error, hash ) => {
        user.password = hash;
        next();
      } );
    } );
  } else {
    next();
  }
} );

const User = mongoose.model( "User", UserSchema );

module.exports = { User };
