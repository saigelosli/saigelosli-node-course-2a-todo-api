//const MongoClient = require( "mongodb" ).MongoClient;
//const { MongoClient } = require( "mongodb" );
const { MongoClient, ObjectID } = require( "mongodb" );



MongoClient.connect( "mongodb://localhost:27017/TodoApp", ( error, db ) => {
  if ( error ) {
    return console.log( "Unable to connect to MongoDB server" );
  }
  console.log( "Connected to MongoDB server" );

  // db.collection( "Todos" ).find( {
  //   _id: new ObjectID( "5c672196b91957fdc5fa7a46" )
  // } ).toArray().then( ( docs ) => {
  //   console.log( "Todos" );
  //   console.log( JSON.stringify( docs, undefined, 2 ) );
  // }, ( error ) => {
  //   console.log( "Unable to fetch Todos:", error );
  // } );

  // db.collection( "Todos" ).find().count().then( ( count ) => {
  //   console.log( `Todos count: ${count}` );
  //   console.log( JSON.stringify( docs, undefined, 2 ) );
  // }, ( error ) => {
  //   console.log( "Unable to fetch Todos:", error );
  // } );

  db.collection( "Users" ).find( { name: "Saige" } ).toArray().then( ( docs ) => {
    console.log( "Documents:" );
    console.log( docs );
  }, ( error ) => {
    console.log( "Unable to fetch Users" );
  } );

  // db.close();
} );
