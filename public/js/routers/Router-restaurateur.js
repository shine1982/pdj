var app = app || {};

app.Router = Parse.Router.extend({
        routes: {
            '':'editResto',
            'edit':'editResto',
            'edit/ardoise':'editArdoise',
            'edit/photo':'editPhoto',
            'edit/monprofil':'editContact'
        }
    }
)
app.router = new app.Router();
app.resto = null; // resto en train d'être édité
app.restaurantManagementView = new app.RestaurantManagementView();

function showOnglet(id,onglet){
    app.restaurantManagementView.render(id,onglet);
}


app.router.on('route:editResto', function(){

    showOnglet(app.idResto,'basicinfo');
    if(app.idResto){
        getRestoByIdThenExecuteFonc(app.idResto, function(){new app.RestaurantView();});
    }else{
        new app.RestaurantView();
    }

});
app.router.on('route:editArdoise', function(){

    showOnglet(app.idResto,'ardoise');
    getRestoByIdThenExecuteFonc(app.idResto, function(){new app.ArdoisePanelView();});

});

app.router.on('route:editPhoto', function(){
    showOnglet(app.idResto,'photo');
    getRestoByIdThenExecuteFonc(app.idResto, function(){new app.PhotosView();});

});
app.router.on('route:editContact', function(){
    showOnglet(app.idResto,'contact');
    getRestoByIdThenExecuteFonc(app.idResto, function(){new  app.ContactView()});

});
Parse.history.start();