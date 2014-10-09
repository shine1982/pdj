

module.exports = function(){

    var express = require('express');
    var app = express();

    app.set('views', 'cloud/views');  // Specify the folder to find templates
    app.set('view engine', 'ejs');

    app.locals._ = require('underscore');
    // This is an example of hooking up a request handler with a specific request
    // path and HTTP verb using the Express routing API.
    app.get('/r/inscrire', function(req, res) {

        res.render('espace-restaurateur/inscrire');
    });

    return app;
}();