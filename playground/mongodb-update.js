//const MongoClient = require( "mongodb" ).MongoClient;
//const { MongoClient } = require( "mongodb" );
const { MongoClient, ObjectID } = require( "mongodb" );



MongoClient.connect( "mongodb://localhost:27017/TodoApp", ( error, db ) => {
  if ( error ) {
    return console.log( "Unable to connect to MongoDB server" );
  }
  console.log( "Connected to MongoDB server" );

  db.collection( "Users" ).findOneAndUpdate( {
    _id: new ObjectID( "5c671c214c89c41eecac66e0" )
  }, {
    $set: {
      name: "Saige"
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  } ).then( ( result ) => {
    console.log( result );
  } );

  // db.close();
} );
