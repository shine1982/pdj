var app = app || {};

app.ArdoiseDish = Parse.Object.extend({

    className:"ArdoiseDish",

    defaults: {
        label: '',
        priceEuro: '',
        order: 1
    }

});