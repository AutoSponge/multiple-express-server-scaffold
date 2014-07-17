var fs = require( 'fs' );
var path = require( 'path' );
var router = require( 'express' ).Router();

module.exports = function ( app ) {
    'use strict';

    fs.readdirSync( path.join( __dirname, 'routes' ) ).forEach( function ( fileName ) {
        var route = path.join( __dirname, 'routes', fileName );
        console.log( 'loading route', route );
        require( route )( router );
    } );

    // apply all routes
    app.use( '/', router );
};