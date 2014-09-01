var requireUser = require('cloud/require-user');

module.exports = function(){

    var express = require('express');
    var app = express();

    app.set('views', 'cloud/views');  // Specify the folder to find templates
    app.set('view engine', 'ejs');

    app.locals._ = require('underscore');
    // This is an example of hooking up a request handler with a specific request
    // path and HTTP verb using the Express routing API.
    app.get('/a/restos', requireUser, function(req, res) {

        var query = new Parse.Query("Restaurant");
        query.descending("createdAt");

        query.limit(10);
        query.find().then(function(restos){
                res.render('resto/restaurants',{"restos": restos});
            },
            function(error){
                console.log(error);
                res.render("resto/restaurants",{"msg":error});
            })
    });

    return app;
}();