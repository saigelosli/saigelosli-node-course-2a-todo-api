const expect = require( "expect" );
const request = require( "supertest" );
const { ObjectID } = require( "mongodb" );

const { app } = require( "./../server.js" );
const { Todo } = require( "./../models/todo.js" );
const { User } = require( "./../models/user.js" );
const { todos, populateTodos, users, populateUsers } = require( "./seed/seed.js" );

beforeEach( populateUsers );
beforeEach( populateTodos );

describe( "POST /todos", () => {

  it( "Should create a new todo", ( done ) => {
    var text = "Test todo text";

    request( app )
      .post( "/todos" )
      .set( "x-auth", users[0].tokens[0].token )
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

        Todo.find( { text } ).then( (todos) => {
          expect( todos.length ).toBe( 1 );
          expect( todos[0].text ).toBe( text );
          done();
        } ).catch( ( error ) => done( error ) );
    } );
  } );

  it( "Should not create Todo with invalid body data", ( done ) => {

    request( app )
      .post( "/todos" )
      .set( "x-auth", users[0].tokens[0].token )
      .send( { text: "" } )
      .expect( 400 )
      .end( ( error, response ) => {
        if ( error ) {
          // Return to stop execution... After all, we encountered an error.
          return done( error );
        }

        Todo.find().then( ( todos ) => {
          expect( todos.length ).toBe( 2 );
          done();
        } ).catch( ( error ) => done( error ) );
    } );
  } );

} );

describe( "GET /todos", () => {

  it( "Should get all todos", ( done ) => {
    request( app )
      .get( "/todos" )
      .set( "x-auth", users[0].tokens[0].token )
      .expect( 200 )
      .expect( ( response ) => {
        expect( response.body.todos.length ).toBe( 1 )
      } )
      .end( done );
  } );

} );

describe( "GET /todos/:id", () => {

  it( "Should return todo doc", ( done ) => {
    request( app )
      .get( `/todos/${todos[0]._id.toHexString()}` )
      .set( "x-auth", users[0].tokens[0].token )
      .expect( 200 )
      .expect( ( response ) => {
        expect( response.body.todo.text ).toBe( todos[0].text )
      } )
      .end( done );
  } );

  it( "Should not return a todo doc created by other user", ( done ) => {
    request( app )
      .get( `/todos/${todos[1]._id.toHexString()}` )
      .set( "x-auth", users[0].tokens[0].token )
      .expect( 404 )
      .end( done );
  } );

  it( "Should return 404 if todo not found", ( done ) => {
    // Make sure you get 404 back
    request( app )
      .get( `/todos/${new ObjectID().toHexString()}` )
      .set( "x-auth", users[0].tokens[0].token )
      .expect( 404 )
      .end( done );
  } );

  it( "Should return 404 for non-object ids", ( done ) => {
    // /todos/123 (not valid id)
    request( app )
      .get( "/todos/123" )
      .set( "x-auth", users[0].tokens[0].token )
      .expect( 404 )
      .end( done );
  } );

} );

describe( "DELETE /todos/:id", () => {

  it( "Should remove a todo", ( done ) => {
    let hexId = todos[1]._id.toHexString();
    request( app )
      .delete( `/todos/${hexId}` )
      .set( "x-auth", users[1].tokens[0].token )
      .expect( 200 )
      .expect( ( response ) => {
        expect( response.body.todo._id ).toBe( hexId )
      } )
      .end( ( error, response ) => {
        if ( error ) {
          return done( error );
        }

        Todo.findById( hexId ).then( ( todo ) => {
          expect( todo ).toNotExist();
          done();
        } ).catch( ( error ) => done( error ) );
    } )
  } );

  it( "Should not remove a todo belonging to another user", ( done ) => {
    let hexId = todos[0]._id.toHexString();
    request( app )
      .delete( `/todos/${hexId}` )
      .set( "x-auth", users[1].tokens[0].token )
      .expect( 404 )
      .end( ( error, response ) => {
        if ( error ) {
          return done( error );
        }

        Todo.findById( hexId ).then( ( todo ) => {
          expect( todo ).toExist();
          done();
        } ).catch( ( error ) => done( error ) );
    } )
  } );

  it( "Should return 404 if todo was not found", ( done ) => {
    let hexId = new ObjectID().toHexString();
    request( app )
      .delete( `/todos/${hexId}` )
      .set( "x-auth", users[1].tokens[0].token )
      .expect( 404 )
      .end( done );
  } );

  it( "Should return 404 if ObjectID is invalid", ( done ) => {
    request( app )
      .delete( "/todos/123" )
      .set( "x-auth", users[1].tokens[0].token )
      .expect( 404 )
      .end( done );
  } );

} );

describe( "PATCH /todos/:id", () => {

  it( "Should update the todo", ( done ) => {
    // grab id of first item
    let hexId = todos[0]._id.toHexString();
    let newText = "test suite text";

    // update text, set completed to true
    request( app )
      .patch( `/todos/${hexId}` )
      .set( "x-auth", users[0].tokens[0].token )
      .send( { text: newText, completed: true } )
      .expect( 200 )
      .expect( ( response ) => {
        expect( response.body.todo.text ).toBe( newText );
        expect( response.body.todo.completed ).toBe( true );
        expect( response.body.todo.completedAt ).toBeA( "number" )
      } )
      .end( done );
  } );

  it( "Should not update the todo of another user", ( done ) => {
    // grab id of first item
    let hexId = todos[0]._id.toHexString();
    let newText = "test suite text";

    request( app )
      .patch( `/todos/${hexId}` )
      .set( "x-auth", users[1].tokens[0].token )
      .send( { text: newText, completed: true } )
      .expect( 404 )
      .end( done );
  } );

  it( "Should clear completedAt then todo is not completed", ( done ) => {
    // grab id of second item
    let hexId = todos[1]._id.toHexString();
    let newText = "test suite text";

    // update text, set completed to false
    request( app )
      .patch( `/todos/${hexId}` )
      .set( "x-auth", users[1].tokens[0].token )
      .send( { text: newText, completed: false } )
      .expect( 200 )
      .expect( ( response ) => {
        expect( response.body.todo.text ).toBe( newText );
        expect( response.body.todo.completed ).toBe( false );
        expect( response.body.todo.completedAt ).toNotExist();
      } )
      .end( done );
  } );

} );

describe( "GET /users/me", () => {

  it( "Should return user if authenticated", ( done ) => {
    request( app )
      .get( "/users/me" )
      .set( "x-auth", users[0].tokens[0].token )
      .expect( 200 )
      .expect( ( response ) => {
        expect( response.body._id ).toBe( users[0]._id.toHexString() );
        expect( response.body.email ).toBe( users[0].email );
      } )
      .end( done );
  } );

  it( "Should return 401 if not authenticated", ( done ) => {
//  /users/me
// no x-auth, expect 401, body empty
// .toEqual
    request( app )
      .get( "/users/me" )
      .expect( 401 )
      .expect( ( response ) => {
        expect( response.body ).toEqual( {} );
      } )
      .end( done );
  } );

} );

describe( "POST /users", () => {

  it( "Should create a user", ( done ) => {
    const email = "example@example.com";
    const password = "123mnb!";

    request( app )
      .post( "/users" )
      .send( { email, password } )
      .expect( 200 )
      .expect( ( response ) => {
        expect( response.headers["x-auth"] ).toExist();
        expect( response.body._id ).toExist();
        expect( response.body.email ).toBe( email );
      } )
      .end( ( error ) => {
        if ( error ) {
          return done( error );
        }

        User.findOne( { email } ).then( ( user ) => {
          expect( user ).toExist();
          expect( user.password ).toNotBe( password );
          done();
        } ).catch( ( error ) => done( error ) );
      } );
  } );

  it( "Should return validation errors if request invalid", ( done ) => {
// send invalid email and invalid password
// expect 400
    const email = "example@";
    const password = "1";

    request( app )
      .post( "/users" )
      .send( { email, password } )
      .expect( 400 )
      .end( done );
  } );

  it( "Should not create user if email in use", ( done ) => {
// use email that's already taken (from seed data)
// expect 400
    const email = users[0].email;
    const password = users[0].password;

    request( app )
      .post( "/users" )
      .send( { email, password } )
      .expect( 400 )
      .end( done );
  } );

} );

describe( "POST /users/login", () => {

  it( "Should login user and return auth token", ( done ) => {

    request( app )
      .post( "/users/login" )
      .send( {
        email: users[1].email,
        password: users[1].password,
      } )
      .expect( 200 )
      .expect( ( response ) => {
        expect( response.headers["x-auth"] ).toExist();
      } )
      .end( ( error, response ) => {
        if ( error ) {
          return done( error );
        }

        User.findById( users[1]._id ).then( ( user ) => {
          expect( user.tokens[1] ).toInclude( {
            // Examine user.tokens[1] because there was already an element in there,
            // and the one we added becomes the second element
            access: "auth",
            token: response.headers[ "x-auth" ],
          } );
          done();
        } ).catch( ( error ) => done( error ) );
      } );
  } );

  it( "Should reject invalid login", ( done ) => {

    request( app )
      .post( "/users/login" )
      .send( {
        email: users[1].email,
        password: null,
      } )
      .expect( 400 )
      .expect( ( response ) => {
        expect( response.headers["x-auth"] ).toNotExist();
      } )
      .end( ( error, response ) => {
        if ( error ) {
          return done( error );
        }

        User.findById( users[1]._id ).then( ( user ) => {
          expect( user.tokens.length ).toBe( 1 );
          done();
        } ).catch( ( error ) => done( error ) );
      } );
  } );

} );

describe( "DELETE /users/me/token", () => {

  it( "Should remove auth token on logout", ( done ) => {

    request( app )
      .delete( "/users/me/token" )
      .set( "x-auth", users[0].tokens[0].token )
      .expect( 200 )
      .expect( ( response ) => {
        expect( response.headers["x-auth"] ).toNotExist();
      } )
      .end( ( error, response ) => {
        if ( error ) {
          return done( error )
        }

        User.findById( users[0]._id ).then( ( user ) => {
          expect( user.tokens.length ).toBe( 0 );
          done();
        } ).catch( ( error ) => done( error ) );
      } );
  } );

} );
