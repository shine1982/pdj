var app = app || {};
app.ArdoiseDishView = Parse.View.extend({

    tagName:'div',
    className:'form-group',

    // Cache the template function for a single item.
    template: _.template($('#ardoise-dish-template').html()),

    events: {
       "click .clearDish":"removeItem",
       "blur .dishPriceInput":"setPrice",
       "click .dishLabel": "startEditingMode",
       "blur .dishLabelInput": "endEditingMode"

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
        this.model.set("priceEuro", this.$(".dishPriceInput").val());
        this.model.save();
    },

    startEditingMode:function(){
        this.$(".dishLine").addClass("editing");
        this.$(".dishLabelInput").focus();
    },
    endEditingMode:function(){
        this.$(".dishLine").removeClass("editing");
        this.model.set("label", this.$(".dishLabelInput").val());
        this.model.save();

    },

    render: function() {
        this.$el.html( this.template(this.model.attributes));
        return this;
    }
});