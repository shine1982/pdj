var Router = Backbone.Router.extend({
    routes: {
        '': 'restos',
        'edit':'editResto',
        'edit/:id':'editResto'
    }
}
)
var router = new Router();
router.on('route:restos', function(){
   var restaurantsView = new RestaurantsView();
   restaurantsView.render();

});
router.on('route:editResto', function(id){

    var restaurantView = new RestaurantView();
    restaurantView.render(id);
});
Backbone.history.start();