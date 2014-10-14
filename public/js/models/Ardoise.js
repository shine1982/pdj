var app = app || {};

app.Ardoise = Parse.Object.extend({

    className:"Ardoise",

    defaults: {
        title: 'Formule Midi',
        formulePriceList:'',
        startersList:'',
        dishesList:'',
        dessertsList:'',
        suggestionsList:'',
        date:'',
        resto:''
    }

});