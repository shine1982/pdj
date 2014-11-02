var app = app || {};
app.ArdoiseDishesBlocView = Parse.View.extend({

    tagName:'div',

    // Cache the template function for a single item.
    template: _.template($('#ardoise-dishes-bloc-template').html()),

    events: {
       "click .clear":"removeItem",
       "blur .dishesBlocPriceInput":"setPrice",
       "click .dishesBlocLabel": "startEditingMode",
       "blur .dishesBlocLabelInput": "endEditingMode",

        //dish
        "click .showAddDishBtn":"showAddNewDish",
        "click .hideAddDishBtn":"hideAddNewDish",
        "click .addDishBtn":"addNewDish"
    },
    initialize: function() {
        _.bindAll(this,"render","removeItem","showAddNewDish","hideAddNewDish","addNewDish");

        this.dishHelper = new ArdoiseDishHelper(this);
        this.model.toBeRemoved = false;
        this.model.bind('change', this.render);
    },

    removeItem:function(item){
        this.model.toBeRemoved = true;
        app.resto.ardoiseOfDate.dishList.
            dishesOfIdDishesBloc((this.model.id)).forEach(
            function(dish){
                dish.toBeRemoved = true;
            }
        );
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
    },

    showAddNewDish:function(e){
        this.dishHelper.showAddNewDish(e);
    },
    hideAddNewDish:function(e){
        this.dishHelper.hideAddNewDish(e);
    },
    addNewDish:function(e){
        this.dishHelper.addNewDish(e,this.model.id);
    }
});