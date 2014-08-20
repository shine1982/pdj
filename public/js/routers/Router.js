var Router = Backbone.Router.extend({
    routes: {
        '': 'restos'
    }
}
)
var router = new Router();
router.on('route:restos', function(){
   var restaurantsView = new RestaurantsView();
   restaurantsView.render();

});
Backbone.history.start();