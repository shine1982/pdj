Parse.Events.listenTo = Parse.Events.on;
var ArdoiseView = Parse.View.extend({

    el:'#restoManagement',

    // Cache the template function for a single item.
    template: _.template($('#ardoise-template').html()),

    events: {
       // 'click .addDish': 'saveDish'
        "click #saveArdoiseBtn":'saveArdoise'
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
                       that.initArdoise();
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

        this.init3rdBootstrapComponent();

        app.resto.ardoise = new app.Ardoise();
        app.resto.ardoise.formulePriceList = new app.ArdoiseFormulePriceList();
        app.resto.ardoise.formulePriceList.on('add', this.addFormulePrice);

        var platFP = new app.ArdoiseFormulePrice();
        platFP.set("label","plat");
        var platDessertFP = new app.ArdoiseFormulePrice();
        platDessertFP.set("label","entree + plat ou plat + dessert");
        var entreePlatDessertFP = new app.ArdoiseFormulePrice();
        entreePlatDessertFP.set("label","entree + plat + dessert");

        app.resto.ardoise.formulePriceList.add(platFP);
        app.resto.ardoise.formulePriceList.add(platDessertFP);
        app.resto.ardoise.formulePriceList.add(entreePlatDessertFP);




        /*
        var queryDishes = new Parse.Query(app.Dish);
        queryDishes.equalTo("resto", app.resto);
        queryDishes.find({
            success: function(results){
                app.resto.menu.add(results);
            }
        });*/
    },
    addFormulePrice:function(ardoiseFormulePrice){
        var ardoiseFormulePriceView = new ArdoiseFormulePriceView({model:ardoiseFormulePrice});
        $("#zoneFormulePrice").append(ardoiseFormulePriceView.render().el);
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

    saveArdoise:function(){
      var dateForArdoise = $('#ardoiseDatepicker').val();
      var datejsForArdoise = moment(dateForArdoise, "DD/MM/YYYY").toDate();
      var resto = app.resto;

      var queryArdoise = new Parse.Query(app.Ardoise);
        queryArdoise.equalTo("resto", app.resto);
        queryArdoise.equalTo("date",datejsForArdoise);

        queryArdoise.find().then(function(ardoises){
                //donc pour l'instant on traite le premier ardoise
                if(ardoises.length>0){
                   var ardoise=ardoises[0];//donc ardoise existe déjà, c'est une mise à jour
                   console.log("ardoise existe déjà");

                }else{

                    var ardoise = new app.Ardoise();

                }
            },
            function(error){
                console.log("Pb de recuperation d'ardoise");
            });
    },

    getNewlySetArdoise:function(ardoise){
        if(app.resto.ardoise.formulePriceList.length==0){
            ardoise.set("title",$("#ardoiseTitle").val());
            //TO BE CONTINU.....ICI

        }

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

        return this;
    }
});