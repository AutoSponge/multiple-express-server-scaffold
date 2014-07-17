'use strict';
var config = require( '../config.json' ).app;
var express = require( 'express' );
var fs = require( 'fs' );
var path = require( 'path' );
var url = require( 'url' );
var https = require( 'https' );
var pem = require( 'pem' );
var errorhandler = require( 'errorhandler' );
var bodyParser = require( 'body-parser' );
var router = express.Router();
var app = module.exports = express();

// environment settings

// end settings

// middleware
app.use( bodyParser.json() );

app.use( bodyParser.urlencoded( {
    extended: true
} ) );

// quick CORS headers
app.use( function ( req, res, next ) {
    res.header( 'Access-Control-Allow-Origin', req.headers.origin );
    res.header( 'Access-Control-Allow-Methods', 'HEAD,GET,PUT,POST,PATCH,DELETE' );
    res.header( 'Access-Control-Allow-Headers', 'Content-Type, Authorization' );

    // intercept OPTIONS method
    if ( req.method.toUpperCase() === 'OPTIONS' ) {
        res.send( 204 );
    } else {
        next();
    }
} );

// error handling
app.use( errorhandler() );
// end middleware

// routes
// load routes dynamically
fs.readdirSync( path.join( __dirname, 'routes' ) ).forEach( function ( fileName ) {
    var route = path.join( __dirname, 'routes', fileName );
    require( route )( router );
} );

// default route
router.get( '*', function ( req, res ) {
    res.json( 404, {message: 'no route loaded for path: ' + req.originalUrl} );
} );

// apply all routes
app.use( '/', router );
// end routes

// create server
function checkNewLine( str ) {
    return str.lastIndexOf( '\n' ) + 1 === str.length ? str : str + '\n';
}

function complete() {
    console.log( 'Express server listening at ' + url.format( config.url ) );
}

if ( config.url.protocol === 'https' ) {
    pem.createCertificate( {
        selfSigned: true
    }, function ( err, keys ) {
        https.createServer( {
            key: checkNewLine( keys.serviceKey ),
            cert: checkNewLine( keys.certificate )
        }, app ).listen( config.url.port, complete );
    } );
} else {
    app.listen( config.url.port, complete );
}