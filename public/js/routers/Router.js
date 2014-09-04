var app = app || {};

var Router = Parse.Router.extend({
    routes: {
        '': 'restos',
        'edit':'editResto',
        'edit/:id':'editResto',
        'edit/:id/todaydish':'editTodayDish',
        'edit/:id/menu':'editMenu',
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
app.router.on('route:editTodayDish', function(id){

    restaurantManagementView.render(id,'todaydish');
    var todayDishManangementView = new TodayDishManangementView(id);
});
app.router.on('route:editMenu', function(id){
    restaurantManagementView.render(id,'menu');
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