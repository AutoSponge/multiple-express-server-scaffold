'use strict';
module.exports = function ( router ) {
    router.get( '/get', function ( req, res/*, next*/ ) {
        res.send( '/GET successful...' );
    } );
};