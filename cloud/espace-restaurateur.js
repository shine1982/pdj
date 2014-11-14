var requireUser = require('cloud/require-user');

module.exports = function(){

    var express = require('express');
    var Mandrill = require('mandrill');
    var dev =process.env && process.env['DEV'];// utilise ça car Mandrill ne fonctionne pas en local
    if(!dev){
        Mandrill.initialize('FsiTRmSXJL-qO8w3Cai9cg');
    }

    var app = express();

    app.set('views', 'cloud/views');  // Specify the folder to find templates
    app.set('view engine', 'ejs');

    app.locals._ = require('underscore');
    // This is an example of hooking up a request handler with a specific request
    // path and HTTP verb using the Express routing API.
    app.get('/r/inscrire', function(req, res) {
        //si déjà connecté, alors déconnecte utilisateur
        if(Parse.User.current()){
            Parse.User.logOut();
        }
        res.render('espace-restaurateur/signup-restaurateur');
    });

    app.get('/r/espace-restaurateur', requireUser, function(req, res) {

        var restaurateur = Parse.User.current();
        var query = new Parse.Query("Restaurant");
        query.equalTo("owner",restaurateur);
        var resto=false;
        query.find({
            success:function(restaurants){
                resto = restaurants[0];
                res.render("espace-restaurateur/espace-restaurateur", {resto:resto, role:restaurateur.get("userGroup")});
            },
            error:function(error){
                console.log("no restaurant trouvé pour restaurater "+restaurateur.username);
                res.render("espace-restaurateur/espace-restaurateur", {resto:resto,});
            }
        });
    });

    app.post('/r/submitSignup', function(req, res) {

        var email = req.body.email;
        var password = req.body.password;

        var restaurateur = new Parse.User();
        restaurateur.set("username", email);
        restaurateur.set("password", password);
        restaurateur.set("email", email);
        restaurateur.set("userGroup","restaurateur");

        restaurateur.signUp(null, {
            success: function(user) {
                if(!dev) { //si pas dev, alors envoi mail, sinon on ne fait rien
                    Mandrill.sendTemplate({
                        "template_name": "confirmationsignuppdj",
                        "template_content": [
                            {
                                "name": "loginUser",
                                "content": email
                            },
                            {
                                "name": "passwordUser",
                                "content": password
                            }
                        ],
                        message: {
                            from_email: "contact@leplatdujour.fr",
                            from_name: "Plat du jour",
                            to: [
                                {
                                    email: email,
                                    name: ''
                                }
                            ]
                        },
                        async: true
                    }, {
                        success: function (httpResponse) {
                            console.log(httpResponse);
                            response.success("Email sent!");
                        },
                        error: function (httpResponse) {
                            console.error(httpResponse);
                            response.error("Uh oh, something went wrong");
                        }
                    });
                }
                res.redirect('/r/espace-restaurateur');
            },
            error: function(user, error) {
                // Show the error message somewhere and let the user try again.
                res.redirect('/r/inscrire?error='+error.code);
            }
        });


    });

    app.post('/r/espace-restaurateur', requireUser, function(req, res) {
        var form = req.body;

        var Restaurant = Parse.Object.extend("Restaurant");
        var restaurant = new Restaurant();

        restaurant.save({
            name:form.name,
            address:form.address,
            postalCode:form.postalCode,
            city:form.city,
            telephone:form.telephone,
            opentimeNoonStartHour:form.opentimeNoonStartHour,
            opentimeNoonStartMin:form.opentimeNoonStartMin,
            opentimeNoonEndHour:form.opentimeNoonEndHour,
            opentimeNoonEndMin:form.opentimeNoonEndMin,
            opentimeEveningStartHour:form.opentimeEveningStartHour,
            opentimeEveningStartMin:form.opentimeEveningStartMin,
            opentimeEveningEndHour:form.opentimeEveningEndHour,
            opentimeEveningEndMin:form.opentimeEveningEndMin,
            opentimeException:form.opentimeException,
            owner:Parse.User.current()
        },{
            success:function(resto){
                res.redirect("/r/espace-restaurateur#edit/"+resto.id+"/todaydish");
            },
            error:function(resto,error){
                res.redirect("/r/espace-restaurateur");
            }
        })



    });
    return app;
}();