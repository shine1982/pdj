var app = app || {};

app.ArdoiseFormulePrice = Parse.Object.extend({

    className:"ArdoiseFormulePrice",

    defaults: {
        label: '',
        priceEuro: '',
        order: 1
    }

});