const { ObjectID } = require( "mongodb" );

const { mongoose } = require( "./../server/db/mongoose.js" );
const { Todo } = require( "./../server/models/todo.js" );
const { User } = require( "./../server/models/user.js" );

//const id = "5c69d83a448ff5b554bd7224";

// Todo.find( {
//   _id: id
// } ).then( ( todos ) => {
//   console.log( "Todos: ", todos );
// } );
//
// Todo.findOne( {
//   _id: id
// } ).then( ( todo ) => {
//   console.log( "Todo: ", todo );
// } );

// if ( !ObjectID.isValid( id ) ) {
//   console.log( "ID is not valid" );
// }
//
// Todo.findById( id ).then( ( todo ) => {
//   if ( !todo ) {
//     return console.log( "ID not found" );
//   }
//   console.log( "TodoByID: ", todo );
// } ).catch( ( error ) => {
//   console.log( error );
// } );

const id = "5c69ae4b133b0acb3cae7b2e";

// Query users collection
User.findById( id ).then( ( user ) => {
  if ( !user ) {
    return console.log( "User was not found" );
  }
  console.log( "User info: ", JSON.stringify( user, undefined, 2 ) );
}, ( error ) => {
  console.log( "Promise rejected: ", error );
} ).catch( ( error ) => {
  console.log( "Catch: ", error );
} );
