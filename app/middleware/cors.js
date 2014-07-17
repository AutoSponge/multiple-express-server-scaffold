// quick CORS headers
'use strict';
module.exports = function ( req, res, next ) {
    res.header( 'Access-Control-Allow-Origin', req.headers.origin );
    res.header( 'Access-Control-Allow-Methods', 'HEAD,GET,PUT,POST,PATCH,DELETE' );
    res.header( 'Access-Control-Allow-Headers', 'Content-Type, Authorization' );

    // intercept OPTIONS method
    if ( req.method.toUpperCase() === 'OPTIONS' ) {
        res.send( 204 );
    } else {
        next();
    }
};
