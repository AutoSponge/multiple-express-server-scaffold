'use strict';

var url = require( 'url' );
var path = require( 'path' );
var config = require( './config.json' );
var servers = Object.keys( config );
var gruntConfig = {};

module.exports = function ( grunt ) {
    // show elapsed time at the end
    require( 'time-grunt' )( grunt );
    // load all grunt tasks
    require( 'load-grunt-tasks' )( grunt );

    // grunt-contrib-jshint
    gruntConfig.jshint = {
        options: {
            jshintrc: '.jshintrc',
            reporter: require( 'jshint-stylish' )
        },
        all: servers.reduce( function ( list, server ) {
            list.push( path.join( __dirname, config[server].src.path, '/**/*.js' ) );
            return list;
        }, ['./*.js'])
    };
    servers.reduce( function ( jshint, server ) {
        jshint[server] = {
            files: {
                src: [path.join( __dirname, config[server].src.path, '/**/*.js' )]
            }
        };
        return jshint;
    }, gruntConfig.jshint );

    // grunt-express-server
    gruntConfig.express = {};
    servers.reduce( function ( express, server ) {
        express[server] = {
            options: {
                script: path.join( __dirname, config[server].src.path, config[server].src.main )
            }
        };
        return express;
    }, gruntConfig.express );

    // grunt-contrib-watch
    gruntConfig.watch = {};
    servers.reduce( function ( watch, server ) {
        watch[server] = {
            files: [
                path.join( __dirname, config[server].src.path, '/**/*.js' )
            ],
            tasks: [
                'express:' + server
            ],
            options: {
                spawn: false,
                atBegin: true
            }
        };
        return watch;
    }, gruntConfig.watch );

    // grunt-open
    gruntConfig.open = {};
    servers.reduce( function ( open, server ) {
        open[server] = {
            path: path.join( url.format( config[server].url ), config[server].open ),
            options: {
                delay: 500
            }
        };
        return open;
    }, gruntConfig.open );

    // init
    grunt.initConfig( gruntConfig );

    // custom tasks
    grunt.registerTask( 'serve', function ( server ) {
        var tasks = [];
        if ( config[server].open ) {
            tasks.push( 'open:' + server );
        }
        tasks.push( 'watch:' + server );
        return grunt.task.run( tasks );
    } );

    // default task
    grunt.registerTask( 'default', ['jshint:all', 'serve:' + servers[0]] );

};
