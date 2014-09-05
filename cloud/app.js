var express = require('express');
var expressLayouts = require('cloud/lib/express-layouts');
var parseExpressCookieSession = require('parse-express-cookie-session');
var parseExpressHttpsRedirect = require('parse-express-https-redirect');

var app = express();

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(expressLayouts);
app.use(parseExpressHttpsRedirect());    // Automatically redirect non-secure urls to secure ones
app.use(express.bodyParser());    // Middleware for reading request body
app.use(express.methodOverride());
app.use(express.cookieParser('SECRET_SIGNING_KEY'));
/*
app.use(parseExpressCookieSession({
    fetchUser: true,
    key: 'resto.sess',
    cookie: {
        maxAge: 3600000 * 24 * 30
    }
}));
*/
app.locals._ = require('underscore');

// Resto endpoints

app.use('/', require('cloud/user'));
app.use('/', require('cloud/resto'));

// Attach the Express app to Cloud Code.
if (process.env && process.env['DEV']) {
    app.use(express.static(__dirname + '/../public'));
    app.listen(3000);
} else {
    app.listen();
}
