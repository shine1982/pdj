Parse.Events.listenTo = Parse.Events.on;
var app = app || {};
app.ArdoiseView = Parse.View.extend({

    template: _.template($('#ardoise-template').html()),

    events: {
        "click #saveArdoiseBtn":'saveArdoise',
        "click #btnCreateArdoise":'createNewArdoise'
    },

    initialize: function() {
        this.render();

        app.resto.ardoiseOfDate.formulePriceList = new app.ArdoiseFormulePriceList();
        app.resto.ardoiseOfDate.formulePriceList.on('add', this.addFormulePrice);

        if(this.options.modify){
            this.initFormulePriceListFromRelation();
        }
    },

    render: function() {

        this.$el.html( this.template(this.options));
        return this;
    },

    initFormulePriceListFromZero:function(){

            var queryArdoiseFormulePrice = new Parse.Query(app.ArdoiseFormulePrice);
            queryArdoiseFormulePrice.ascending("order");
            queryArdoiseFormulePrice.equalTo("resto",app.resto);
            queryArdoiseFormulePrice.limit(3);
            queryArdoiseFormulePrice.find().then(function(list){
                if(list.length === 0){
                    var platFP = new app.ArdoiseFormulePrice();
                    platFP.set("label","plat");
                    platFP.set("resto",app.resto);
                    platFP.set("order",1);
                    platFP.save().then(
                        function(platFP){
                            app.resto.ardoiseOfDate.formulePriceList.add(platFP);
                            var platDessertFP = new app.ArdoiseFormulePrice();
                            platDessertFP.set("label","entree + plat ou plat + dessert");
                            platDessertFP.set("resto",app.resto);
                            platDessertFP.set("order",2);
                            platDessertFP.save().then(function(platDessertFP){
                                app.resto.ardoiseOfDate.formulePriceList.add(platDessertFP);
                                var entreePlatDessertFP = new app.ArdoiseFormulePrice();
                                entreePlatDessertFP.set("label","entree + plat + dessert");
                                entreePlatDessertFP.set("resto",app.resto);
                                entreePlatDessertFP.set("order",3);
                                entreePlatDessertFP.save().then(function(entreePlatDessertFP){
                                    app.resto.ardoiseOfDate.formulePriceList.add(entreePlatDessertFP);
                                })
                            })
                        }
                    );
                }else{
                    app.resto.ardoiseOfDate.formulePriceList.add(list);
                }
            })


    },

    initFormulePriceListFromRelation:function(){
        var relationFPL = app.resto.ardoiseOfDate.relation("formulePriceList");
        relationFPL.query().ascending("order").find({
            success:function(formulePriceList){
                app.resto.ardoiseOfDate.formulePriceList.add(formulePriceList);
            }
        })
    },

    addFormulePrice:function(ardoiseFormulePrice){
        var ardoiseFormulePriceView = new ArdoiseFormulePriceView({model:ardoiseFormulePrice});
        $("#zoneFormulePrice").append(ardoiseFormulePriceView.render().el);
    },

    createNewArdoise: function(e){

        e.preventDefault();
        var datejsForArdoise = moment($('#ardoiseDatepicker').val(), "DD/MM/YYYY").toDate();
        var that = this;
        this.searchArdoise(datejsForArdoise, function(hasAlreadyArdoise){
            if(hasAlreadyArdoise){
                showMsg(3,"l'ardoise de cette date existe déjà");
            }else{
                app.resto.ardoiseOfDate.set("resto",app.resto);
                app.resto.ardoiseOfDate.set("date",datejsForArdoise);

                app.resto.ardoiseOfDate.save().then(function(){
                    showMsg(0, "Vous venez de créer votre ardoise, modifiez la dés maintenant pour adapter la réalité de votre restaurant!");
                    that.options.modify=true;
                    that.render();
                    that.initFormulePriceListFromZero();

                })
            }
        })

        var ardoise = app.resto.ardoiseOfDate;
    },

    searchArdoise:function(jsDateSelected, callback){

    var queryArdoise = new Parse.Query(app.Ardoise);
    queryArdoise.equalTo("resto", app.resto);
    queryArdoise.equalTo("date",jsDateSelected);
    queryArdoise.find().then(
        function(ardoises){
            if(ardoises.length>0){
                app.resto.ardoiseOfDate =ardoises[0];//donc ardoise existe déjà, c'est une mise à jour
                callback(true);
            }else{
                callback(false);
            }
        },
        function(error){
            showMsg(3,error.message);
        });
    },


    saveArdoise:function(e){
        e.preventDefault();
        var datejsForArdoise = moment($('#ardoiseDatepicker').val(), "DD/MM/YYYY").toDate();
        var ardoiseTitle = $("#ardoiseTitle").val();

        var ardoise = app.resto.ardoiseOfDate;

        ardoise.set("resto",app.resto);
        ardoise.set("date",datejsForArdoise);
        ardoise.set("title",ardoiseTitle);

        this.updateFormulePriceList(function(relationFPL){
            app.resto.ardoiseOfDate.formulePriceList.forEach (function (fpl) {
                if(!fpl.toBeRemoved){
                    relationFPL.add(fpl);
                }
            });
            ardoise.save().then(function(){
                showMsg(0,"L'ardoise a été sauvegardé pour la date "+ $('#ardoiseDatepicker').val());
            });
        })
    },
    updateFormulePriceList:function(callback){
        var relationFPL = app.resto.ardoiseOfDate.relation("formulePriceList");
        if(this.options.modify){
            relationFPL.query().find().then(function(results){
                relationFPL.remove(results);
                callback(relationFPL);
            });
        }else{
            callback(relationFPL);
        }
    }

});