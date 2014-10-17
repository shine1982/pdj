var app = app || {};

app.ArdoiseFormulePrice = Parse.Object.extend({

    className:"ArdoiseFormulePrice",

    defaults: {
        selected:false,
        label: '',
        priceEuro: '',
        order: 1
    }

});