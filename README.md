express-server
==============

configurable express server scaffold with grunt automation

## What this scaffold can do

With this scaffold, you can setup one or more servers.  Use the `config.json` file
to define additional servers and copy the app folder (renaming it to match the config).
If you specify `https`, the script will generate a new certificate which you will 
need to accept when the server's `open` path opens in the browser.

## Getting Started

`npm install`

`grunt`

## Making this your own server(s)

 1. Copy the `/app` template and paste it to a sibling folder
 1. Change the `config.json` entry to match your new folder
 1. Make any changes needed to the config
 1. `npm install`
 1. `grunt`
 
If you need to run more than one server at a time, follow the first 2 steps of the previous list,
then copy the basic config and change the app name and port of the new config, then run `grunt`.

By copying the structure of the `app` sever, you can add middleware, routers, and routes dynamically.