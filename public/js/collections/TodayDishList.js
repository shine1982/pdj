var app = app || {};

app.TodayDishList = Parse.Collection.extend({

    model: app.TodayDish,

    comparator:function(todayDish){
        return todayDish.get("createdAt");
    }
});