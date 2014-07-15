'use strict';
var config = require( '../config.json' ).app;
var express = require( 'express' );
var fs = require( 'fs' );
var path = require( 'path' );
var errorhandler = require( 'errorhandler' );
var bodyParser = require( 'body-parser' );
var router = express.Router();
var app = module.exports = express();

// environment settings
app.set( 'protocol', config.protocol || 'http' );
app.set( 'host', config.host || 'localhost' );
app.set( 'port', process.env.PORT || config.port || 8080 );
// end settings

// middleware
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {
    extended: true
} ) );

// error handling
if ( process.env.NODE_ENV === 'development' ) {
    app.use( errorhandler() );
}
// end middleware

// routes
// load routes dynamically
fs.readdirSync( __dirname + config.routes ).forEach( function ( fileName ) {
    var route = path.join( __dirname, config.routes, fileName );
    require( route )( router );
} );

// default route
router.get( '*', function ( req, res ) {
    res.json( 404, {message: 'no route loaded for path: ' + req.originalUrl} );
} );

// apply all routes
app.use( '/', router );
// end routes