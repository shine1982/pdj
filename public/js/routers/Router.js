var app = app || {};

app.Router = Parse.Router.extend({
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
app.router = new app.Router();
app.resto = null; // resto en train d'être édité

app.router.on('route:restos', function(){
   new app.RestaurantsView();
});
app.restaurantManagementView = new app.RestaurantManagementView();
function showOnglet(id,onglet){
    app.restaurantManagementView.render(id,onglet);
}

app.router.on('route:editResto', function(id){
    showOnglet(id,'basicinfo');
    if(id){
        getRestoByIdThenExecuteFonc(id, function(){new app.RestaurantView();});
    }else{
        new app.RestaurantView();
    }
});
app.router.on('route:editArdoise', function(id){
    showOnglet(id,'ardoise');
    getRestoByIdThenExecuteFonc(id, function(){new app.ArdoisePanelView();});
})
app.router.on('route:editArdoisesCalendarView', function(id){
    showOnglet(id,'ardoisesCalenderView');

});

app.router.on('route:editPhoto', function(id){
    showOnglet(id,'photo');
    getRestoByIdThenExecuteFonc(id, function(){new app.PhotosView();});
});
app.router.on('route:editContact', function(id){
    showOnglet(id,'contact');
    getRestoByIdThenExecuteFonc(id, function(){new  app.ContactView()});
});
app.router.on('route:editReferenciel', function(id){
    showOnglet(id,'referenciel');
    var menuView = new MenuView(id);
    menuView.render();
});
Parse.history.start();