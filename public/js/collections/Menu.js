var app = app || {};

app.Menu = Parse.Collection.extend({

    model: app.Dish,


    nextOrder:function(dishType){
        var dishes = this.filter(function(dish){
            return dish.get("dishType") == dishType;
        });
        if (!dishes.length) return 1;
        return dishes[dishes.length-1].get('order') + 1;
    },
    comparator:function(dish){
        return dish.get("order");
    }
});