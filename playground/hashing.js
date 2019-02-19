const { SHA256 } = require( "crypto-js" );
const jwt = require( "jsonwebtoken" );
const bcrypt = require( "bcryptjs" );

const password = "123abc!";

bcrypt.genSalt( 150, ( error, salt ) => {
  bcrypt.hash( password, salt, ( error, hash ) => {
    console.log( hash );
  } );
} );

const hashedPassword = "$2a$10$HmKYnKAMqnsHLOGWcvq2fejEX9Q8V6jp2.R9Yd7eofHQCfg3pFof6"; // Produced by console.log, above.
bcrypt.compare( password, hashedPassword, ( error, result ) => {
  console.log( result );
} );


// let data = {
//   id: 10,
// };
//
// const token = jwt.sign( data, "abc123" );
// console.log( token );
//
// const decoded = jwt.verify( token, "abc123" );
// console.log( "decoded: ", decoded );

// const message = "I am user number 3";
// const hash = SHA256( message ).toString();
//
// console.log( `Message: ${message}` );
// console.log( `Hash: ${hash}` );
//
// const data = {
//   id: 4
// };
//
// let token = {
//   data,
//   hash: SHA256( JSON.stringify( data ) + "somesecret" ).toString()
// };
//
// // Man-in-the-middle changes:
// token.data.id = 5;
// // Man-in-the-middle does not have our "somesecret" salt!
// token.hash = SHA256( JSON.stringify( token.data ) ).toString();
//
//
// const resultHash = SHA256( JSON.stringify( token.data ) + "somesecret" ).toString();
//
// if ( resultHash == token.hash ) {
//   console.log( "Data was not changed." );
// } else {
//   console.log( "Data was changed. Don't trust it." );
// }
