const expect = require( "expect" );
const request = require( "supertest" );

const { app } = require( "./../server.js" );
const { Todo } = require( "./../models/todo.js" );

beforeEach( ( done ) => {
  Todo.remove({}).then( () => done() );
} );

describe( "POST /todos", () => {

  it( "Should create a new todo", ( done ) => {
    var text = "Test todo text";

    request( app )
      .post( "/todos" )
      .send({ text })
      .expect( 200 )
      .expect( ( response ) => {
        expect( response.body.text ).toBe( text );
      } )
      .end( ( error, response ) => {
        if ( error ) {
          // Return to stop execution... After all, we encountered an error.
          return done( error );
        }

        Todo.find().then( (todos) => {
          expect( todos.length ).toBe( 1 );
          expect( todos[0].text ).toBe( text );
          done();
        } ).catch( ( error ) => done( error ) );
    } );
  } );

  it( "Should not create Todo with invalid body data", ( done ) => {

    request( app )
      .post( "/todos" )
      .send( { text: "" } )
      .expect( 400 )
      .end( ( error, response ) => {
        if ( error ) {
          // Return to stop execution... After all, we encountered an error.
          return done( error );
        }

        Todo.find().then( ( todos ) => {
          expect( todos.length ).toBe( 0 );
          done();
        } ).catch( ( error ) => done( error ) );
    } );
  } );
  
} );
