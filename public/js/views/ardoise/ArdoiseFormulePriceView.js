Parse.Events.listenTo = Parse.Events.on;
var app = app || {};
app.ArdoiseFormulePriceView = Parse.View.extend({

    tagName:'div',
    className:'form-group',

    // Cache the template function for a single item.
    template: _.template($('#ardoise-formule-price-template').html()),

    events: {
       "click .clear":"removeItem",
       "blur .formulePriceInput":"setPrice",
       "click .formulePriceLabel": "startEditingMode",
       "blur .formulePriceLabelInput": "endEditingMode"

    },

    initialize: function() {
        _.bindAll(this,"render","removeItem");
        this.model.toBeRemoved = false;
        this.model.bind('change', this.render);
    },

    removeItem:function(item){
        this.model.toBeRemoved = true;
        this.remove();
    },
    setPrice:function(e){
        this.model.set("priceEuro", this.$(".formulePriceInput").val());
        this.model.save();
    },

    startEditingMode:function(){
        this.$(".formulePriceLine").addClass("editing");
        this.$(".formulePriceLabelInput").focus();
    },
    endEditingMode:function(){
        this.$(".formulePriceLine").removeClass("editing");
        this.model.set("label", this.$(".formulePriceLabelInput").val());
        this.model.save();

    },

    render: function() {
        this.$el.html( this.template(this.model.attributes));
        return this;
    }
});