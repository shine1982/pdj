var app = app || {};
//le model qui represente le candidat de plat du jour
app.TodayDish = Parse.Object.extend({

    className:"TodayDish",

    defaults: {
        name: '',
        priceEuro: '',
        priceCentimes: '',
        order: 1,
        dishType: 1
    }

});