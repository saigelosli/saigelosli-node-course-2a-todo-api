const express = require( "express" );
const bodyParser = require( "body-parser" );

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

app.listen( 3000, () => {
  console.log( "Started on port 3000" );
} );
