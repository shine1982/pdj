var app = app || {};

app.ArdoiseDish = Parse.Object.extend({

    className:"ArdoiseDish",

    defaults: {
        name: '',
        priceEuro: '',
        priceCentimes: '',
        order: 1,
        dishType: 1
    }

});