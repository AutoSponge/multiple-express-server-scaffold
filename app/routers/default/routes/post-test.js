'use strict';
module.exports = function ( router ) {
    router.post( '/:test', function ( req, res ) {
        res.json( 201, {
            params: req.params,
            query: req.query,
            body: req.body
        } );
    } );
};