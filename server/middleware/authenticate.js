const { User } = require( "./../models/user.js" );

const authenticate = ( request, response, next ) => {
  const token = request.header( "x-auth" );

  User.findByToken( token ).then( ( user ) => {
    if ( !user ) {
      // This throws us down to the .catch code below, which responds un-authenticated
      return Promise.reject();
    }

    request.user = user;
    request.token = token;
    next();

  } ).catch( ( error ) => {
    response.status( 401 ).send();
  } );
};

module.exports = { authenticate };
