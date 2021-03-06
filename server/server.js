require( "./config/config.js" );

const express = require( "express" );
const bodyParser = require( "body-parser" );
const { ObjectID } = require( "mongodb" );
const _ = require( "lodash" );
const bcrypt = require( "bcryptjs" );

const { mongoose } = require( "./db/mongoose.js" );
const { Todo } = require( "./models/todo.js" );
const { User } = require( "./models/user.js" );
const { authenticate } = require( "./middleware/authenticate.js" );

const app = express();

app.use( bodyParser.json() );

app.post( "/todos", authenticate, ( request, response ) => {
  var todo = new Todo({
    text: request.body.text,
    _creator: request.user._id,
  });

  todo.save().then( ( document ) => {
    response.send( document );
  }, ( error ) => {
    response.status( 400 ).send( error );
  } );
} );

app.get( "/todos", authenticate, ( request, response ) => {
  Todo.find( {
    _creator: request.user._id
  } ).then( ( todos ) => {
    response.send( { todos } )
  }, ( error ) => {
    response.status( 400 ).send( error );
  } );
} );

app.get( "/todos/:id", authenticate, ( request, response ) => {
  let id = request.params.id;

  // Validate id using isValid
  if ( !ObjectID.isValid( id ) ) {
    // stop execution and respond with status 404, send empty body
    return response.status( 404 ).send();
  }

  //  findById
  Todo.findOne( {
    _id: id,
    _creator: request.user._id
  } ).then( ( todo ) => {
    // success, but no todo
    // send status 404 with empty body
    if ( !todo ) {
      return response.status( 404 ).send();
    }

    // if todo, send it back
    response.send( { todo } );

  } ).catch( ( error ) => {
    // error - status 400, send empty body
    response.status( 400 ).send();
  } );
} );

// TODO: Convert to async/await
// app.delete( "/todos/:id", authenticate, ( request, response ) => {
//   let id = request.params.id;
//
//   // Validate the id, else 404
//   if ( !ObjectID.isValid( id ) ) {
//     return response.status( 404 ).send();
//   }
//
//   // Remove todo by id
//   Todo.findOneAndRemove( {
//     _id: id,
//     _creator: request.user._id
//   } ).then( ( todo ) => {
//
//     // success
//     if ( !todo ) {
//       // If no doc, sent 404 with empty body
//       return response.status( 404 ).send();
//     }
//
//     // If doc, send todo with body
//     response.send( { todo } );
//
//   } ).catch( ( error ) => {
//     // error - return 400 with empty body
//     response.status( 400 ).send();
//   } );
// } );

app.delete( "/todos/:id", authenticate, async ( request, response ) => {
  const id = request.params.id;

  // Validate the id, else 404
  if ( !ObjectID.isValid( id ) ) {
    return response.status( 404 ).send();
  }

  try {
    const todo = await Todo.findOneAndRemove( { _id: id, _creator: request.user._id } );
    if ( !todo ) {
      return response.status( 404 ).send();
    }
    response.send( { todo } );
  } catch ( error ) {
    response.status( 400 ).send();
  }
} );

app.patch( "/todos/:id", authenticate, ( request, response ) => {
  let id = request.params.id;

  // This restricts the things that can be updated to only "text" and "completed"
  let body = _.pick( request.body, ['text','completed'] );

  if ( !ObjectID.isValid( id ) ) {
    return response.status( 404 ).send();
  }

  if ( _.isBoolean( body.completed ) && body.completed ) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate( {
    _id: id,
    _creator: request.user._id
  }, { $set: body }, { new: true } ).then( ( todo ) => {
    if ( !todo ) {
      return response.status( 404 ).send();
    }
    response.send( { todo } );
  } ).catch( ( error ) => {
    response.status( 400 ).send();
  } );
} );

// TODO: Convert to async/await
// app.post( "/users", ( request, response ) => {
//   let user = new User( _.pick( request.body, [ 'email', 'password' ] ) );
//
//   user.save().then( () => {
//     return user.generateAuthToken();
//   } ).then( ( token ) => {
//     response.header( "x-auth", token ).send( user );
//   } ).catch( ( error ) => {
//     response.status( 400 ).send( error );
//   } );
// } );

app.post( "/users", async ( request, response ) => {
  try {
    let user = new User( _.pick( request.body, [ 'email', 'password' ] ) );
    await user.save();
    const token = await user.generateAuthToken();
    response.header( "x-auth", token ).send( user );
  } catch ( error ) {
    response.status( 400 ).send( error );
  }
} );

app.get( "/users/me", authenticate, ( request, response ) => {
  response.send( request.user );
} );

// app.post( "/users/login", ( request, response ) => {
//   let body = new User( _.pick( request.body, [ 'email', 'password' ] ) );
//
//   User.findByCredentials( body.email, body.password ).then( ( user ) => {
//     return user.generateAuthToken().then( ( token ) => {
//       response.header( "x-auth", token ).send( user );
//     } );
//   } ).catch( ( error ) => {
//     response.status( 400 ).send();
//   } );
// } );

app.post( "/users/login", async ( request, response ) => {
  try {
    const body = new User( _.pick( request.body, [ 'email', 'password' ] ) );
    const user = await User.findByCredentials( body.email, body.password );
    const token = await user.generateAuthToken();
    response.header( "x-auth", token ).send( user );
  } catch ( e ) {
    response.status( 400 ).send();
  }
} );

// app.delete( "/users/me/token", authenticate, ( request, response ) => {
//   request.user.removeToken( request.token ).then( () => {
//     response.status( 200 ).send();
//   }, () => {
//     response.status( 400 ).send();
//   } );
// } );

app.delete( "/users/me/token", authenticate, async ( request, response ) => {
  try {
    await request.user.removeToken( request.token );
    response.status( 200 ).send();
  } catch ( e ) {
    response.status( 400 ).send();
  }
} );

app.listen( process.env.PORT, () => {
  console.log( `Started on port ${process.env.PORT}` );
} );

module.exports = { app };
