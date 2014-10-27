var app = app || {};

app.ArdoiseFormulePriceList = Parse.Collection.extend({

    model: app.ArdoiseFormulePrice,

    getNextOrder:function(){
        if ( !this.length ) {
            return 1;
        }
        return this.last().get('order') + 1;
    },
    comparator: function( model ) {
        return model.get('order');
    }

});