'use strict';
var appName = __dirname.split( '/' ).pop();
var config = require( '../config.json' )[appName];
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
    var keysPath = path.join( __dirname, 'keys' );
    var serviceKeyPath = path.join( keysPath, 'serviceKey.pem' );
    var certPath = path.join( keysPath, 'certificate.pem' );
    if ( fs.existsSync( serviceKeyPath ) && fs.existsSync( certPath ) ) {
        https.createServer( {
            key: fs.readFileSync( serviceKeyPath ),
            cert: fs.readFileSync( certPath )
        }, app ).listen( config.url.port, complete );
    } else {
        pem.createCertificate( {
            selfSigned: true
        }, function ( err, keys ) {
            var serviceKey = checkNewLine( keys.serviceKey );
            var certificate = checkNewLine( keys.certificate );
            fs.mkdirSync( keysPath );
            fs.writeFileSync( serviceKeyPath, serviceKey );
            fs.writeFileSync( certPath, certificate );
            https.createServer( {
                key: serviceKey,
                cert: certificate
            }, app ).listen( config.url.port, complete );
        } );
    }
} else {
    app.listen( config.url.port, complete );
}