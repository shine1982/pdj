var app = app || {};
app.ArdoiseDishesBlocView = Parse.View.extend({

    tagName:'div',

    // Cache the template function for a single item.
    template: _.template($('#ardoise-dishes-bloc-template').html()),

    events: {
       "click .clear":"removeItem",
       "blur .dishesBlocPriceInput":"setPrice",
       "click .dishesBlocLabel": "startEditingMode",
       "blur .dishesBlocLabelInput": "endEditingMode"

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
        this.model.set("priceEuro", this.$(".dishesBlocPriceInput").val());
        this.model.save();
    },

    startEditingMode:function(){
        this.$(".dishesBlocLine").addClass("editing");
        this.$(".dishesBlocLabelInput").focus();
    },
    endEditingMode:function(){
        this.$(".dishesBlocLine").removeClass("editing");
        this.model.set("label", this.$(".dishesBlocLabelInput").val());
        this.model.save();

    },

    render: function() {
        var theme = "default";
        var themeArray = ["success","info","warning"];
        var order = this.model.get('order');
        if(order>0 && order<=themeArray.length){
            theme = themeArray[order-1];
        }
        this.$el.html( this.template(_.extend(this.model.attributes, {id:this.model.id},{theme:theme})));
        return this;
    }
});