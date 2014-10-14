var app = app || {};

app.ArdoiseFormulePrice = Parse.Object.extend({

    className:"ArdoiseFormulePrice",

    defaults: {
        selected:'',
        label: '',
        priceEuro: '',
        order: 1
    }

});