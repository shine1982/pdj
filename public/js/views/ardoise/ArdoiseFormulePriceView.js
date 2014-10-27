Parse.Events.listenTo = Parse.Events.on;
var ArdoiseFormulePriceView = Parse.View.extend({

    tagName:'div',
    className:'form-group',

    // Cache the template function for a single item.
    template: _.template($('#ardoise-formule-price-template').html()),

    events: {
       "click .clear":"removeItem",
       "blur .formulePriceInput":"setPrice",
       "dblclick .formulePriceLabel": "startEditingMode",
       "blur .formulePriceLabelInput": "endEditingMode"

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

    startEditingMode:function(){

        this.$(".formulePriceLine").addClass("editing");
    },
    endEditingMode:function(){
        this.$(".formulePriceLine").removeClass("editing");
        var newLabel = this.$(".formulePriceLabelInput").val();
        this.model.set("label", newLabel);
        this.model.save();
        this.render();
    },

    render: function() {
        this.$el.html( this.template(this.model.attributes));
        return this;
    }
});