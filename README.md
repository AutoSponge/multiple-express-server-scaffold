express-server
==============

configurable express server scaffold with grunt automation

## What this can scaffold do

With this scaffold, you can setup one or more servers.  Use the `config.json` file
to define additional servers, copy the appropriate areas of the `Gruntfile.js`,
and place your code in the appropriate folder.  If you specify `https`, the script
will generate a new certificate which you will need to accept when the server's `open`
path opens in the browser.

## Getting Started

`npm install`

`grunt`

## Making this your own server(s)

Most settings you might want to change can be found in the `config.json` file.

By using or copying the structure of the `app` sever, you can add routes dynamically
into the `/routes` folder, just follow the pattern provided.