Parse.Events.listenTo = Parse.Events.on;
var ArdoiseFormulePriceView = Parse.View.extend({

    tagName:'div',
    className:'form-group',

    // Cache the template function for a single item.
    template: _.template($('#ardoise-formule-price-template').html()),

    events: {
       "click .clear":"removeItem",
       "blur .formulePriceInput":"setPrice"
    },

    initialize: function() {
        this.model.toBeRemoved = false;
    },

    removeItem:function(item){
        //this.model.destroy();
        this.model.toBeRemoved = true;
        this.remove();
    },
    setPrice:function(e){
        this.model.set("priceEuro", e.currentTarget.value);
        this.model.save();
    },

    render: function() {
        this.$el.html( this.template(this.model.attributes));
        return this;
    }
});