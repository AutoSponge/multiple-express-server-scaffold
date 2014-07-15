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

Most settings you might want to change can be found in the `config.json` file.  If 
you want to add more settings (such as those for OAuth), try to extend the pattern:

 1. Add the settings the config file
 1. Add the settings to the app under "environmental settings" with `app.set()`
 1. Use the settings throughout the app with `app.get()`
 1. If needed, use the settings from the grunt launch script

By using or copying the structure of the `app` sever, you can add routes dynamically
into the `/routes` folder, just follow the pattern provided:

```javascript
// router is injected to the exported function
module.exports = function ( router ) {    
    // define the route
    ...
};
```