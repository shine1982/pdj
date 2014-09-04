var TodayDishView = Parse.View.extend({

    //... is a list tag.
    tagName:'tr',

    // Cache the template function for a single item.
    template: _.template($('#todaydish-template').html()),

    events: {
        'click .destroy': 'clear',
        'dblclick .nameview':'editname',
        'dblclick .priceview':'editprice',
        "keypress .nameedit"      : "updateNameOnEnter",
        "keypress .priceedit"      : "updatePriceOnEnter",
        'blur .nameedit': 'updateName',
        'blur .priceedit': 'updatePrice'
    },

    editname:function(){
      this.$(".nameview").parent().addClass("editing");
      this.$("input.nameedit").focus();
    },

    editprice:function(){
        this.$(".priceview").parent().addClass("editing");
        this.$("input.priceedit").first().focus();
    },

    updateName:function(){
        var that = this;
        this.$(".nameview").parent().removeClass("editing");
        this.model.set("name",this.$("input.nameedit:eq(0)").val());
        this.model.save().then(function(){that.render();});
    },
    updatePrice:function(){
        var that = this;
        this.$(".priceview").parent().removeClass("editing");
        this.model.set("priceEuro",this.$("input.priceedit:eq(0)").val());
        this.model.set("priceCentimes",this.$("input.priceedit:eq(1)").val());
        this.model.save().then(function(){that.render();});

    },

    updateNameOnEnter:function(e){
        if (e.keyCode == 13) this.updateName();
    },
    updatePriceOnEnter:function(e){
        if (e.keyCode == 13) this.updatePrice();
    },

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
        _.bindAll(this, 'render','clear','editname','editprice','updateName','updatePrice','updateNameOnEnter','updatePriceOnEnter');
        this.model.bind('change', this.render);
    },

    render: function() {
        var recurrence = this.model.get("recurrence");
        var nextDate="";
        if(recurrence!=='jamais' &&  app.weekRef[recurrence]){

            var nbDaysToAdd = app.weekRef[recurrence] - moment().isoWeekday();
            if(nbDaysToAdd<0){
                nbDaysToAdd+=7;
            }
            nextDate = moment().add('d', nbDaysToAdd).format("DD/MM/YYYY");

        }
        this.$el.html( this.template({todayDish:this.model,nextDate: nextDate}));

        return this;
    },
    clear: function(){
        this.model.destroy();
        this.remove();
        _.delay(retrievedPlatdujour, 1000);
    }
});