var requireUser = require('cloud/require-user');

module.exports = function(){

    var express = require('express');
    var app = express();

    app.set('views', 'cloud/views');
    app.set('view engine', 'ejs');

    app.locals._ = require('underscore');

    app.get('/a/restos', requireUser, function(req, res) {
        res.render('resto/restaurants', {role:Parse.User.current().get("userGroup")});
    });

    return app;
}();