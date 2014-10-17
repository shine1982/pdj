var app = app || {};

var Router = Parse.Router.extend({
        routes: {
            '':'editResto',
            'edit':'editResto',
            'edit/ardoise':'editArdoise',
            'edit/menu':'editMenu',
            'edit/photo':'editPhoto',
            'edit/monprofil':'editContact'
        }
    }
)
app.router = new Router();
app.resto = null; // resto en train d'être édité
var restaurantManagementView = new RestaurantManagementView();

app.router.on('route:editResto', function(){

    restaurantManagementView.render(app.idResto,'basicinfo');
    var restaurantView = new RestaurantView(app.idResto);
    restaurantView.render();

});
app.router.on('route:editArdoise', function(){

    restaurantManagementView.render(app.idResto,'ardoise');
    var ardoiseView = new ArdoiseView(app.idResto);
    ardoiseView.render();

});
app.router.on('route:editMenu', function(){
    restaurantManagementView.render(app.idResto,'menu');
    var menuView = new MenuView(app.idResto);
    menuView.render();

});
app.router.on('route:editPhoto', function(){
    restaurantManagementView.render(app.idResto,'photo');
    var photosView = new PhotosView(app.idResto);
    photosView.render();

});
app.router.on('route:editContact', function(){
    restaurantManagementView.render(app.idResto,'contact');
    var contactView = new ContactView(app.idResto);
    contactView.render();

});
Parse.history.start();