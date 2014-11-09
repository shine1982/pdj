var app = app || {};
app.ArdoiseVisuView = Parse.View.extend({

    tagName :"div",

    template: doT.template($('#ardoise-visu-template').html()),

    events: {


    },

    initialize: function() {
        _.bindAll(this,"render","renderDishes");
    },

    render: function() {
        this.$el.html( this.template({
            titleArdoise:app.resto.ardoiseOfDate.get("title"),
            formulePriceList:app.resto.ardoiseOfDate.formulePriceList.withPriceList(),
            dishesBlocList: app.resto.ardoiseOfDate.dishesBlocList.hasDishesList(app.resto.ardoiseOfDate.dishList),
            textList:app.resto.ardoiseOfDate.textList.notToBeRemovedList()
        }));
        return this;
    },

    renderDishes: function(){
        var dlist = app.resto.ardoiseOfDate.dishList.notToBeRemovedList();
        for(var i=0; i<dlist.length; i++){
            var dish = dlist[i];
            var priceToShow="";
            if(dish.get("priceEuro")!=""){
                //priceToShow = "<div class='pull-right'>"+dish.get("priceEuro")+" €</div>";
                priceToShow = "  " + dish.get('priceEuro')+" €";
            }
            $("#visuArdoiseModal ."+dish.get("idDishesBloc")).append("<p>"+dish.get("label")+priceToShow+"</p>");
        }
    }
});