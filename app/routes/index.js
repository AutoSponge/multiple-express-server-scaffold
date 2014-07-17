'use strict';
module.exports = function ( router ) {
    router.get( '/', function ( req, res/*, next*/ ) {
        res.send( '/ GET successful...' );
    } );

    router.post( '/:test', function ( req, res ) {
        res.json( 201, {
            params: req.params,
            query: req.query,
            body: req.body
        } );
    } );
};