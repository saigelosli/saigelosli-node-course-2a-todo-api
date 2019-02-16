//const MongoClient = require( "mongodb" ).MongoClient;
//const { MongoClient } = require( "mongodb" );
const { MongoClient, ObjectID } = require( "mongodb" );



MongoClient.connect( "mongodb://localhost:27017/TodoApp", ( error, db ) => {
  if ( error ) {
    return console.log( "Unable to connect to MongoDB server" );
  }
  console.log( "Connected to MongoDB server" );

  // deleteMany
  // db.collection( "Todos" ).deleteMany( { text: "Eat lunch" } ).then( ( result ) => {
  //     console.log( result );
  // } );

  // deleteOne
  // db.collection( "Todos" ).deleteOne( { text: "Eat lunch" } ).then( ( result ) => {
  //     console.log( result );
  // } );

  // findOneAndDelete
  // db.collection( "Todos" ).findOneAndDelete( { completed: false } ).then( ( result ) => {
  //   console.log( "You deleted: ", result );
  // } );

  // Remove all instances of Saige
  db.collection( "Users" ).deleteMany( { name: "Saige" } ).then( ( result ) => {
    console.log( "Deleting:" );
    console.log( result );
  }, ( error ) => {
    console.log( "An error occurred: ", error );
  } );

  db.collection( "Users" ).findOneAndDelete( { _id: new ObjectID( "5c671aac6e6eb31df9e105ae" ) } ).then( ( result ) => {
    console.log( "Deleting:" );
    console.log( result );
  }, ( error ) => {
    console.log( "An error occurred: ", error );
  } );

  // db.close();
} );
