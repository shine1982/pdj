
module.exports = function(){

    var express = require('express');
    var app = express();
    app.set('views', 'cloud/views');  // Specify the folder to find templates
    app.set('view engine', 'ejs');


    app.locals._ = require('underscore');

    // This is an example of hooking up a request handler with a specific request
    // path and HTTP verb using the Express routing API.
    app.get('/restos', function(req, res) {

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