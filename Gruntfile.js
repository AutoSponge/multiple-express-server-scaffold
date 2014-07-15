'use strict';
var protocols = {
    http: require( 'http' ),
    https: require( 'https' )
};
var url = require( 'url' );
var path = require( 'path' );
var pem = require( 'pem' );
var config = require( './config.json' );

var components = [
    'app'
];

module.exports = function ( grunt ) {
    // show elapsed time at the end
    require( 'time-grunt' )( grunt );
    // load all grunt tasks
    require( 'load-grunt-tasks' )( grunt );

    grunt.initConfig( {
        config: config,
        watch: {
            options: {
                nospawn: true,
                livereload: true
            },
            app: {
                options: {
                    livereload: config.app.livereload
                },
                files: [
                    '<%= config.app.public %>/{,*/}*.html',
                    '<%= config.app.public %>/scripts/{,*/}*.js',
                    '<%= config.app.path %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}'
                ]
            }
        },
        open: {
            app: {
                path: '<%= config.app.protocol %>://<%= config.app.host %>:<%= config.app.port %>/'
            }
        },
        concurrent: {
            all: {
                tasks: ['serve:app'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require( 'jshint-stylish' )
            },
            all: [
                '<%= config.app.path %>/{,*/}*.js'
            ]
        }
    } );

    function checkNewLine( str ) {
        return str.lastIndexOf( '\n' ) + 1 === str.length ? str : str + '\n';
    }

    function createServer( app ) {
        return function () {
            var done = this.async();
            var protocol = app.get( 'protocol' );
            var host = app.get( 'host' );
            var port = app.get( 'port' );
            var uri = protocol + '://' + host + ':' + port;

            function complete() {
                grunt.log.writeln( 'Express server listening at ' + uri );
                done();
            }

            if ( protocol === 'https' ) {
                pem.createCertificate( {
                    selfSigned: true
                }, function ( err, keys ) {
                    protocols[protocol].createServer( {
                        key: checkNewLine( keys.serviceKey ),
                        cert: checkNewLine( keys.certificate )
                    }, app ).listen( port, complete );
                } );
            } else {
                protocols[protocol].createServer( app )
                    .listen( port, complete );
            }
        };
    }

    components.forEach( function ( component ) {
        var path = __dirname + '/' + config[component].path;
        grunt.registerTask( component + 'Server', createServer( require( path + '/app' ) ) );
    } );

    grunt.registerTask( 'serve', function ( target ) {
        var server = target || 'app';
        var tasks = [server + 'Server'];

        if ( target !== 'registry' ) {
            tasks.push( 'open:' + server );
        }
        tasks.push( 'watch:' + server );
        return grunt.task.run( tasks );
    } );

    grunt.registerTask( 'default', ['jshint', 'concurrent:all'] );

};
