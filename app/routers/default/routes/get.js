'use strict';
module.exports = function ( router ) {
    router.get( '/', function ( req, res/*, next*/ ) {
        res.send( '/ GET successful...' );
    } );
};