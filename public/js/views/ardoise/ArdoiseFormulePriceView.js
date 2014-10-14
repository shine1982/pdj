Parse.Events.listenTo = Parse.Events.on;
var ArdoiseFormulePriceView = Parse.View.extend({

    tagName:'div',
    tagClass:'form-group',

    // Cache the template function for a single item.
    template: _.template($('#ardoise-formule-price-template').html()),

    events: {
        'click .destroy': 'clear'
    },

    initialize: function(id) {
        var that = this;
        that.idResto = id;
        if(id){
            if(app.resto && app.resto.id === id){
                this.initArdoise();
            }else{
                var query = new Parse.Query(app.Restaurant);
                query.get(id, {
                    success: function(resto) {
                        app.resto = resto;
                        that.initMenu();
                    },
                    error: function(object, error) {
                        showMsg(3,"Error pour récuperer le resto avec id "+that.idResto +" ("+error+")");
                    }
                });
            }
        }
    },
    init3rdBootstrapComponent:function(){
        $('#ardoiseDatepicker').datepicker('setValue', new Date()).on('changeDate',
            function(ev){
                $('#ardoiseDatepicker').datepicker('hide');
            });
    },

    initArdoise:function(){
        app.resto.ardoise = new app.Ardoise();
        app.resto.ardoise.formulePriceList = new app.ArdoiseFormulePriceList();
        app.resto.ardoise.formulePriceList.on('add', this.addOne);


        var queryDishes = new Parse.Query(app.Dish);
        queryDishes.equalTo("resto", app.resto);
        queryDishes.find({
            success: function(results){
                app.resto.menu.add(results);
            }
        });
    },
    addOne:function(ardoiseFormulePrice){
        var ardoiseFormulePriceView = new ArdoiseFormulePriceView({model:ardoiseFormulePrice})
        var idSelector = "#starter";
        if(dish.get("dishType")==2){
            idSelector = "#maincourse";
        }else if(dish.get("dishType")==3){
            idSelector = "#dessert";
        }
        $(idSelector + " tr:last-child").before(dishView.render().el);
    },

    saveDish:function(e){
        var dishType = e.target.value;
        var dishName = $("#dishName"+dishType).val();
        var dishPriceEuro = $("#dishPriceEuro"+dishType).val();
        var dishPriceCentimes = $("#dishPriceCentimes"+dishType).val();
        this.saveDishToParse(dishName,dishPriceEuro,dishPriceCentimes,dishType);
        $("#dishName"+dishType).val('');
        $("#dishPriceEuro"+dishType).val('');
    },
    /*
     saveDishToParse: function(name, priceEuro, priceCentimes, dishType){//Type 1 entree, type 2 plat, type 3 dessert
     var dish = new app.Dish();
     dish.set("resto",app.resto);
     dish.set("name",name);
     dish.set("priceEuro",priceEuro);
     dish.set("priceCentimes",priceCentimes);
     dish.set("dishType",dishType);
     dish.set("order", app.resto.menu.nextOrder(dishType));
     dish.save().then(
     function(dish){
     app.resto.menu.add(dish);
     },
     function(dish,error){
     showMsg(3,error);
     }
     )
     },
     */
    render: function() {
        this.$el.html( this.template());
        this.init3rdBootstrapComponent();
        return this;
    }
});