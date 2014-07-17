'use strict';
var config = require( '../config.json' ).app;
var express = require( 'express' );
var fs = require( 'fs' );
var path = require( 'path' );
var url = require( 'url' );
var https = require( 'https' );
var pem = require( 'pem' );
var app = module.exports = express();

// environment settings
// ...
// end settings

// load middleware dynamically
fs.readdirSync( path.join( __dirname, 'middleware' ) ).forEach( function ( fileName ) {
    var middleware = path.join( __dirname, 'middleware', fileName );
    app.use( require( middleware ) );
} );

// load routers dynamically
fs.readdirSync( path.join( __dirname, 'routers' ) ).forEach( function ( fileName ) {
    var router = path.join( __dirname, 'routers', fileName );
    console.log( 'loading router', router );
    require( router )( app );
} );

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