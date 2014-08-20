var Router = Backbone.Router.extend({
    routes: {
        '': 'restos',
        'edit':'editResto'
    }
}
)
var router = new Router();
router.on('route:restos', function(){
   var restaurantsView = new RestaurantsView();
   restaurantsView.render();

});
router.on('route:editResto', function(){
    var restaurantView = new RestaurantView();
    restaurantView.render();
});
Backbone.history.start();