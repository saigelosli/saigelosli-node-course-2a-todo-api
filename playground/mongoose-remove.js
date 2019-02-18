const { ObjectID } = require( "mongodb" );

const { mongoose } = require( "./../server/db/mongoose.js" );
const { Todo } = require( "./../server/models/todo.js" );
const { User } = require( "./../server/models/user.js" );

// Todo.remove({}).then( ( result ) => {
//   console.log( result );
// } );

// Todo.findOneAndRemove({})
// Todo.findByIdAndRemove()

// Todo.findByIdAndRemove( "5c6a165df5c9e36f23544773" ).then( ( todo ) => {
//   console.log( todo );
// } );
