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
        _.bindAll(this,"render","removeItem","showAddNewDish","hideAddNewDish","addNewDish","addDish");
        this.dishHelper = new ArdoiseDishHelper(this);
        this.render();
        this.model.dishList = new app.ArdoiseDishList();
        this.dishListViews = [];
        var self=this;
        app.resto.ardoiseOfDate.dishList.dishesOfIdDishesBloc(this.model.id).forEach(function(dish){
            self.model.dishList.add(dish);
        })
        this.model.dishList.on('add',this.addDish);
    },

    removeItem:function(){
        //delete also all sous items
        for(var i=0; i<this.dishListViews.length; i++){
            this.dishListViews[i].removeItem();
        }
        app.parseRelationHelper.deleteItemFromRelation(app.resto.ardoiseOfDate,
            app.constants.RELATION_DISHES_BLOC_LIST, app.resto.ardoiseOfDate.dishesBlocList,this.model);
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
        var newLabel = this.$(".dishesBlocLabelInput").val();
        this.$(".dishesBlocLabel").text(newLabel)
        this.model.set("label", newLabel);
        this.model.save();

    },

    render: function() {
        var theme = "default";
        var themeArray = ["success","info","warning"];
        var order = this.model.get('order');
        if(order>0 && order<=themeArray.length){
            theme = themeArray[order-1];
        }
        var self=this;
        this.$el.html( this.template(_.extend(this.model.attributes, {id:this.model.id},{theme:theme})));

        if(this.model.dishList && this.model.dishList.length>0) {
            this.model.dishList.forEach(function(dish){
                self.addDish(dish);
            })
        }
        return this;
    },

    showAddNewDish:function(e){
        this.dishHelper.showAddNewDish(e);
    },
    hideAddNewDish:function(e){
        this.dishHelper.hideAddNewDish(e);
    },
    addNewDish:function(e){
        this.dishHelper.addNewDish(e,this.model);
    },
    addDish:function(dish){
        var ardoiseDishView = new app.ArdoiseDishView({model:dish});
        ardoiseDishView.parentView=this;
        this.dishListViews.push(ardoiseDishView);
        this.$(".showAddDishBtn").before(ardoiseDishView.render().el);
    }
});