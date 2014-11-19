var app = app || {};

app.ArdoiseDishesBlocList = Parse.Collection.extend({

    model: app.ArdoiseDishesBloc,

    getNextOrder:function(){
        if ( !this.length ) {
            return 1;
        }
        return this.last().get('order') + 1;
    },
    comparator: function( model ) {
        return model.get('order');
    },

    hasDishesList:function(listDishes){
        return this.filter(function(dishesBloc){
            return listDishes.dishesOfIdDishesBloc(dishesBloc.id).length>0;
        })
    }

});