const express = require( "express" );
const bodyParser = require( "body-parser" );
const { ObjectID } = require( "mongodb" );

const { mongoose } = require( "./db/mongoose.js" );
const { Todo } = require( "./models/todo.js" );
const { User } = require( "./models/user.js" );

const app = express();

app.use( bodyParser.json() );

app.post( "/todos", ( request, response ) => {
  var todo = new Todo({
    text: request.body.text
  });

  todo.save().then( ( document ) => {
    response.send( document );
  }, ( error ) => {
    response.status( 400 ).send( error );
  } );
} );

app.get( "/todos", ( request, response ) => {
  Todo.find().then( ( todos ) => {
    response.send( { todos } )
  }, ( error ) => {
    response.status( 400 ).send( error );
  } );
} );

app.get( "/todos/:id", ( request, response ) => {
  let id = request.params.id;

  // Validate id using isValid
  if ( !ObjectID.isValid( id ) ) {
    // stop execution and respond with status 404, send empty body
    return response.status( 404 ).send();
  }

  //  findById
  Todo.findById( id ).then( ( todo ) => {
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

app.listen( 3000, () => {
  console.log( "Started on port 3000" );
} );

module.exports = { app };
