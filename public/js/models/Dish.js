var app = app || {};

app.Dish = Parse.Object.extend({

    className:"Dish",

    defaults: {
        name: '',
        priceEuro: '',
        priceCentimes: '',
        order: 1,
        dishType: 1
    }

});