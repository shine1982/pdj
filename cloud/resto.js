module.exports = function(){
    var express = require('express');
    var app = express();
    app.locals._ = require('underscore');

    // This is an example of hooking up a request handler with a specific request
    // path and HTTP verb using the Express routing API.
    app.get('/restos', function(req, res) {
        res.render('restaurants', { message: 'Hello from Feng!' });
    });

    app.get('/addresto', function(req, res) {
        var query = new Parse.Query("Restaurant");
        query.descending("createdAt");
        query.limit(10);
        query.find().then(function(restos){
            res.render('addresto',{"restos": restos});
        },
        function(error){
            console.log(error);
            res.render("addresto",{"msg":error});
        })

    });

    app.post('/submitResto', function(req, res) {
        var restoName = req.body.restoName;
        var Restaurant = Parse.Object.extend("Restaurant");
        var resto = new Restaurant();
        resto.set("name",restoName);
        resto.save().then(function(resto) {
            // the object was saved successfully.
            console.log("resto "+restoName+" saved!");

        }, function(error) {
            // the save failed.
        });


        res.redirect('/addresto');
    });

    return app;
}();