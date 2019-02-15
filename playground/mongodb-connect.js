//const MongoClient = require( "mongodb" ).MongoClient;
//const { MongoClient } = require( "mongodb" );
const { MongoClient, ObjectID } = require( "mongodb" );



MongoClient.connect( "mongodb://localhost:27017/TodoApp", ( error, db ) => {
  if ( error ) {
    return console.log( "Unable to connect to MongoDB server" );
  }
  console.log( "Connected to MongoDB server" );

  // db.collection( "Todos" ).insertOne( {
  //   text: "Something to do",
  //   completed: false,
  // }, ( error, result ) => {
  //   if ( error ) {
  //     return console.log( "Unable to insert todo." );
  //   }
  //
  //   console.log( JSON.stringify( result.ops, undefined, 2 ) );
  // } );

  // db.collection( "Users" ).insertOne( {
  //   name: "Saige",
  //   age: 55,
  //   location: "Beaverton"
  // }, ( error, result ) => {
  //   if ( error ) {
  //     return console.log( "Unable to insert User" );
  //   }
  //
  //   console.log( JSON.stringify( result.ops[0]._id.getTimestamp(), undefined, 2 ) );
  // } );

  db.close();
} );
