var app = app || {};

app.ArdoiseDishList = Parse.Collection.extend({

    model: app.ArdoiseDish,

    getNextOrder: function () {
        if (!this.length) {
            return 1;
        }
        return this.last().get('order') + 1;
    },
    comparator: function (model) {
        return model.get('order');
    },
    dishesOfIdDishesBloc: function (idDishesBloc) {
        return this.filter(function(dish){
            return dish.get("idDishesBloc")===idDishesBloc && !dish.toBeRemoved;
        })
    },
    notToBeRemovedList:function(){
        return this.filter(function(dish){
            return !dish.toBeRemoved;
        })
    }

});