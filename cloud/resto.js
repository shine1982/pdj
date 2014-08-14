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

    app.post('/r', function(req, res) {
        if (req.body.file) {
            var Restaurant = Parse.Object.extend("Restaurant");
            var resto = new Restaurant();
            resto.set("name",req.body.restoName);
            resto.set("pdjOriginal",req.body.file);

            // Set up the ACL so everyone can read the image
            // but only the owner can have write access
            var acl = new Parse.ACL();
            acl.setPublicReadAccess(true);
            resto.setACL(acl);
            // Save the image and return some info about it via json
            resto.save();
        } else {
            res.json({ error: 'No file uploaded!' });
        }


        res.redirect('/addresto');
    });

    return app;
}();