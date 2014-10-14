var app = app || {};

var Router = Parse.Router.extend({
    routes: {
        '': 'restos',
        'edit':'editResto',
        'edit/:id':'editResto',
        'edit/:id/ardoise':'editArdoise',
        'edit/:id/calendrier-ardoises':'editArdoisesCalendarView',
        'edit/:id/referenciel':'editReferenciel',
        'edit/:id/photo':'editPhoto',
        'edit/:id/contact':'editContact'
    }
}
)
app.router = new Router();
app.resto = null; // resto en train d'être édité
app.router.on('route:restos', function(){
   var restaurantsView = new RestaurantsView();
   restaurantsView.render();
});
var restaurantManagementView = new RestaurantManagementView();

app.router.on('route:editResto', function(id){

    restaurantManagementView.render(id,'basicinfo');
    var restaurantView = new RestaurantView(id);
    restaurantView.render();

});
app.router.on('route:editArdoise', function(id){
    restaurantManagementView.render(id,'ardoise');
    var ardoiseView = new ArdoiseView(id);
    ardoiseView.render();
})
app.router.on('route:editArdoisesCalendarView', function(id){
    restaurantManagementView.render(id,'ardoisesCalenderView');
    var ardoiseView = new ArdoiseView(id);
    ardoiseView.render();
});
app.router.on('route:editReferenciel', function(id){
    restaurantManagementView.render(id,'referenciel');
    var menuView = new MenuView(id);
    menuView.render();

});
app.router.on('route:editPhoto', function(id){
    restaurantManagementView.render(id,'photo');
    var photosView = new PhotosView(id);
    photosView.render();

});
app.router.on('route:editContact', function(id){
    restaurantManagementView.render(id,'contact');
    var contactView = new ContactView(id);
    contactView.render();

});
Parse.history.start();